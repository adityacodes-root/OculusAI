'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Upload, Loader2, ArrowLeft, Download, Eye, Sparkles, AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ResultsDisplay } from '@/components/results-display'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AnalyzePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showPhoto, setShowPhoto] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload a JPG, PNG, or GIF image.'
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return 'File size exceeds 10MB. Please upload a smaller image.'
    }

    return null
  }

  const handleFile = (file: File) => {
    setUploadError(null)
    
    const error = validateFile(file)
    if (error) {
      setUploadError(error)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
      analyzeImage(file)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async (file: File) => {
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/predict`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transform Flask response to match ResultsDisplay expectations
      const transformedResult = {
        primaryDiagnosis: data.predicted_class.replace(/_/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        confidence: Math.round(data.confidence),
        severity: data.confidence >= 80 ? 'High' : data.confidence >= 60 ? 'Moderate' : 'Low',
        icon: data.icon,
        description: data.description,
        symptoms: data.symptoms,
        color: data.color,
        findings: Object.entries(data.all_predictions).map(([condition, confidence]: [string, any]) => ({
          condition: condition.replace(/_/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          severity: confidence >= 50 ? 'Present' : 'None',
          confidence: Math.round(confidence)
        })),
        recommendation: data.predicted_class === 'normal' 
          ? 'Your eyes appear healthy. Continue regular eye checkups.'
          : `Please consult an ophthalmologist for professional evaluation and treatment of ${data.predicted_class.replace(/_/g, ' ')}.`
      }
      
      setAnalysisResult(transformedResult)
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisResult({
        error: error instanceof Error ? error.message : 'Failed to analyze image',
        primaryDiagnosis: 'Error',
        confidence: 0,
        findings: [],
        recommendation: 'Unable to analyze image. Please check that the Flask backend is running on http://localhost:5000'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleReset = () => {
    setPreviewUrl(null)
    setAnalysisResult(null)
    setShowPhoto(false)
    setShowChatbot(false)
    setUploadError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 animate-fade-in-up">
            <Link href="/">
              <Button variant="ghost" size="icon" className="transition-smooth">
                <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold">Retinal Analysis</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!previewUrl ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 sm:mb-8 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Upload Retinal Image</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                Drag and drop a fundus image or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> For colour vision testing, 
                visit the <Link href="/colorblindness" className="text-primary hover:underline">Colour Blindness Test</Link> page.
              </p>
            </div>

            <Card
              className={`p-8 sm:p-12 border-2 border-dashed cursor-pointer transition-smooth hover-card-subtle animate-scale-in ${
                isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'hover:border-primary/40 hover:bg-primary/5'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label className="flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer">
                <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 transition-all ${
                  isDragging ? 'scale-110' : ''
                }`}>
                  <Upload className={`w-6 sm:w-8 h-6 sm:h-8 text-primary transition-transform ${isDragging ? 'scale-110' : ''}`} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base sm:text-lg mb-1 text-foreground">
                    {isDragging ? 'Drop your image here' : 'Drag your image here'}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">or click to select from your computer</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>
            </Card>

            {uploadError && (
              <Card className="p-4 bg-destructive/5 border-destructive/20 animate-scale-in mt-4">
                <p className="text-xs sm:text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {uploadError}
                </p>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground animate-fade-in-up mt-6" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>JPG, PNG, GIF</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Max 10MB</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-bold">Analysis Results</h2>
              {analysisResult && (
                <Button onClick={handleReset} variant="outline" className="transition-smooth w-full sm:w-auto">
                  <Upload className="w-4 h-4 mr-2" />
                  New Image
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Preview with Comparison Slider */}
              <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {showPhoto ? (
                  <div className="space-y-3 animate-scale-in">
                    <div className="rounded-xl overflow-hidden border border-border bg-muted aspect-square relative group">
                      <img
                        src={previewUrl || '/placeholder.svg'}
                        alt="Retinal image"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1 backdrop-blur-sm bg-background/95 hover:bg-background border-2 border-border text-foreground text-xs"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = previewUrl || ''
                            link.download = 'retinal-image.png'
                            link.click()
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => setShowPhoto(false)}
                        variant="outline"
                        size="sm"
                        className="transition-smooth text-xs"
                      >
                        Hide Photo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-smooth text-xs"
                        onClick={() => {
                          // Full screen view
                          const img = new Image()
                          img.src = previewUrl || ''
                          const w = window.open('', '_blank')
                          w?.document.write(img.outerHTML)
                        }}
                      >
                        Full Screen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowPhoto(true)}
                    className="w-full h-20 sm:h-24 text-xs sm:text-sm transition-smooth-lg hover-lift"
                    variant="outline"
                  >
                    <Eye className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                    View Uploaded Photo
                  </Button>
                )}
              </div>

              {/* Results */}
              <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {isLoading ? (
                  <Card className="p-8">
                    <div className="flex flex-col items-center justify-center py-12 gap-6">
                      {/* Enhanced loader with multiple elements */}
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                      </div>
                      
                      {/* Loading messages */}
                      <div className="text-center space-y-2">
                        <p className="font-semibold text-lg text-foreground">Analyzing Retinal Image</p>
                        <p className="text-sm text-muted-foreground animate-pulse">
                          AI model processing image patterns...
                        </p>
                      </div>
                      
                      {/* Progress indicators */}
                      <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Processing</span>
                          <span>Please wait</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary via-accent to-secondary animate-shimmer" />
                        </div>
                      </div>
                      
                      {/* Feature highlights */}
                      <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                        {['Detection', 'Analysis', 'Results'].map((step, idx) => (
                          <div key={step} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                            <div className={`w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 ${
                              idx === 0 ? 'border-primary bg-primary/10 text-primary' : 'border-muted text-muted-foreground'
                            }`}>
                              {idx + 1}
                            </div>
                            <p className="text-xs text-muted-foreground">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ) : analysisResult ? (
                  <ResultsDisplay result={analysisResult} imageUrl={previewUrl || undefined} />
                ) : null}
              </div>
            </div>

            {analysisResult && (
              <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Button
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="bg-primary hover:bg-primary/90 transition-smooth w-full sm:w-auto"
                >
                  {showChatbot ? 'Close' : 'Ask Questions'}
                </Button>
              </div>
            )}

            {showChatbot && (
              <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 w-auto sm:w-80 h-96 bg-card border border-border/40 rounded-xl shadow-lg flex flex-col animate-scale-in z-50">
                <div className="p-4 border-b border-border/40 flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base">OculusAI Assistant</h3>
                  <button
                    onClick={() => setShowChatbot(false)}
                    className="text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
                  <p className="text-center text-xs sm:text-sm text-muted-foreground">
                    Chat interface coming soon. Ask your questions about the analysis here.
                  </p>
                </div>
                <div className="p-4 border-t border-border/40">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border/40 text-xs sm:text-sm placeholder-muted-foreground disabled:opacity-50 transition-smooth"
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
