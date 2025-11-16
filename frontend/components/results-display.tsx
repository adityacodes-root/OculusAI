'use client'

import { AlertCircle, CheckCircle2, TrendingUp, Activity, Eye, Download, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
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
    symptoms?: string[]
    color?: string
  }
  imageUrl?: string
}

const diseaseDescriptions: Record<string, string> = {
  'Diabetic Retinopathy': 'A complication of diabetes that damages the blood vessels in the retina. Early detection and management can prevent vision loss.',
  'Microaneurysms': 'Small outpouchings of capillary walls in the retina, often the earliest sign of diabetic retinopathy.',
  'Hard Exudates': 'Yellowish deposits of lipids that accumulate in the retina due to leaking blood vessels.',
  'Retinal Thickening': 'Swelling of the retina (macular edema) that can affect central vision.',
  'Optic Disc Abnormality': 'Changes to the optic disc that connects the eye to the brain, requiring further evaluation.',
  'Cataract': 'Clouding of the eye\'s natural lens, leading to blurry vision and glare. Treatable with surgery.',
  'Glaucoma': 'Damage to the optic nerve, often from high eye pressure. Can cause permanent vision loss if untreated.',
  'Normal': 'No significant abnormalities detected in the retinal scan.'
}

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export function ResultsDisplay({ result, imageUrl }: ResultsDisplayProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0)
  const [animatedFindings, setAnimatedFindings] = useState<number[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(result.confidence)
      setAnimatedFindings(result.findings.map(f => f.confidence))
    }, 200)
    return () => clearTimeout(timer)
  }, [result.confidence, result.findings])

  const getSeverityColor = (severity: string) => {
    if (severity === 'Present' || severity === 'Moderate' || severity === 'High') return 'border-amber-500/30 bg-amber-500/5'
    if (severity === 'Severe') return 'border-red-500/30 bg-red-500/5'
    return 'border-emerald-500/30 bg-emerald-500/5'
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === 'None' || severity === 'Low') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    return <AlertCircle className="w-4 h-4 text-amber-500" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (confidence >= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const pieChartData = result.findings.map((finding, idx) => ({
    name: finding.condition.length > 20 ? finding.condition.substring(0, 18) + '...' : finding.condition,
    fullName: finding.condition,
    value: finding.confidence,
    color: CHART_COLORS[idx % CHART_COLORS.length]
  }))

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Primary Diagnosis - Large Card (Top Left) */}
        <Card className={`lg:col-span-8 p-6 border-2 transition-all duration-300 hover:shadow-lg ${getSeverityColor(result.severity)}`}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Circular Progress */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-muted/20 dark:text-muted/10"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 64}`}
                  strokeDashoffset={`${2 * Math.PI * 64 * (1 - animatedConfidence / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getConfidenceColor(result.confidence)}`}>
                  {animatedConfidence}%
                </span>
                <span className="text-xs text-muted-foreground mt-1">Confidence</span>
              </div>
            </div>

            {/* Diagnosis Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Diagnosis</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">{result.primaryDiagnosis}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  {getSeverityIcon(result.severity)}
                  <span className="text-sm font-medium text-foreground">{result.severity} Severity</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.description || diseaseDescriptions[result.primaryDiagnosis] || 'Further evaluation recommended.'}
              </p>

              {result.symptoms && Array.isArray(result.symptoms) && result.symptoms.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold flex items-center gap-2 text-foreground uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5" />
                    Common Symptoms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.symptoms.map((symptom, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2.5 py-1 rounded-md bg-muted/60 dark:bg-muted/30 text-foreground border border-border/50"
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

        {/* Action Buttons - Vertical Stack (Top Right) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <PDFReportGenerator result={result} imageUrl={imageUrl} />
          <Card className="flex-1 p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <FileText className="w-8 h-8 text-primary mb-1" />
              <p className="text-sm font-semibold text-foreground">Comprehensive Report</p>
              <p className="text-xs text-muted-foreground">Download detailed PDF analysis</p>
            </div>
          </Card>
        </div>

        {/* Distribution Chart - Medium Card (Bottom Left) */}
        <Card className="lg:col-span-7 p-6 border-2 border-border bg-card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Confidence Distribution
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={{
                  stroke: 'hsl(var(--foreground))',
                  strokeWidth: 1
                }}
                label={(entry) => {
                  const percent = (entry.percent * 100).toFixed(0);
                  return `${percent}%`;
                }}
                outerRadius={90}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '2px solid hsl(var(--border))',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{
                  color: 'hsl(var(--popover-foreground))',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
                labelStyle={{
                  color: 'hsl(var(--popover-foreground))',
                  fontWeight: '700',
                  fontSize: '14px',
                  marginBottom: '4px'
                }}
                formatter={(value: any, name: string, props: any) => [
                  `${value}%`, 
                  props.payload.fullName
                ]}
                cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '12px',
                  paddingTop: '12px'
                }}
                formatter={(value, entry: any) => (
                  <span style={{ color: 'hsl(var(--foreground))' }}>
                    {entry.payload.fullName}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Detailed Findings - Cards Grid (Bottom Right) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 px-1">
            <Activity className="w-4 h-4 text-primary" />
            Detailed Analysis
          </h3>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {result.findings.map((finding, idx) => (
              <Card
                key={idx}
                className="p-4 bg-card border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md animate-fade-in-up"
                style={{ animationDelay: `${0.05 * idx}s` }}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getSeverityIcon(finding.severity)}
                    <span className="font-semibold text-sm text-foreground truncate">{finding.condition}</span>
                  </div>
                  <span className={`text-lg font-bold ${getConfidenceColor(finding.confidence)} flex-shrink-0`}>
                    {finding.confidence}%
                  </span>
                </div>
                
                <div className="relative h-2 bg-muted/50 dark:bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${animatedFindings[idx] || 0}%`,
                      background: `linear-gradient(to right, ${CHART_COLORS[idx % CHART_COLORS.length]}, ${CHART_COLORS[(idx + 1) % CHART_COLORS.length]})`
                    }}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">{finding.severity} severity level</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendation - Full Width Card */}
        <Card className="lg:col-span-12 p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-2 border-amber-500/30 hover:shadow-lg transition-all duration-300">
          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg mb-2 text-foreground">Clinical Recommendation</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
