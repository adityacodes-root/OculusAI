'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Eye, AlertCircle, CheckCircle, XCircle, Loader2, Info, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { ColorBlindnessPDFGenerator } from '@/components/colorblindness-pdf-generator'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface TestImage {
  id: number
  filename: string
  type: number
}

interface TestSession {
  test_id: string
  total_images: number
  images: TestImage[]
}

interface Response {
  filename: string
  user_answer: number
}

interface TypeAnalysis {
  error_percentage: number
  normal_percentage: number
  mistakes: number
  total: number
}

interface Diagnosis {
  status: string
  severity: string
  type: string | null
  confidence: string
  deutan_likelihood: number
  protan_likelihood: number
  summary: string
  recommendation: string
  details: string[]
}

interface TestResult {
  overall_accuracy: number
  total_correct: number
  total_questions: number
  type_analysis: Record<number, TypeAnalysis>
  diagnosis: Diagnosis
  detailed_results?: Array<{
    filename: string
    correct_digit: number
    user_answer: number
    is_correct: boolean
    color_type: number
  }>
}

export default function ColorBlindnessTest() {
  const [testSession, setTestSession] = useState<TestSession | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Response[]>([])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentImage = testSession?.images[currentIndex]
  const progress = testSession ? ((currentIndex + 1) / testSession.total_images) * 100 : 0

  useEffect(() => {
    if (testStarted && !testCompleted && !imageLoading) {
      inputRef.current?.focus()
    }
  }, [currentIndex, testStarted, testCompleted, imageLoading])

  useEffect(() => {
    if (!testStarted || testCompleted || !currentImage || imageLoading) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) {
        if (e.key === 'Enter' && userInput !== '') {
          e.preventDefault()
          submitAnswer()
        }
        return
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        setUserInput(e.key)
        inputRef.current?.focus()
      } else if (e.key === 'Enter' && userInput !== '') {
        e.preventDefault()
        submitAnswer()
      } else if (e.key === 'Backspace') {
        setUserInput('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [testStarted, testCompleted, currentImage, imageLoading, userInput, responses, currentIndex])

  const startTest = async () => {
    setLoading(true)
    setLoadingMessage('Initializing examination plates...')
    setImageLoading(true)
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/colorblindness/start-test?count=20`)
      if (!response.ok) throw new Error('Failed to start test')
      const data = await response.json()
      setTestSession(data)
      setTestStarted(true)
      setCurrentIndex(0)
      setResponses([])
      setUserInput('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize examination')
      setImageLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = () => {
    if (!currentImage || userInput === '' || imageLoading) return

    const digit = parseInt(userInput)
    if (isNaN(digit) || digit < 0 || digit > 9) {
      setError('Please enter a single digit between 0 and 9')
      return
    }

    setImageLoading(true)
    setLoadingMessage('Loading next plate...')
    setResponses([...responses, { filename: currentImage.filename, user_answer: digit }])
    setUserInput('')
    setError(null)

    if (currentIndex + 1 < (testSession?.total_images || 0)) {
      setCurrentIndex(currentIndex + 1)
    } else {
      evaluateTest([...responses, { filename: currentImage.filename, user_answer: digit }])
    }
  }

  const recalculateDiagnosis = (backendResult: TestResult): TestResult => {
    const newTypeAnalysis: Record<number, TypeAnalysis> = {
      1: { total: 0, mistakes: 0, error_percentage: 0, normal_percentage: 100 },
      2: { total: 0, mistakes: 0, error_percentage: 0, normal_percentage: 100 },
      3: { total: 0, mistakes: 0, error_percentage: 0, normal_percentage: 100 },
      4: { total: 0, mistakes: 0, error_percentage: 0, normal_percentage: 100 }
    }

    if (backendResult.detailed_results) {
      backendResult.detailed_results.forEach((r: any) => {
        let correctType = r.color_type
        if (r.filename.includes('theme_4')) {
          correctType = 4
        }
        newTypeAnalysis[correctType].total++
        if (!r.is_correct) {
          newTypeAnalysis[correctType].mistakes++
        }
      })

      Object.keys(newTypeAnalysis).forEach(typeKey => {
        const type = parseInt(typeKey)
        const analysis = newTypeAnalysis[type]
        if (analysis.total > 0) {
          analysis.error_percentage = Math.round((analysis.mistakes / analysis.total) * 1000) / 10
          analysis.normal_percentage = Math.round((1 - analysis.mistakes / analysis.total) * 1000) / 10
        }
      })
    }

    const type_analysis = newTypeAnalysis

    const type1_error = type_analysis[1]?.error_percentage || 0
    const type2_error = type_analysis[2]?.error_percentage || 0
    const type3_error = type_analysis[3]?.error_percentage || 0
    const type4_error = type_analysis[4]?.error_percentage || 0

    const deutanIndicators = []
    if (type_analysis[1]?.total > 0) deutanIndicators.push(type1_error)
    if (type_analysis[4]?.total > 0) deutanIndicators.push(type4_error)
    const deutan_likelihood = deutanIndicators.length > 0 
      ? deutanIndicators.reduce((a, b) => a + b, 0) / deutanIndicators.length 
      : 0

    const protanIndicators = []
    if (type_analysis[2]?.total > 0) protanIndicators.push(type2_error)
    if (type_analysis[3]?.total > 0) protanIndicators.push(type3_error)
    const protan_likelihood = protanIndicators.length > 0
      ? protanIndicators.reduce((a, b) => a + b, 0) / protanIndicators.length
      : 0

    const total_errors = Object.values(type_analysis).reduce((sum, t) => sum + t.mistakes, 0)
    const total_tests = Object.values(type_analysis).reduce((sum, t) => sum + t.total, 0)
    const overall_error = total_tests > 0 ? (total_errors / total_tests * 100) : 0

    const THRESHOLD_LOW = 10
    const THRESHOLD_MODERATE = 30
    const THRESHOLD_HIGH = 60

    const diagnosis: Diagnosis = {
      status: 'normal',
      severity: 'none',
      type: null,
      confidence: 'high',
      deutan_likelihood: Math.round(deutan_likelihood * 10) / 10,
      protan_likelihood: Math.round(protan_likelihood * 10) / 10,
      summary: '',
      recommendation: '',
      details: []
    }

    if (deutan_likelihood < THRESHOLD_LOW && protan_likelihood < THRESHOLD_LOW && overall_error < THRESHOLD_LOW) {
      diagnosis.status = 'normal'
      diagnosis.severity = 'none'
      diagnosis.summary = 'Standard chromatic discrimination verified across all axes.'
      diagnosis.recommendation = 'No evidence of congenital red-green color deficiency.'
    } else if (deutan_likelihood > protan_likelihood) {
      if (deutan_likelihood >= THRESHOLD_HIGH) {
        diagnosis.status = 'colour_blind'
        diagnosis.type = 'Deuteranopia'
        diagnosis.severity = 'strong'
        diagnosis.summary = `Significant indication of Deuteranopia (green blindness). Error rate: ${deutan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Clinical consultation for comprehensive anomaloscope examination recommended.'
      } else if (deutan_likelihood >= THRESHOLD_MODERATE) {
        diagnosis.status = 'colour_weak'
        diagnosis.type = 'Deuteranomaly'
        diagnosis.severity = 'moderate'
        diagnosis.summary = `Moderate signs of Deuteranomaly (green weakness). Error rate: ${deutan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Consider specialized color vision evaluation.'
      } else {
        diagnosis.status = 'possible_weakness'
        diagnosis.type = 'Deuteranomaly'
        diagnosis.severity = 'mild'
        diagnosis.summary = `Mild signs of green axis weakness. Error rate: ${deutan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Retest under standardized 5500K lighting if symptoms persist.'
      }
      diagnosis.details.push(`Type 1 error rate (green vs orange): ${type1_error.toFixed(1)}%`)
      diagnosis.details.push(`Type 4 error rate (green vs yellow): ${type4_error.toFixed(1)}%`)
    } else if (protan_likelihood > deutan_likelihood) {
      if (protan_likelihood >= THRESHOLD_HIGH) {
        diagnosis.status = 'colour_blind'
        diagnosis.type = 'Protanopia'
        diagnosis.severity = 'strong'
        diagnosis.summary = `Significant indication of Protanopia (red blindness). Error rate: ${protan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Clinical consultation for comprehensive anomaloscope examination recommended.'
      } else if (protan_likelihood >= THRESHOLD_MODERATE) {
        diagnosis.status = 'colour_weak'
        diagnosis.type = 'Protanomaly'
        diagnosis.severity = 'moderate'
        diagnosis.summary = `Moderate signs of Protanomaly (red weakness). Error rate: ${protan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Consider specialized color vision evaluation.'
      } else {
        diagnosis.status = 'possible_weakness'
        diagnosis.type = 'Protanomaly'
        diagnosis.severity = 'mild'
        diagnosis.summary = `Mild signs of red axis weakness. Error rate: ${protan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Retest under standardized 5500K lighting if symptoms persist.'
      }
      diagnosis.details.push(`Type 2 error rate (red vs green): ${type2_error.toFixed(1)}%`)
      diagnosis.details.push(`Type 3 error rate (red vs gray): ${type3_error.toFixed(1)}%`)
    } else {
      if (overall_error >= THRESHOLD_MODERATE) {
        diagnosis.status = 'inconclusive'
        diagnosis.severity = 'varied'
        diagnosis.confidence = 'low'
        diagnosis.summary = 'Non-specific chromatic error pattern detected.'
        diagnosis.recommendation = 'Anomaloscope or Farnsworth D-15 arrangement test advised.'
      } else {
        diagnosis.status = 'normal'
        diagnosis.severity = 'none'
        diagnosis.summary = 'Standard chromatic discrimination with minimal isolated errors.'
        diagnosis.recommendation = 'Color vision parameters fall within normal demographic bounds.'
      }
    }

    return {
      ...backendResult,
      type_analysis,
      diagnosis
    }
  }

  const evaluateTest = async (finalResponses: Response[]) => {
    setLoading(true)
    setLoadingMessage('Evaluating responses with digit classifier...')
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/colorblindness/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: finalResponses }),
      })
      if (!response.ok) throw new Error('Failed to evaluate test')
      const data = await response.json()
      const correctedResult = recalculateDiagnosis(data)
      setResult(correctedResult)
      setTestCompleted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate test')
    } finally {
      setLoading(false)
      setImageLoading(false)
    }
  }

  const resetTest = () => {
    setTestSession(null)
    setCurrentIndex(0)
    setResponses([])
    setUserInput('')
    setTestStarted(false)
    setTestCompleted(false)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {!testStarted && !testCompleted && (
          <div className="space-y-6">
            <div className="border-b border-border pb-6">
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Chromatic Screener</div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Ishihara Color Discrimination Test</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Automated pseudoisochromatic plate assessment backed by custom convolutional neural network digit verification.
              </p>
            </div>

            <Card className="p-8 border border-border bg-card space-y-6">
              <div>
                <h2 className="text-base font-semibold tracking-tight">Protocol & Methodology</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  You will be presented with a sequence of 20 calibrated Ishihara-style plates. Each plate conceals an Arabic numeral (0 to 9) rendered in chromatic hues against confusion dot matrices.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded border border-border bg-muted/20 p-4 space-y-1 text-xs">
                  <div className="font-mono text-foreground font-semibold">Deutan Screening (Types 1 & 4)</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Evaluates green cone (M-cone) photopigment variations using green versus orange and yellow dot distributions.
                  </p>
                </div>
                <div className="rounded border border-border bg-muted/20 p-4 space-y-1 text-xs">
                  <div className="font-mono text-foreground font-semibold">Protan Screening (Types 2 & 3)</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Evaluates red cone (L-cone) photopigment variations using red versus green and neutral gray dot distributions.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={startTest} disabled={loading} className="h-11 px-6 text-xs font-medium uppercase tracking-wider">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initializing...
                    </>
                  ) : (
                    'Begin Test'
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {testStarted && !testCompleted && currentImage && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono border-b border-border pb-3">
              <div>
                Plate <span className="font-semibold text-foreground">{currentIndex + 1}</span> of {testSession?.total_images}
              </div>
              <div className="text-muted-foreground">
                Type {currentImage.type} Vector
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <div className="bg-foreground h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <Card className="p-6 border border-border bg-card flex flex-col items-center justify-center min-h-[360px] relative">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xs z-10 rounded">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/colorblindness/image/${currentImage.filename}`}
                alt={`Plate ${currentIndex + 1}`}
                className="max-w-xs sm:max-w-sm w-full h-auto rounded border border-border object-contain"
                onLoad={() => setImageLoading(false)}
              />
            </Card>

            <div className="space-y-4 max-w-md mx-auto">
              {error && (
                <div className="rounded border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <div className="text-xs font-mono text-center text-muted-foreground mb-3">
                  Type or Select Digit (0 - 9)
                </div>

                <div className="flex justify-center mb-4">
                  <Input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={userInput}
                    placeholder="-"
                    autoFocus
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(-1)
                      setUserInput(val)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && userInput !== '') {
                        e.preventDefault()
                        submitAnswer()
                      }
                    }}
                    className="w-16 h-14 text-center text-3xl font-mono font-semibold border-border bg-card shadow-xs focus-visible:ring-1"
                  />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                    <Button
                      key={digit}
                      variant={userInput === digit.toString() ? 'default' : 'outline'}
                      size="lg"
                      className="h-11 text-base font-mono rounded border-border"
                      onClick={() => {
                        setUserInput(digit.toString())
                        inputRef.current?.focus()
                      }}
                    >
                      {digit}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={submitAnswer}
                    disabled={userInput === '' || loading || imageLoading}
                    className="flex-1 h-11 text-xs font-medium uppercase tracking-wider"
                  >
                    {loading || imageLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : currentIndex + 1 === testSession?.total_images ? (
                      'Finalize Analysis'
                    ) : (
                      'Confirm & Proceed'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {testCompleted && result && (
          <div className="space-y-6">
            <Card className="p-8 border border-border bg-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Examination Outcome</div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-1">
                    {result.diagnosis.type || 'Standard Trichromacy'}
                  </h2>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Severity Index: <span className="capitalize font-mono font-medium text-foreground">{result.diagnosis.severity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-semibold text-foreground">
                    {result.overall_accuracy}%
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    ({result.total_correct}/{result.total_questions})
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div className="rounded border border-border bg-muted/20 p-4">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-foreground mb-1">Diagnostic Summary</div>
                  <p className="text-muted-foreground leading-relaxed">{result.diagnosis.summary}</p>
                </div>

                <div className="rounded border border-border bg-muted/10 p-4">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-foreground mb-1">Recommendation</div>
                  <p className="text-muted-foreground leading-relaxed">{result.diagnosis.recommendation}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded border border-border p-4 bg-card">
                    <div className="flex justify-between font-mono text-xs mb-2">
                      <span className="font-semibold text-foreground">Deutan Probability (M-Cone)</span>
                      <span className="text-muted-foreground">{result.diagnosis.deutan_likelihood}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div className="bg-foreground h-1.5 rounded-full" style={{ width: `${result.diagnosis.deutan_likelihood}%` }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">Green vs Orange/Yellow discrimination.</p>
                  </div>

                  <div className="rounded border border-border p-4 bg-card">
                    <div className="flex justify-between font-mono text-xs mb-2">
                      <span className="font-semibold text-foreground">Protan Probability (L-Cone)</span>
                      <span className="text-muted-foreground">{result.diagnosis.protan_likelihood}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div className="bg-foreground h-1.5 rounded-full" style={{ width: `${result.diagnosis.protan_likelihood}%` }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">Red vs Green/Gray discrimination.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3">
                <Button onClick={resetTest} variant="outline" className="text-xs font-mono">
                  Repeat Examination
                </Button>
                {result && <ColorBlindnessPDFGenerator result={result} />}
              </div>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
