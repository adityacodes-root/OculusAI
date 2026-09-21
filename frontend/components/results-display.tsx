'use client'

import { AlertCircle, CheckCircle2, TrendingUp, Activity, Eye, Download, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { PDFReportGenerator } from '@/components/pdf-report-generator'

interface ResultsDisplayProps {
  result: {
    primaryDiagnosis: string
    confidence: number
    severity: string
    findings: Array<{
      condition: string
      severity: string
      confidence: number
    }>
    recommendation: string
    icon?: string
    description?: string
    symptoms?: string[] | string
    color?: string
  }
  imageUrl?: string
}

const diseaseDescriptions: Record<string, string> = {
  'Diabetic Retinopathy': 'Microvascular damage in retinal vessels triggered by chronic hyperglycemia. Manifests with microaneurysms, hemorrhages, and macular edema.',
  'Cataract': 'Progressive opacification of the natural crystalline lens causing photon scattering and optical defocus.',
  'Glaucoma': 'Progressive optic neuropathy with thinning of retinal nerve fiber layers, often correlated with elevated intraocular pressure.',
  'Normal': 'No detectable lesions, vascular microaneurysms, or optic disc cup-to-disc ratio abnormalities.'
}

export function ResultsDisplay({ result, imageUrl }: ResultsDisplayProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(result.confidence)
    }, 150)
    return () => clearTimeout(timer)
  }, [result.confidence])

  const isNormal = result.primaryDiagnosis.toLowerCase() === 'normal'

  const symptomsList = Array.isArray(result.symptoms)
    ? result.symptoms
    : typeof result.symptoms === 'string'
    ? (result.symptoms as string).split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-6 sm:p-8 border border-border bg-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Primary Finding</div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-1">
                {result.primaryDiagnosis}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium ${
                  isNormal
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                    : 'border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400'
                }`}
              >
                {isNormal ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {isNormal ? 'Physiological' : `${result.severity} Risk`}
              </span>
              <span className="text-xl sm:text-2xl font-mono font-semibold text-foreground">
                {animatedConfidence}%
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Clinical Summary</div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {result.description || diseaseDescriptions[result.primaryDiagnosis] || 'Ophthalmic pathology screening indicated.'}
              </p>
            </div>

            {symptomsList.length > 0 && (
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Associated Manifestations</div>
                <div className="flex flex-wrap gap-1.5">
                  {symptomsList.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded border border-border bg-muted/20 p-3.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground mr-1">Recommendation:</span>
              {result.recommendation}
            </div>
          </div>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="p-6 border border-border bg-card flex flex-col justify-between flex-1">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Documentation</div>
              <h3 className="text-base font-semibold tracking-tight text-foreground mt-1">Diagnostic Report</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Generate an archival clinical summary with full model probability distribution, disease metrics, and fundus scan attachment.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <PDFReportGenerator result={result} imageUrl={imageUrl} />
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 border border-border bg-card">
        <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Multi-Class Probability Distribution
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {result.findings.map((f, idx) => (
            <div key={idx} className="rounded border border-border bg-muted/10 p-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-foreground font-medium">{f.condition}</span>
                <span className="text-muted-foreground">{f.confidence}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-foreground h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${f.confidence}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
