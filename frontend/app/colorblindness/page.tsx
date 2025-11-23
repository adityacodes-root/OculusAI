"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, AlertCircle, CheckCircle, XCircle, Loader2, Info, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ColorBlindnessPDFGenerator } from "@/components/colorblindness-pdf-generator"
import { MobileNav } from '@/components/mobile-nav'

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
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [imageLoading, setImageLoading] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentImage = testSession?.images[currentIndex]
  const progress = testSession ? ((currentIndex + 1) / testSession.total_images) * 100 : 0

  const startTest = async () => {
    setLoading(true)
    setLoadingMessage("Loading test...")
    setImageLoading(true)
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/colorblindness/start-test?count=20`)
      if (!response.ok) throw new Error("Failed to start test")
      const data = await response.json()
      setTestSession(data)
      setTestStarted(true)
      setCurrentIndex(0)
      setResponses([])
      setUserInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start test")
      setImageLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = () => {
    if (!currentImage || userInput === "" || imageLoading) return

    const digit = parseInt(userInput)
    if (isNaN(digit) || digit < 0 || digit > 9) {
      setError("Please enter a digit between 0 and 9")
      return
    }

    setImageLoading(true)
    setLoadingMessage("Loading next image...")
    setResponses([...responses, { filename: currentImage.filename, user_answer: digit }])
    setUserInput("")
    setError(null)

    if (currentIndex + 1 < (testSession?.total_images || 0)) {
      setCurrentIndex(currentIndex + 1)
    } else {
      evaluateTest([...responses, { filename: currentImage.filename, user_answer: digit }])
    }
  }

  const recalculateDiagnosis = (backendResult: TestResult): TestResult => {
    // CRITICAL FIX: Backend mislabels theme_4 images as type_3
    // We need to remap them to type_4 for accurate diagnosis
    
    // First, let's rebuild the type_analysis by examining detailed_results
    const newTypeAnalysis: Record<number, TypeAnalysis> = {
      1: { total: 0, mistakes: 0, error_percentage: 0, normal_percentage: 100 },
      2: { total: 0, mistakes: 0, error_percentage: 0, normal_percentage: 100 },
      3: { total: 0, mistakes: 0, error_percentage: 0, normal_percentage: 100 },
      4: { total: 0, mistakes: 0, error_percentage: 0, normal_percentage: 100 }
    }
    
    // Process each detailed result and fix the type
    if (backendResult.detailed_results) {
      backendResult.detailed_results.forEach((result: any) => {
        // Determine the correct type
        let correctType = result.color_type
        
        // If filename contains theme_4, it's actually type 4 (not type 3)
        if (result.filename.includes('theme_4')) {
          correctType = 4
        }
        
        // Update statistics for the correct type
        newTypeAnalysis[correctType].total++
        if (!result.is_correct) {
          newTypeAnalysis[correctType].mistakes++
        }
      })
      
      // Calculate percentages for each type
      Object.keys(newTypeAnalysis).forEach(typeKey => {
        const type = parseInt(typeKey)
        const analysis = newTypeAnalysis[type]
        if (analysis.total > 0) {
          analysis.error_percentage = Math.round((analysis.mistakes / analysis.total) * 1000) / 10
          analysis.normal_percentage = Math.round((1 - analysis.mistakes / analysis.total) * 1000) / 10
        }
      })
    }
    
    // Now recalculate diagnosis with corrected type analysis
    const type_analysis = newTypeAnalysis
    
    // Get error rates for each type
    const type1_error = type_analysis[1]?.error_percentage || 0
    const type2_error = type_analysis[2]?.error_percentage || 0
    const type3_error = type_analysis[3]?.error_percentage || 0
    const type4_error = type_analysis[4]?.error_percentage || 0
    
    // Calculate Deutan likelihood (Type 1 + Type 4) - only include types with tests
    const deutanIndicators = []
    if (type_analysis[1]?.total > 0) deutanIndicators.push(type1_error)
    if (type_analysis[4]?.total > 0) deutanIndicators.push(type4_error)
    const deutan_likelihood = deutanIndicators.length > 0 
      ? deutanIndicators.reduce((a, b) => a + b, 0) / deutanIndicators.length 
      : 0
    
    // Calculate Protan likelihood (Type 2 + Type 3) - only include types with tests
    const protanIndicators = []
    if (type_analysis[2]?.total > 0) protanIndicators.push(type2_error)
    if (type_analysis[3]?.total > 0) protanIndicators.push(type3_error)
    const protan_likelihood = protanIndicators.length > 0
      ? protanIndicators.reduce((a, b) => a + b, 0) / protanIndicators.length
      : 0
    
    // Calculate overall error rate
    const total_errors = Object.values(type_analysis).reduce((sum, t) => sum + t.mistakes, 0)
    const total_tests = Object.values(type_analysis).reduce((sum, t) => sum + t.total, 0)
    const overall_error = total_tests > 0 ? (total_errors / total_tests * 100) : 0
    
    // Thresholds
    const THRESHOLD_LOW = 10
    const THRESHOLD_MODERATE = 30
    const THRESHOLD_HIGH = 50
    
    let diagnosis = { ...backendResult.diagnosis }
    diagnosis.deutan_likelihood = Math.round(deutan_likelihood * 10) / 10
    diagnosis.protan_likelihood = Math.round(protan_likelihood * 10) / 10
    
    // Improved diagnosis logic
    if (overall_error < THRESHOLD_LOW) {
      diagnosis.status = 'normal'
      diagnosis.severity = 'none'
      diagnosis.type = null
      diagnosis.summary = 'Normal colour vision detected. No significant colour vision deficiency.'
      diagnosis.recommendation = 'No further action required. Your colour vision appears normal.'
      diagnosis.details = ['All colour types were perceived correctly with minimal errors.']
    }
    else if (deutan_likelihood > protan_likelihood && deutan_likelihood >= THRESHOLD_LOW) {
      // Deutan pattern (green-weak/green-blind)
      if (deutan_likelihood >= THRESHOLD_HIGH) {
        diagnosis.status = 'colour_blind'
        diagnosis.type = 'Deuteranopia'
        diagnosis.severity = 'strong'
        diagnosis.confidence = 'high'
        diagnosis.summary = `Strong indication of Deuteranopia (green-blindness). Error rate: ${deutan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Please consult an eye care professional for a comprehensive colour vision examination.'
      } else if (deutan_likelihood >= THRESHOLD_MODERATE) {
        diagnosis.status = 'colour_weak'
        diagnosis.type = 'Deuteranomaly'
        diagnosis.severity = 'moderate'
        diagnosis.confidence = 'moderate'
        diagnosis.summary = `Moderate signs of Deuteranomaly (green-weakness). Error rate: ${deutan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Consider seeing an eye care professional for further evaluation.'
      } else {
        diagnosis.status = 'possible_weakness'
        diagnosis.type = 'Deuteranomaly'
        diagnosis.severity = 'mild'
        diagnosis.confidence = 'low'
        diagnosis.summary = `Mild signs of green colour weakness. Error rate: ${deutan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Monitor your colour vision. If symptoms persist, consult an eye care professional.'
      }
      diagnosis.details = [
        `Type 1 errors (green vs orange): ${type1_error.toFixed(1)}%`,
        `Type 4 errors (green vs yellow): ${type4_error.toFixed(1)}%`
      ]
    }
    else if (protan_likelihood > deutan_likelihood && protan_likelihood >= THRESHOLD_LOW) {
      // Protan pattern (red-weak/red-blind)
      if (protan_likelihood >= THRESHOLD_HIGH) {
        diagnosis.status = 'colour_blind'
        diagnosis.type = 'Protanopia'
        diagnosis.severity = 'strong'
        diagnosis.confidence = 'high'
        diagnosis.summary = `Strong indication of Protanopia (red-blindness). Error rate: ${protan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Please consult an eye care professional for a comprehensive colour vision examination.'
      } else if (protan_likelihood >= THRESHOLD_MODERATE) {
        diagnosis.status = 'colour_weak'
        diagnosis.type = 'Protanomaly'
        diagnosis.severity = 'moderate'
        diagnosis.confidence = 'moderate'
        diagnosis.summary = `Moderate signs of Protanomaly (red-weakness). Error rate: ${protan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Consider seeing an eye care professional for further evaluation.'
      } else {
        diagnosis.status = 'possible_weakness'
        diagnosis.type = 'Protanomaly'
        diagnosis.severity = 'mild'
        diagnosis.confidence = 'low'
        diagnosis.summary = `Mild signs of red colour weakness. Error rate: ${protan_likelihood.toFixed(1)}%`
        diagnosis.recommendation = 'Monitor your colour vision. If symptoms persist, consult an eye care professional.'
      }
      diagnosis.details = [
        `Type 2 errors (red vs green): ${type2_error.toFixed(1)}%`,
        `Type 3 errors (red vs gray): ${type3_error.toFixed(1)}%`
      ]
    }
    else if (deutan_likelihood === protan_likelihood && deutan_likelihood >= THRESHOLD_MODERATE) {
      // Equal likelihoods with significant errors
      diagnosis.status = 'inconclusive'
      diagnosis.severity = 'varied'
      diagnosis.confidence = 'low'
      diagnosis.summary = `Equal error rates detected (Deutan: ${deutan_likelihood.toFixed(1)}%, Protan: ${protan_likelihood.toFixed(1)}%). Results are inconclusive.`
      diagnosis.recommendation = 'This test shows mixed results. Please consult an eye care professional for a thorough examination.'
      diagnosis.details = [
        `Type 1 errors: ${type1_error.toFixed(1)}%`,
        `Type 2 errors: ${type2_error.toFixed(1)}%`,
        `Type 3 errors: ${type3_error.toFixed(1)}%`,
        `Type 4 errors: ${type4_error.toFixed(1)}%`
      ]
    }
    else {
      // Low errors or no clear pattern
      diagnosis.status = 'normal'
      diagnosis.severity = 'none'
      diagnosis.type = null
      diagnosis.summary = 'Normal colour vision with minor inconsistencies.'
      diagnosis.recommendation = 'Your colour vision appears mostly normal. Retest if concerned.'
      diagnosis.details = ['Errors are minimal and do not indicate a specific deficiency pattern.']
    }
    
    // Return result with corrected type_analysis and diagnosis
    return { 
      ...backendResult, 
      type_analysis: newTypeAnalysis,
      diagnosis 
    }
  }

  const evaluateTest = async (finalResponses: Response[]) => {
    setLoading(true)
    setLoadingMessage("Analyzing results...")
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/colorblindness/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: finalResponses }),
      })
      if (!response.ok) throw new Error("Failed to evaluate test")
      const data = await response.json()
      
      // Recalculate diagnosis with improved logic
      const improvedResult = recalculateDiagnosis(data)
      setResult(improvedResult)
      setTestCompleted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to evaluate test")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600"
      case "possible_weakness":
        return "text-yellow-600"
      case "colour_weak":
        return "text-orange-600"
      case "colour_blind":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "possible_weakness":
        return <Info className="h-6 w-6 text-yellow-600" />
      case "colour_weak":
        return <AlertCircle className="h-6 w-6 text-orange-600" />
      case "colour_blind":
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <Info className="h-6 w-6 text-gray-600" />
    }
  }

  const resetTest = () => {
    setTestSession(null)
    setCurrentIndex(0)
    setResponses([])
    setUserInput("")
    setTestStarted(false)
    setTestCompleted(false)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <nav className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-lg sm:text-xl font-bold cursor-pointer">OculusAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              Home
            </Link>
            <Link href="/analyze" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              Retinal Test
            </Link>
            <Link href="/colorblindness" className="text-xs sm:text-sm text-foreground font-medium hover:text-foreground transition-smooth hidden md:inline">
              Colour Blindness Test
            </Link>
            <Link href="/diseases" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              Diseases
            </Link>
            <Link href="/evaluation" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              Model
            </Link>
            <Link href="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              About
            </Link>
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 sm:py-12 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">

          {/* Welcome Screen */}
          {!testStarted && !testCompleted && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Test</CardTitle>
                <CardDescription>
                  This test uses Ishihara-style colour plates to detect colour vision deficiencies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">How it works:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                    <li>You'll be shown 20 images with hidden digits (0-9)</li>
                    <li>Each image uses different colour combinations</li>
                    <li>Enter the digit you see in each image</li>
                    <li>Our AI model verifies your answers</li>
                    <li>Receive a detailed analysis of your colour vision</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">What we test:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <strong className="text-green-700 dark:text-green-400">Deuteranomaly</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Green colour weakness</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <strong className="text-red-700 dark:text-red-400">Protanomaly</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Red colour weakness</p>
                    </div>
                  </div>
                </div>

                <Button onClick={startTest} disabled={loading} size="lg" className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Test...
                    </>
                  ) : (
                    "Start Test"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Test In Progress */}
          {testStarted && !testCompleted && currentImage && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Question {currentIndex + 1} of {testSession?.total_images}</CardTitle>
                  <Badge variant="outline">Type {currentImage.type}</Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Display */}
                <div className="flex justify-center p-4 sm:p-8 bg-gray-100 dark:bg-gray-800 rounded-lg relative">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 rounded-lg z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{loadingMessage || "Loading next image..."}</p>
                      </div>
                    </div>
                  )}
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/colorblindness/image/${currentImage.filename}`}
                    alt={`Test image ${currentIndex + 1}`}
                    className="max-w-full sm:max-w-md w-full h-auto rounded-lg shadow-lg"
                    onLoad={() => setImageLoading(false)}
                  />
                </div>

                {/* Input Section */}
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div>
                    <label htmlFor="digit-input" className="block text-sm font-medium mb-2">
                      What digit do you see? (0-9)
                    </label>
                    
                    {/* Desktop Input */}
                    <div className="hidden sm:flex gap-3">
                      <Input
                        id="digit-input"
                        type="number"
                        min="0"
                        max="9"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && submitAnswer()}
                        placeholder="Enter a digit"
                        className="text-2xl text-center"
                        autoFocus
                      />
                      <Button onClick={submitAnswer} disabled={userInput === "" || loading} size="lg">
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : currentIndex + 1 === testSession?.total_images ? (
                          "Finish"
                        ) : (
                          "Next"
                        )}
                      </Button>
                    </div>

                    {/* Mobile Number Buttons */}
                    <div className="sm:hidden space-y-3">
                      <div className="grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                          <Button
                            key={digit}
                            variant={userInput === digit.toString() ? "default" : "outline"}
                            size="lg"
                            className="h-14 text-lg font-semibold"
                            onClick={() => setUserInput(digit.toString())}
                            className="text-xl h-14 w-full"
                          >
                            {digit}
                          </Button>
                        ))}
                      </div>
                      <Button 
                        onClick={submitAnswer} 
                        disabled={userInput === "" || loading || imageLoading} 
                        size="lg"
                        className="w-full h-14 text-lg font-semibold"
                      >
                        {loading || imageLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Loading...
                          </>
                        ) : currentIndex + 1 === testSession?.total_images ? (
                          "Finish Test"
                        ) : (
                          "Next Image →"
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Take your time. If you cannot see a digit, enter your best guess.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Screen */}
          {testCompleted && result && (
            <div className="space-y-6">
              {/* Overall Results */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(result.diagnosis.status)}
                      Test Results
                    </CardTitle>
                    <Badge variant={result.overall_accuracy >= 90 ? "default" : "secondary"} className="text-lg px-4 py-2">
                      {result.overall_accuracy}% Accurate
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">Correct Answers</p>
                      <p className="text-4xl font-bold text-blue-600 text-center">{result.total_correct}/{result.total_questions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Diagnosis */}
              <Card>
                <CardHeader>
                  <CardTitle className={getStatusColor(result.diagnosis.status)}>
                    Diagnosis: {result.diagnosis.type || "Normal Colour Vision"}
                  </CardTitle>
                  <CardDescription>
                    Severity: <span className="capitalize font-semibold">{result.diagnosis.severity}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Summary</AlertTitle>
                    <AlertDescription>{result.diagnosis.summary}</AlertDescription>
                  </Alert>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Recommendation</h4>
                    <p className="text-gray-600 dark:text-gray-300">{result.diagnosis.recommendation}</p>
                  </div>

                  {result.diagnosis.details.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Details</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        {result.diagnosis.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Type Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis by Colour Type</CardTitle>
                  <CardDescription>Performance on different colour combination tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Deutan Analysis */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Deutan (Green Weakness)</h4>
                        <div className="flex items-center gap-2">
                          {result.diagnosis.deutan_likelihood > 20 ? (
                            <TrendingUp className="h-4 w-4 text-red-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-bold">{result.diagnosis.deutan_likelihood}%</span>
                        </div>
                      </div>
                      <Progress value={result.diagnosis.deutan_likelihood} className="h-2" />
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Type 1 & 4: Green vs Orange/Yellow contrasts
                      </div>
                    </div>

                    {/* Protan Analysis */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Protan (Red Weakness)</h4>
                        <div className="flex items-center gap-2">
                          {result.diagnosis.protan_likelihood > 20 ? (
                            <TrendingUp className="h-4 w-4 text-red-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-bold">{result.diagnosis.protan_likelihood}%</span>
                        </div>
                      </div>
                      <Progress value={result.diagnosis.protan_likelihood} className="h-2" />
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Type 2 & 3: Red vs Green/Gray contrasts
                      </div>
                    </div>

                    {/* Individual Type Results */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {Object.entries(result.type_analysis).map(([type, analysis]) => (
                        <div key={type} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Type {type}</span>
                            <Badge variant={analysis.error_percentage < 10 ? "default" : "destructive"}>
                              {analysis.normal_percentage}%
                            </Badge>
                          </div>
                          <Progress value={analysis.normal_percentage} className="h-1.5" />
                          <p className="text-xs text-gray-500 mt-1">
                            {analysis.mistakes} errors out of {analysis.total} tests
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button onClick={resetTest} variant="outline" className="flex-1">
                  Take Test Again
                </Button>
                {result && <ColorBlindnessPDFGenerator result={result} />}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
