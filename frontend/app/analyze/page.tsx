'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, Loader2, RotateCcw, AlertCircle, ArrowRight, Eye, Columns, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ResultsDisplay } from '@/components/results-display'



const SAMPLE_RETINAS = [
  { name: 'Retina 1 (DR)', path: '/samples/100_left.jpeg' },
  { name: 'Retina 2 (Glaucoma)', path: '/samples/download (3).jpeg' },
  { name: 'Retina 3 (Normal)', path: '/samples/download (6).jpeg' },
]

export default function AnalyzePage() {
  const [isCompareMode, setIsCompareMode] = useState(false)
  const [isLoadingA, setIsLoadingA] = useState(false)
  const [previewUrlA, setPreviewUrlA] = useState<string | null>(null)
  const [resultA, setResultA] = useState<any>(null)
  const [errorA, setErrorA] = useState<string | null>(null)

  const [isLoadingB, setIsLoadingB] = useState(false)
  const [previewUrlB, setPreviewUrlB] = useState<string | null>(null)
  const [resultB, setResultB] = useState<any>(null)
  const [errorB, setErrorB] = useState<string | null>(null)
  const [isDraggingA, setIsDraggingA] = useState(false)
  const [isDraggingB, setIsDraggingB] = useState(false)
  const fileInputRefA = useRef<HTMLInputElement>(null)
  const fileInputRefB = useRef<HTMLInputElement>(null)



  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return 'Please upload a fundus photograph (JPEG, PNG, WEBP).'
    }
    if (file.size > 16 * 1024 * 1024) {
      return 'File size exceeds 16MB threshold.'
    }
    return null
  }

  const executeInference = async (file: File, target: 'A' | 'B', filename: string) => {
    const isTargetA = target === 'A'
    if (isTargetA) {
      setIsLoadingA(true)
      setErrorA(null)
      setResultA(null)
    } else {
      setIsLoadingB(true)
      setErrorB(null)
      setResultB(null)
    }

    try {
      const formData = new FormData()
      formData.append('image', file)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => null)
        const msg = errJson?.error || 'Fundus verification rejected image. Ensure clear circular retinal capture.'
        if (isTargetA) setErrorA(msg)
        else setErrorB(msg)
        return
      }

      const data = await res.json()
      const formattedDiagnosis = data.predicted_class
        .replace(/_/g, ' ')
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

      const transformed = {
        primaryDiagnosis: formattedDiagnosis,
        confidence: Math.round(data.confidence),
        severity: data.confidence >= 80 ? 'High' : data.confidence >= 60 ? 'Moderate' : 'Low',
        icon: data.icon,
        description: data.description,
        symptoms: Array.isArray(data.symptoms)
          ? data.symptoms
          : typeof data.symptoms === 'string'
          ? data.symptoms.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
        color: data.color,
        findings: Object.entries(data.all_predictions).map(([cond, conf]: [string, any]) => ({
          condition: cond
            .replace(/_/g, ' ')
            .split(' ')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          severity: conf >= 50 ? 'Present' : 'None',
          confidence: Math.round(conf),
        })),
        recommendation:
          data.predicted_class === 'normal'
            ? 'Retinal architecture appears physiological. Routine interval follow-up recommended.'
            : `Pathology detected (${formattedDiagnosis}). Clinical consultation with an ophthalmologist advised.`,
      }

      if (isTargetA) {
        setResultA(transformed)
      } else {
        setResultB(transformed)
      }
    } catch (err) {
      const msg = 'Inference server unreachable. Ensure backend is running on port 5000.'
      if (isTargetA) setErrorA(msg)
      else setErrorB(msg)
    } finally {
      if (isTargetA) setIsLoadingA(false)
      else setIsLoadingB(false)
    }
  }

  const handleFileA = (file: File) => {
    const error = validateFile(file)
    if (error) {
      setErrorA(error)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setPreviewUrlA(url)
      executeInference(file, 'A', file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleFileB = (file: File) => {
    const error = validateFile(file)
    if (error) {
      setErrorB(error)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setPreviewUrlB(url)
      executeInference(file, 'B', file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleSampleSelect = async (path: string, target: 'A' | 'B') => {
    try {
      const res = await fetch(path)
      const blob = await res.blob()
      const file = new File([blob], path.split('/').pop() || 'sample.jpeg', { type: 'image/jpeg' })
      if (target === 'A') handleFileA(file)
      else handleFileB(file)
    } catch (e) {}
  }

  const resetAnalysis = () => {
    setPreviewUrlA(null)
    setResultA(null)
    setErrorA(null)
    setPreviewUrlB(null)
    setResultB(null)
    setErrorB(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">OculusAI • Pathology Screening</div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Retinal Fundus Analysis</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Automated multi-class classification for Diabetic Retinopathy, Glaucoma, Cataracts, and Normal fundus.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant={isCompareMode ? 'secondary' : 'outline'}
              size="sm"
              className="text-xs font-mono"
              onClick={() => setIsCompareMode(!isCompareMode)}
            >
              <Columns className="h-3.5 w-3.5 mr-1.5" />
              {isCompareMode ? 'Exit Comparison' : 'Compare Scan (OD/OS)'}
            </Button>
            {(previewUrlA || previewUrlB) && (
              <Button variant="ghost" size="sm" className="text-xs font-mono text-muted-foreground" onClick={resetAnalysis}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>

        {!isCompareMode ? (
          <div>
            {!previewUrlA ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <Card
                  className={`p-10 sm:p-14 border border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                    isDraggingA ? 'border-foreground bg-muted/40' : 'border-border hover:border-foreground/40 bg-card'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingA(true) }}
                  onDragLeave={() => setIsDraggingA(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDraggingA(false)
                    if (e.dataTransfer.files?.[0]) handleFileA(e.dataTransfer.files[0])
                  }}
                  onClick={() => fileInputRefA.current?.click()}
                >
                  <input
                    ref={fileInputRefA}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileA(e.target.files[0])
                    }}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/30 text-foreground">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold tracking-tight">Upload Retinal Fundus Photograph</div>
                    <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                      Drag and drop image or click to browse. System automatically evaluates circular fundus boundaries and optical contrast.
                    </p>
                  </div>
                </Card>

                {errorA && (
                  <div className="rounded border border-red-500/30 bg-red-500/5 p-4 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold font-mono uppercase text-[10px] block">Verification Note</span>
                      {errorA}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border text-xs font-mono text-muted-foreground">
                  <span>Standard Samples:</span>
                  <div className="flex gap-3">
                    {SAMPLE_RETINAS.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSampleSelect(s.path, 'A')}
                        className="underline hover:text-foreground"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-64 shrink-0">
                    <Card className="p-3 border border-border bg-card">
                      <div className="aspect-square relative rounded overflow-hidden bg-muted/20 flex items-center justify-center">
                        <img src={previewUrlA} alt="Retina Fundus" className="w-full h-full object-contain" />
                      </div>
                      <div className="mt-3 flex items-center justify-end text-[11px] font-mono text-muted-foreground px-1">
                        <button onClick={() => fileInputRefA.current?.click()} className="underline hover:text-foreground">
                          Replace
                        </button>
                        <input
                          ref={fileInputRefA}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileA(e.target.files[0])
                          }}
                        />
                      </div>
                    </Card>
                  </div>

                  <div className="flex-1">
                    {isLoadingA ? (
                      <Card className="p-12 border border-border bg-card flex flex-col items-center justify-center space-y-3 min-h-[300px]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">Running Pathology Classification...</span>
                      </Card>
                    ) : errorA ? (
                      <Card className="p-6 border border-red-500/30 bg-red-500/5 text-xs text-red-600 dark:text-red-400">
                        <span className="font-mono uppercase font-semibold text-[10px] block mb-1">Error</span>
                        {errorA}
                      </Card>
                    ) : resultA ? (
                      <ResultsDisplay result={resultA} imageUrl={previewUrlA} />
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono border-b border-border pb-2">
                  <span className="font-semibold text-foreground">Scan A (OD - Right Eye)</span>
                  {previewUrlA && (
                    <button onClick={() => { setPreviewUrlA(null); setResultA(null) }} className="text-muted-foreground hover:text-foreground">
                      Reset
                    </button>
                  )}
                </div>

                {!previewUrlA ? (
                  <Card
                    className="p-8 border border-dashed text-center cursor-pointer hover:border-foreground/40 bg-card min-h-[240px] flex flex-col items-center justify-center"
                    onClick={() => fileInputRefA.current?.click()}
                  >
                    <input
                      ref={fileInputRefA}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleFileA(e.target.files[0]) }}
                    />
                    <Upload className="h-5 w-5 text-muted-foreground mb-2" />
                    <span className="text-xs font-medium">Select Scan A</span>
                    <span className="text-[11px] font-mono text-muted-foreground mt-1">Right Eye / Baseline</span>
                  </Card>
                ) : (
                  <Card className="p-4 border border-border bg-card space-y-3">
                    <div className="aspect-video relative rounded overflow-hidden bg-black/5 flex items-center justify-center">
                      <img src={previewUrlA} alt="Scan A" className="max-h-full max-w-full object-contain" />
                    </div>
                    {isLoadingA ? (
                      <div className="flex items-center justify-center py-6 text-xs font-mono text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Evaluating...
                      </div>
                    ) : resultA ? (
                      <div className="pt-2 border-t border-border space-y-1 text-xs">
                        <div className="flex justify-between font-mono">
                          <span className="font-semibold text-foreground">{resultA.primaryDiagnosis}</span>
                          <span className="text-muted-foreground">{resultA.confidence}%</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{resultA.description}</p>
                      </div>
                    ) : null}
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono border-b border-border pb-2">
                  <span className="font-semibold text-foreground">Scan B (OS - Left Eye)</span>
                  {previewUrlB && (
                    <button onClick={() => { setPreviewUrlB(null); setResultB(null) }} className="text-muted-foreground hover:text-foreground">
                      Reset
                    </button>
                  )}
                </div>

                {!previewUrlB ? (
                  <Card
                    className="p-8 border border-dashed text-center cursor-pointer hover:border-foreground/40 bg-card min-h-[240px] flex flex-col items-center justify-center"
                    onClick={() => fileInputRefB.current?.click()}
                  >
                    <input
                      ref={fileInputRefB}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleFileB(e.target.files[0]) }}
                    />
                    <Upload className="h-5 w-5 text-muted-foreground mb-2" />
                    <span className="text-xs font-medium">Select Scan B</span>
                    <span className="text-[11px] font-mono text-muted-foreground mt-1">Left Eye / Follow-up</span>
                  </Card>
                ) : (
                  <Card className="p-4 border border-border bg-card space-y-3">
                    <div className="aspect-video relative rounded overflow-hidden bg-black/5 flex items-center justify-center">
                      <img src={previewUrlB} alt="Scan B" className="max-h-full max-w-full object-contain" />
                    </div>
                    {isLoadingB ? (
                      <div className="flex items-center justify-center py-6 text-xs font-mono text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Evaluating...
                      </div>
                    ) : resultB ? (
                      <div className="pt-2 border-t border-border space-y-1 text-xs">
                        <div className="flex justify-between font-mono">
                          <span className="font-semibold text-foreground">{resultB.primaryDiagnosis}</span>
                          <span className="text-muted-foreground">{resultB.confidence}%</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{resultB.description}</p>
                      </div>
                    ) : null}
                  </Card>
                )}
              </div>
            </div>

            {resultA && resultB && (
              <Card className="p-5 border border-border bg-muted/20 text-xs space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-wider text-foreground">Bilateral Differential</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Symmetry: </span>
                    <span className="font-semibold text-foreground">
                      {resultA.primaryDiagnosis === resultB.primaryDiagnosis ? 'Concordant' : 'Discordant'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confidence Delta: </span>
                    <span className="font-mono font-medium text-foreground">
                      {Math.abs(resultA.confidence - resultB.confidence)}%
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
