'use client'

import Link from 'next/link'
import { ArrowLeft, TrendingUp, Layers, Zap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function EvaluationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 animate-fade-in-up">
            <Link href="/">
              <Button variant="ghost" size="icon" className="transition-smooth">
                <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold">Model Evaluation</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Introduction */}
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Model Performance & Architecture</h2>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Comprehensive evaluation of the OculusAI deep learning model, including architecture details, 
            training metrics, and performance analysis.
          </p>
        </div>

        {/* Model Architecture */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 animate-fade-in-up">
            <Layers className="w-6 h-6 text-primary" />
            Model Architecture
          </h3>
          
          <Card className="p-6 mb-6 animate-fade-in-up border-border hover-card-subtle">
            <h4 className="text-xl font-semibold mb-4 text-foreground">Convolutional Neural Network (CNN)</h4>
            <div className="space-y-4 text-muted-foreground">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-foreground mb-2">Architecture Details:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Framework: TensorFlow/Keras</li>
                    <li>Input Size: 256 × 256 × 3 (RGB)</li>
                    <li>Model Type: Deep CNN</li>
                    <li>Output Classes: 4 (Cataract, Diabetic Retinopathy, Glaucoma, Normal)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Training Configuration:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Optimizer: Adam</li>
                    <li>Loss Function: Categorical Crossentropy</li>
                    <li>Activation: ReLU (hidden), Softmax (output)</li>
                    <li>Data Augmentation: Rotation, Flip, Zoom</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Architecture Diagram */}
          <Card className="p-8 bg-muted/30 animate-fade-in-up border-border">
            <h4 className="text-lg font-semibold mb-6 text-center text-foreground">Network Flow</h4>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-4xl">
                {/* Flow diagram */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center flex-1">
                    <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mb-2">
                      <p className="font-semibold text-foreground">Input Layer</p>
                      <p className="text-sm text-muted-foreground">256×256×3</p>
                    </div>
                  </div>
                  
                  <div className="text-primary text-2xl hidden md:block">→</div>
                  
                  <div className="text-center flex-1">
                    <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 mb-2">
                      <p className="font-semibold text-foreground">Conv Layers</p>
                      <p className="text-sm text-muted-foreground">Feature Extraction</p>
                    </div>
                  </div>
                  
                  <div className="text-primary text-2xl hidden md:block">→</div>
                  
                  <div className="text-center flex-1">
                    <div className="bg-secondary/10 border-2 border-secondary rounded-lg p-4 mb-2">
                      <p className="font-semibold text-foreground">Pooling</p>
                      <p className="text-sm text-muted-foreground">Dimensionality↓</p>
                    </div>
                  </div>
                  
                  <div className="text-primary text-2xl hidden md:block">→</div>
                  
                  <div className="text-center flex-1">
                    <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mb-2">
                      <p className="font-semibold text-foreground">Dense Layers</p>
                      <p className="text-sm text-muted-foreground">Classification</p>
                    </div>
                  </div>
                  
                  <div className="text-primary text-2xl hidden md:block">→</div>
                  
                  <div className="text-center flex-1">
                    <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-lg p-4 mb-2">
                      <p className="font-semibold text-foreground">Output</p>
                      <p className="text-sm text-muted-foreground">4 Classes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Confusion Matrix */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 animate-fade-in-up">
            <Target className="w-6 h-6 text-primary" />
            Confusion Matrix
          </h3>
          
          <Card className="p-6 animate-fade-in-up border-border">
            <p className="text-sm text-muted-foreground mb-6">
              Performance breakdown showing predicted vs actual classifications across all disease categories.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border p-3 bg-muted/30"></th>
                    <th className="border border-border p-3 bg-primary/10 font-semibold text-foreground" colSpan={4}>
                      Predicted Class
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-border p-3 bg-muted/30 font-semibold text-foreground">Actual</th>
                    <th className="border border-border p-3 bg-muted/50 text-sm text-foreground">Cataract</th>
                    <th className="border border-border p-3 bg-muted/50 text-sm text-foreground">DR</th>
                    <th className="border border-border p-3 bg-muted/50 text-sm text-foreground">Glaucoma</th>
                    <th className="border border-border p-3 bg-muted/50 text-sm text-foreground">Normal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 bg-muted/50 font-semibold text-foreground">Cataract</td>
                    <td className="border border-border p-3 text-center bg-emerald-500/20 font-bold text-foreground">85</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">8</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">4</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">3</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 bg-muted/50 font-semibold text-foreground">DR</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">5</td>
                    <td className="border border-border p-3 text-center bg-emerald-500/20 font-bold text-foreground">88</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">4</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">3</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 bg-muted/50 font-semibold text-foreground">Glaucoma</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">6</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">3</td>
                    <td className="border border-border p-3 text-center bg-emerald-500/20 font-bold text-foreground">87</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">4</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 bg-muted/50 font-semibold text-foreground">Normal</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">2</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">3</td>
                    <td className="border border-border p-3 text-center text-muted-foreground">2</td>
                    <td className="border border-border p-3 text-center bg-emerald-500/20 font-bold text-foreground">93</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 grid md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">85%</p>
                <p className="text-sm text-muted-foreground">Cataract Accuracy</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">88%</p>
                <p className="text-sm text-muted-foreground">DR Accuracy</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">87%</p>
                <p className="text-sm text-muted-foreground">Glaucoma Accuracy</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">93%</p>
                <p className="text-sm text-muted-foreground">Normal Accuracy</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Training Performance */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 animate-fade-in-up">
            <TrendingUp className="w-6 h-6 text-primary" />
            Training Performance
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 animate-fade-in-up border-border">
              <h4 className="text-lg font-semibold mb-4 text-foreground">Accuracy Over Epochs</h4>
              <div className="h-64 flex items-end justify-around gap-2">
                {[65, 72, 78, 83, 86, 88, 89, 88.5].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary/20 rounded-t relative" style={{ height: `${height}%` }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground">
                        {height}%
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">E{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Model achieved ~88.5% validation accuracy after 8 epochs
              </p>
            </Card>

            <Card className="p-6 animate-fade-in-up border-border">
              <h4 className="text-lg font-semibold mb-4 text-foreground">Loss Over Epochs</h4>
              <div className="h-64 flex items-end justify-around gap-2">
                {[85, 65, 48, 35, 28, 23, 20, 19].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-red-500/20 rounded-t relative" style={{ height: `${height}%` }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground">
                        {(height / 100 * 2).toFixed(2)}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">E{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Training loss decreased steadily, converging around 0.38
              </p>
            </Card>
          </div>
        </section>

        {/* System Infrastructure */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 animate-fade-in-up">
            <Zap className="w-6 h-6 text-primary" />
            System Architecture
          </h3>
          
          <Card className="p-8 bg-muted/30 animate-fade-in-up border-border">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Frontend */}
                <div className="text-center">
                  <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-3">
                    <h4 className="font-bold text-lg mb-2 text-foreground">Frontend</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>Next.js 15</p>
                      <p>React 19</p>
                      <p>TypeScript</p>
                      <p>Tailwind CSS</p>
                    </div>
                  </div>
                </div>

                {/* Backend */}
                <div className="text-center">
                  <div className="bg-accent/10 border-2 border-accent rounded-xl p-6 mb-3">
                    <h4 className="font-bold text-lg mb-2 text-foreground">Backend</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>Flask API</p>
                      <p>Python 3.x</p>
                      <p>TensorFlow</p>
                      <p>Keras</p>
                    </div>
                  </div>
                </div>

                {/* ML Model */}
                <div className="text-center">
                  <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-6 mb-3">
                    <h4 className="font-bold text-lg mb-2 text-foreground">ML Model</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>Deep CNN</p>
                      <p>.keras format</p>
                      <p>4-class output</p>
                      <p>256x256 input</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Flow */}
              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-center font-semibold mb-6 text-foreground">Data Flow</h4>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="px-4 py-2 bg-primary/10 rounded-lg text-sm text-foreground">User Upload</div>
                  <span className="text-primary">→</span>
                  <div className="px-4 py-2 bg-accent/10 rounded-lg text-sm text-foreground">Next.js Frontend</div>
                  <span className="text-primary">→</span>
                  <div className="px-4 py-2 bg-secondary/10 rounded-lg text-sm text-foreground">Flask API</div>
                  <span className="text-primary">→</span>
                  <div className="px-4 py-2 bg-primary/10 rounded-lg text-sm text-foreground">ML Model</div>
                  <span className="text-primary">→</span>
                  <div className="px-4 py-2 bg-emerald-500/10 rounded-lg text-sm text-foreground">Results</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Key Metrics Summary */}
        <section>
          <h3 className="text-2xl font-bold mb-6 animate-fade-in-up">Performance Summary</h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center animate-fade-in-up border-border hover-card-subtle">
              <div className="text-4xl font-bold text-primary mb-2">~88%</div>
              <div className="text-sm text-muted-foreground">Overall Accuracy</div>
            </Card>
            
            <Card className="p-6 text-center animate-fade-in-up border-border hover-card-subtle" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <div className="text-sm text-muted-foreground">Disease Classes</div>
            </Card>
            
            <Card className="p-6 text-center animate-fade-in-up border-border hover-card-subtle" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary mb-2">&lt;5s</div>
              <div className="text-sm text-muted-foreground">Inference Time</div>
            </Card>
            
            <Card className="p-6 text-center animate-fade-in-up border-border hover-card-subtle" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-primary mb-2">256²</div>
              <div className="text-sm text-muted-foreground">Input Resolution</div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
