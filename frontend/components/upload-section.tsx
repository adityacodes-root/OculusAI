'use client'

import { useState } from 'react'
import { Upload, Loader2, AlertCircle, CheckCircle2, EyeIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function UploadSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
      simulateAnalysis()
    }
    reader.readAsDataURL(file)
  }

  const simulateAnalysis = async () => {
    setIsLoading(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const mockResult = {
      primaryDiagnosis: 'Diabetic Retinopathy',
      confidence: 94,
      severity: 'Moderate',
      findings: [
        { condition: 'Microaneurysms', severity: 'Present', confidence: 96 },
        { condition: 'Hard Exudates', severity: 'Present', confidence: 92 },
        { condition: 'Retinal Thickening', severity: 'Mild', confidence: 88 },
        { condition: 'Optic Disc Abnormality', severity: 'None', confidence: 98 }
      ],
      recommendation: 'Schedule ophthalmologist consultation within 2 weeks'
    }
    
    setAnalysisResult(mockResult)
    setIsLoading(false)
  }

  return (
    <section className="py-12 px-4 bg-background">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Retinal Image Analysis</h2>
          <p className="text-muted-foreground">Upload a retinal fundus image for AI-powered disease detection</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload Area */}
          <div>
            <Card 
              className={`p-8 border-2 border-dashed cursor-pointer transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-card hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label className="flex flex-col items-center justify-center gap-3 cursor-pointer">
                <div className="p-3 rounded-lg bg-muted">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Drag and drop your image</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>
            </Card>
          </div>

          {/* Preview Area */}
          {previewUrl && (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-lg overflow-hidden border border-border bg-muted aspect-square">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Retinal image preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                onClick={() => {
                  setPreviewUrl(null)
                  setAnalysisResult(null)
                }}
                variant="outline"
                className="w-full"
              >
                Upload Different Image
              </Button>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-8 space-y-6">
            {/* Primary Result */}
            <Card className="p-6 bg-card border-primary/30">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  analysisResult.severity === 'Moderate' 
                    ? 'bg-accent/20' 
                    : 'bg-emerald-500/20'
                }`}>
                  {analysisResult.severity === 'Moderate' ? (
                    <AlertCircle className="w-6 h-6 text-accent" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {analysisResult.primaryDiagnosis}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Severity: <span className="font-medium text-foreground">{analysisResult.severity}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${analysisResult.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {analysisResult.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detailed Findings */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Findings</h3>
              <div className="space-y-3">
                {analysisResult.findings.map((finding: any, idx: number) => (
                  <Card key={idx} className="p-4 bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{finding.condition}</p>
                        <p className="text-sm text-muted-foreground">{finding.severity}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-chart-1 rounded-full"
                              style={{ width: `${finding.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground w-8">
                            {finding.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <Card className="p-4 bg-primary/10 border-primary/30">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Clinical Recommendation:</span> {analysisResult.recommendation}
              </p>
            </Card>
          </div>
        )}

        {isLoading && (
          <div className="mt-8 flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Analyzing retinal image...</p>
          </div>
        )}
      </div>
    </section>
  )
}
