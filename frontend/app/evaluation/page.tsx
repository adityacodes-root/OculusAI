'use client'

import { useState } from 'react'
import { Layers, Target, TrendingUp, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function EvaluationPage() {
  const [selectedModel, setSelectedModel] = useState<'eye-disease' | 'ishihara'>('eye-disease')

  const eyeDiseaseAccuracyData = [
    { epoch: 1, accuracy: 65.0 },
    { epoch: 2, accuracy: 72.0 },
    { epoch: 3, accuracy: 78.0 },
    { epoch: 4, accuracy: 83.0 },
    { epoch: 5, accuracy: 86.0 },
    { epoch: 6, accuracy: 88.0 },
    { epoch: 7, accuracy: 89.0 },
    { epoch: 8, accuracy: 88.5 }
  ]

  const eyeDiseaseLossData = [
    { epoch: 1, loss: 1.70 },
    { epoch: 2, loss: 1.30 },
    { epoch: 3, loss: 0.96 },
    { epoch: 4, loss: 0.70 },
    { epoch: 5, loss: 0.56 },
    { epoch: 6, loss: 0.46 },
    { epoch: 7, loss: 0.40 },
    { epoch: 8, loss: 0.38 }
  ]

  const ishiharaAccuracyData = [
    { epoch: 1, accuracy: 75.0 },
    { epoch: 5, accuracy: 88.0 },
    { epoch: 10, accuracy: 94.0 },
    { epoch: 15, accuracy: 97.0 },
    { epoch: 20, accuracy: 98.5 },
    { epoch: 26, accuracy: 99.52 },
    { epoch: 30, accuracy: 99.4 },
    { epoch: 33, accuracy: 99.2 }
  ]

  const ishiharaLossData = [
    { epoch: 1, loss: 2.10 },
    { epoch: 5, loss: 0.82 },
    { epoch: 10, loss: 0.35 },
    { epoch: 15, loss: 0.18 },
    { epoch: 20, loss: 0.09 },
    { epoch: 26, loss: 0.04 },
    { epoch: 30, loss: 0.05 },
    { epoch: 33, loss: 0.06 }
  ]

  const accuracyData = selectedModel === 'eye-disease' ? eyeDiseaseAccuracyData : ishiharaAccuracyData
  const lossData = selectedModel === 'eye-disease' ? eyeDiseaseLossData : ishiharaLossData

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">OculusAI • Empirical Validation</div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Network Architecture & Training Curves</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Performance metrics, layer topologies, and convergence trajectories for both deep learning models.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              variant={selectedModel === 'eye-disease' ? 'default' : 'outline'}
              size="sm"
              className="text-xs font-mono"
              onClick={() => setSelectedModel('eye-disease')}
            >
              Retinal Pathology (89.0%)
            </Button>
            <Button
              variant={selectedModel === 'ishihara' ? 'default' : 'outline'}
              size="sm"
              className="text-xs font-mono"
              onClick={() => setSelectedModel('ishihara')}
            >
              Ishihara CNN (99.5%)
            </Button>
          </div>
        </div>

        <section className="space-y-8">
          <Card className="p-6 sm:p-8 border border-border bg-card">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
              <Layers className="h-3.5 w-3.5" />
              Structural Configuration
            </div>

            {selectedModel === 'eye-disease' ? (
              <div className="grid sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="font-mono text-muted-foreground uppercase text-[10px] mb-1">Feature Extractor Backbone</div>
                  <div className="text-sm font-semibold text-foreground">MobileNetV2 (Inverted Residuals)</div>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    Depthwise separable convolutions optimized for high feature extraction efficiency with low computational latency on CPU runtimes.
                  </p>
                  <ul className="mt-3 space-y-1 text-muted-foreground font-mono text-[11px]">
                    <li>• Input Resolution: 256 x 256 x 3</li>
                    <li>• Frozen Base Parameters: 2,257,984</li>
                    <li>• Feature Vector Output: 1,280 dimensions</li>
                  </ul>
                </div>

                <div>
                  <div className="font-mono text-muted-foreground uppercase text-[10px] mb-1">Classification Head</div>
                  <div className="text-sm font-semibold text-foreground">GlobalAveragePooling2D + Softmax</div>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    Dropout layer (rate 0.2) applied prior to a dense 4-unit output layer generating categorical probability distribution.
                  </p>
                  <ul className="mt-3 space-y-1 text-muted-foreground font-mono text-[11px]">
                    <li>• Output Units: 4 (Cataract, DR, Glaucoma, Normal)</li>
                    <li>• Loss Function: Categorical Cross-Entropy</li>
                    <li>• Optimization: Adam with learning rate scheduling</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="font-mono text-muted-foreground uppercase text-[10px] mb-1">Convolutional Pipeline</div>
                  <div className="text-sm font-semibold text-foreground">Custom 8-Layer ConvNet (4 Blocks)</div>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    Dual 3x3 Conv2D layers per block with BatchNormalization and spatial MaxPooling (2x2) ensuring robust dot pattern feature learning.
                  </p>
                  <ul className="mt-3 space-y-1 text-muted-foreground font-mono text-[11px]">
                    <li>• Input Resolution: 128 x 128 x 3</li>
                    <li>• Filter Depths: 32 → 64 → 128 → 256</li>
                    <li>• Total Parameters: 29.1M (9.7M trainable)</li>
                  </ul>
                </div>

                <div>
                  <div className="font-mono text-muted-foreground uppercase text-[10px] mb-1">Fully Connected Pipeline</div>
                  <div className="text-sm font-semibold text-foreground">Flatten + Dense(512) + Dense(256) + Softmax(10)</div>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    Heavy dropout regularization (0.5) across dense layers preventing font-specific overfitting.
                  </p>
                  <ul className="mt-3 space-y-1 text-muted-foreground font-mono text-[11px]">
                    <li>• Training Samples: 984 plates (28 fonts)</li>
                    <li>• Validation Samples: 416 plates (12 unseen fonts)</li>
                    <li>• Top-1 Validation Accuracy: 99.52%</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 sm:p-8 border border-border bg-card">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-6">
              <TrendingUp className="h-3.5 w-3.5" />
              Epoch Convergence Trajectories
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded border border-border bg-card/60 p-4">
                <div className="flex items-center justify-between text-xs font-mono text-foreground mb-4">
                  <span className="font-semibold">Validation Accuracy (%)</span>
                  <span className="text-emerald-500 font-bold">
                    {selectedModel === 'eye-disease' ? 'Peak: 89.0%' : 'Peak: 99.52%'}
                  </span>
                </div>
                <div className="w-full h-64 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracyData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#a1a1aa" opacity={0.25} />
                      <XAxis dataKey="epoch" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 11 }} />
                      <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 11 }} domain={[50, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          color: '#ffffff',
                          borderRadius: '6px',
                          border: '1px solid #3f3f46',
                          fontSize: '11px',
                          fontFamily: 'monospace'
                        }}
                        formatter={(val: any) => [`${val}%`, 'Accuracy']}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ fill: '#2563eb', stroke: '#2563eb', r: 4 }}
                        activeDot={{ fill: '#60a5fa', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-[11px] font-mono text-muted-foreground text-center">
                  Epochs vs Validation Accuracy
                </div>
              </div>

              <div className="rounded border border-border bg-card/60 p-4">
                <div className="flex items-center justify-between text-xs font-mono text-foreground mb-4">
                  <span className="font-semibold">Cross-Entropy Loss</span>
                  <span className="text-red-500 font-bold">
                    {selectedModel === 'eye-disease' ? 'Final: 0.38' : 'Final: 0.04'}
                  </span>
                </div>
                <div className="w-full h-64 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lossData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#a1a1aa" opacity={0.25} />
                      <XAxis dataKey="epoch" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 11 }} />
                      <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 11 }} domain={[0, 'auto']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          color: '#ffffff',
                          borderRadius: '6px',
                          border: '1px solid #3f3f46',
                          fontSize: '11px',
                          fontFamily: 'monospace'
                        }}
                        formatter={(val: any) => [val, 'Loss']}
                      />
                      <Line
                        type="monotone"
                        dataKey="loss"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        dot={{ fill: '#ef4444', stroke: '#ef4444', r: 4 }}
                        activeDot={{ fill: '#f87171', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-[11px] font-mono text-muted-foreground text-center">
                  Epochs vs Categorical Loss
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 border border-border bg-card">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
              <Target className="h-3.5 w-3.5" />
              {selectedModel === 'eye-disease' ? 'Retinal Confusion Matrix' : 'Digit-Wise Precision'}
            </div>

            {selectedModel === 'eye-disease' ? (
              <div className="overflow-x-auto text-xs font-mono">
                <table className="w-full border-collapse border border-border text-left">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="border border-border p-2.5">Ground Truth</th>
                      <th className="border border-border p-2.5">Cataract</th>
                      <th className="border border-border p-2.5">DR</th>
                      <th className="border border-border p-2.5">Glaucoma</th>
                      <th className="border border-border p-2.5">Normal</th>
                      <th className="border border-border p-2.5">Class Recall</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2.5 font-semibold">Cataract</td>
                      <td className="border border-border p-2.5 font-bold bg-muted/40 text-blue-500">85</td>
                      <td className="border border-border p-2.5 text-muted-foreground">8</td>
                      <td className="border border-border p-2.5 text-muted-foreground">4</td>
                      <td className="border border-border p-2.5 text-muted-foreground">3</td>
                      <td className="border border-border p-2.5 font-semibold">85.0%</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2.5 font-semibold">DR</td>
                      <td className="border border-border p-2.5 text-muted-foreground">5</td>
                      <td className="border border-border p-2.5 font-bold bg-muted/40 text-blue-500">88</td>
                      <td className="border border-border p-2.5 text-muted-foreground">4</td>
                      <td className="border border-border p-2.5 text-muted-foreground">3</td>
                      <td className="border border-border p-2.5 font-semibold">88.0%</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2.5 font-semibold">Glaucoma</td>
                      <td className="border border-border p-2.5 text-muted-foreground">6</td>
                      <td className="border border-border p-2.5 text-muted-foreground">3</td>
                      <td className="border border-border p-2.5 font-bold bg-muted/40 text-blue-500">87</td>
                      <td className="border border-border p-2.5 text-muted-foreground">4</td>
                      <td className="border border-border p-2.5 font-semibold">87.0%</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2.5 font-semibold">Normal</td>
                      <td className="border border-border p-2.5 text-muted-foreground">2</td>
                      <td className="border border-border p-2.5 text-muted-foreground">3</td>
                      <td className="border border-border p-2.5 text-muted-foreground">2</td>
                      <td className="border border-border p-2.5 font-bold bg-muted/40 text-blue-500">93</td>
                      <td className="border border-border p-2.5 font-semibold">93.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { digit: '0', acc: '99.8%' },
                  { digit: '1', acc: '99.9%' },
                  { digit: '2', acc: '99.5%' },
                  { digit: '3', acc: '99.2%' },
                  { digit: '4', acc: '99.6%' },
                  { digit: '5', acc: '99.3%' },
                  { digit: '6', acc: '99.7%' },
                  { digit: '7', acc: '99.4%' },
                  { digit: '8', acc: '99.1%' },
                  { digit: '9', acc: '99.5%' },
                ].map((item) => (
                  <div key={item.digit} className="rounded border border-border p-3 text-center bg-muted/10">
                    <div className="font-mono text-lg font-bold text-foreground">{item.digit}</div>
                    <div className="font-mono text-xs text-muted-foreground mt-0.5">{item.acc}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
