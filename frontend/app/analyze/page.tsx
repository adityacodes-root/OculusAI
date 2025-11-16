'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Upload, Loader2, ArrowLeft, Download } from 'lucide-react'
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

  const handleFile = (file: File) => {
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
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleReset = () => {
    setPreviewUrl(null)
    setAnalysisResult(null)
    setShowPhoto(false)
    setShowChatbot(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 animate-fade-in-up">
            <Link href="/">
              <Button variant="ghost" size="icon" className="transition-smooth">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Retinal Analysis</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!previewUrl ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-2">Upload Retinal Image</h2>
              <p className="text-muted-foreground">Drag and drop a fundus image or click to browse</p>
            </div>

            <Card
              className="p-12 border-2 border-dashed cursor-pointer transition-smooth-lg hover:border-primary/50 hover:bg-primary/5 animate-scale-in"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <label className="flex flex-col items-center justify-center gap-4 cursor-pointer">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse-glow">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg mb-1">Drag your image here</p>
                  <p className="text-sm text-muted-foreground">or click to select from your computer</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>
            </Card>

            <p className="text-xs text-muted-foreground mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Supported formats: JPG, PNG, GIF (max 10MB)
            </p>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            <div className="flex items-center justify-between animate-fade-in-up">
              <h2 className="text-3xl font-bold">Analysis Results</h2>
              {analysisResult && (
                <Button onClick={handleReset} variant="outline" gap="2" className="transition-smooth">
                  <Upload className="w-4 h-4" />
                  New Image
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Preview */}
              <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {showPhoto ? (
                  <div className="space-y-3 animate-scale-in">
                    <div className="rounded-xl overflow-hidden border border-border/40 bg-muted aspect-square flex items-center justify-center">
                      <img
                        src={previewUrl || '/placeholder.svg'}
                        alt="Retinal image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      onClick={() => setShowPhoto(false)}
                      variant="outline"
                      className="w-full transition-smooth"
                    >
                      Hide Photo
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowPhoto(true)}
                    className="w-full h-24 text-sm transition-smooth-lg hover:shadow-lg hover:shadow-primary/10"
                    variant="outline"
                  >
                    View Uploaded Photo
                  </Button>
                )}
              </div>

              {/* Results */}
              <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="relative w-16 h-16 animate-spin">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                    </div>
                    <p className="text-muted-foreground animate-pulse">Analyzing your retinal image...</p>
                  </div>
                ) : analysisResult ? (
                  <ResultsDisplay result={analysisResult} />
                ) : null}
              </div>
            </div>

            {analysisResult && (
              <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Button
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="bg-primary hover:bg-primary/90 transition-smooth"
                >
                  {showChatbot ? 'Close' : 'Ask Questions'}
                </Button>
              </div>
            )}

            {showChatbot && (
              <div className="fixed bottom-6 right-6 w-80 h-96 bg-card border border-border/40 rounded-xl shadow-lg flex flex-col animate-scale-in">
                <div className="p-4 border-b border-border/40 flex items-center justify-between">
                  <h3 className="font-bold">OculusAI Assistant</h3>
                  <button
                    onClick={() => setShowChatbot(false)}
                    className="text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
                  <p className="text-center text-sm text-muted-foreground">
                    Chat interface coming soon. Ask your questions about the analysis here.
                  </p>
                </div>
                <div className="p-4 border-t border-border/40">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    className="w-full px-3 py-2 rounded-lg bg-muted border border-border/40 text-sm placeholder-muted-foreground disabled:opacity-50 transition-smooth"
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
