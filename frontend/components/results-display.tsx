'use client'

import { AlertCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

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
  }
}

const diseaseDescriptions: Record<string, string> = {
  'Diabetic Retinopathy': 'A complication of diabetes that damages the blood vessels in the retina. Early detection and management can prevent vision loss.',
  'Microaneurysms': 'Small outpouchings of capillary walls in the retina, often the earliest sign of diabetic retinopathy.',
  'Hard Exudates': 'Yellowish deposits of lipids that accumulate in the retina due to leaking blood vessels.',
  'Retinal Thickening': 'Swelling of the retina (macular edema) that can affect central vision.',
  'Optic Disc Abnormality': 'Changes to the optic disc that connects the eye to the brain, requiring further evaluation.'
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null)

  const getSeverityColor = (severity: string) => {
    if (severity === 'Present' || severity === 'Moderate') return 'bg-amber-500/20 border-amber-500/30'
    if (severity === 'Severe') return 'bg-red-500/20 border-red-500/30'
    return 'bg-emerald-500/20 border-emerald-500/30'
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === 'None') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    return <AlertCircle className="w-5 h-5 text-amber-500" />
  }

  return (
    <div className="space-y-6">
      {/* Primary Diagnosis */}
      <Card className={`p-6 border transition-smooth animate-fade-in-up ${getSeverityColor(result.severity)}`}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{result.primaryDiagnosis}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {diseaseDescriptions[result.primaryDiagnosis] || 'Further evaluation recommended.'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Severity: <span className="font-semibold text-foreground">{result.severity}</span>
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="font-bold text-lg">{result.confidence}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Findings */}
      <div>
        <h4 className="font-bold text-lg mb-4 animate-fade-in-up">Detailed Findings</h4>
        <div className="space-y-3">
          {result.findings.map((finding, idx) => (
            <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${0.05 * idx}s` }}>
              <Card
                className="p-4 bg-card border-border/40 hover:border-primary/40 transition-smooth-lg cursor-pointer hover:shadow-md hover:shadow-primary/10"
                onClick={() => setExpandedFinding(expandedFinding === finding.condition ? null : finding.condition)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    {getSeverityIcon(finding.severity)}
                    <div>
                      <p className="font-semibold">{finding.condition}</p>
                      <p className="text-xs text-muted-foreground">{finding.severity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                        style={{ width: `${finding.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-10 text-right">{finding.confidence}%</span>
                  </div>
                </div>
              </Card>
              {expandedFinding === finding.condition && (
                <Card className="mt-2 p-3 bg-muted/50 border-border/40 animate-scale-in">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      {diseaseDescriptions[finding.condition] || 'No additional information available.'}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <Card className="p-4 bg-primary/10 border-primary/30 animate-fade-in-up transition-smooth" style={{ animationDelay: '0.3s' }}>
        <p className="text-sm">
          <span className="font-bold">Clinical Recommendation:</span> {result.recommendation}
        </p>
      </Card>
    </div>
  )
}
