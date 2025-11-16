'use client'

import { AlertCircle, CheckCircle2, TrendingUp, Info, Activity, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'

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
    symptoms?: string[]
    color?: string
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
  const [animatedConfidence, setAnimatedConfidence] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(result.confidence)
    }, 200)
    return () => clearTimeout(timer)
  }, [result.confidence])

  const getSeverityColor = (severity: string) => {
    if (severity === 'Present' || severity === 'Moderate' || severity === 'High') return 'bg-amber-500/20 border-amber-500/30'
    if (severity === 'Severe') return 'bg-red-500/20 border-red-500/30'
    return 'bg-emerald-500/20 border-emerald-500/30'
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === 'None' || severity === 'Low') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    return <AlertCircle className="w-5 h-5 text-amber-500" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-500'
    if (confidence >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Primary Diagnosis with Radial Chart */}
      <Card className={`p-6 border transition-smooth hover-lift animate-fade-in-up ${getSeverityColor(result.severity)}`}>
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Radial Progress Chart */}
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/30"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - animatedConfidence / 100)}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="text-primary" stopColor="currentColor" />
                  <stop offset="100%" className="text-accent" stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getConfidenceColor(result.confidence)}`}>
                {animatedConfidence}%
              </span>
              <span className="text-xs text-muted-foreground">Confidence</span>
            </div>
          </div>

          {/* Diagnosis Details */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{result.primaryDiagnosis}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                    {result.severity} Severity
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {result.description || diseaseDescriptions[result.primaryDiagnosis] || 'Further evaluation recommended.'}
            </p>
            {result.symptoms && Array.isArray(result.symptoms) && result.symptoms.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Common Symptoms:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.symptoms.map((symptom, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Findings with Bar Chart Visualization */}
      <div>
        <h4 className="font-bold text-lg mb-4 animate-fade-in-up flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Detailed Analysis
        </h4>
        <div className="space-y-3">
          {result.findings.map((finding, idx) => (
            <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${0.05 * idx}s` }}>
              <Card
                className="p-4 bg-card border-border/40 hover:border-primary/40 transition-smooth-lg cursor-pointer hover-lift"
                onClick={() => setExpandedFinding(expandedFinding === finding.condition ? null : finding.condition)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {getSeverityIcon(finding.severity)}
                      <div className="flex-1">
                        <p className="font-semibold">{finding.condition}</p>
                        <p className="text-xs text-muted-foreground">{finding.severity}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${getConfidenceColor(finding.confidence)}`}>
                      {finding.confidence}%
                    </span>
                  </div>
                  {/* Bar chart visualization */}
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${finding.confidence}%`,
                        animationDelay: `${0.1 * idx}s`
                      }}
                    />
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
      <Card className="p-5 bg-primary/10 border-primary/30 animate-fade-in-up hover-lift transition-smooth" style={{ animationDelay: '0.3s' }}>
        <div className="flex gap-3">
          <div className="p-2 rounded-lg bg-primary/20 h-fit">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold mb-1">Clinical Recommendation</p>
            <p className="text-sm text-muted-foreground">{result.recommendation}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
