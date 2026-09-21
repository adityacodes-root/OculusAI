import Link from 'next/link'
import { ArrowRight, Eye, Palette, Scan, Focus, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function Home() {
  const modules = [
    {
      title: 'Retinal Pathology Screening',
      category: 'Diagnostic Imaging',
      description: 'Transfer-learned MobileNetV2 architecture trained on 256x256 fundus imaging for automated classification of Diabetic Retinopathy, Glaucoma, Cataract, and Normal retina.',
      href: '/analyze',
      badge: 'MobileNetV2',
      action: 'Launch Screening',
      icon: Eye,
      specs: ['Circular fundus validation', 'Confidence distribution', 'Clinical PDF export']
    },
    {
      title: 'Ishihara Chromatic Test',
      category: 'Color Discrimination',
      description: 'Custom 8-layer convolutional neural network trained on 1,400 multi-font Ishihara plates to identify embedded digits and assess Deutan versus Protan color weakness.',
      href: '/colorblindness',
      badge: '99.5% Accuracy',
      action: 'Start Examination',
      icon: Palette,
      specs: ['4 color vector themes', 'Likelihood ratio analysis', 'Standardized grading']
    },
    {
      title: 'Vision Deficiency Simulator',
      category: 'Optometric Modeling',
      description: 'Real-time color transformation pipeline reproducing perception under Protanopia, Deuteranopia, Tritanopia, and Cataract turbidity with split comparison.',
      href: '/simulator',
      badge: 'Interactive',
      action: 'Open Simulator',
      icon: Scan,
      specs: ['Side-by-side comparison', 'Custom image upload', 'Lens haze emulation']
    },
    {
      title: 'Visual Acuity Screener',
      category: 'Functional Assessment',
      description: 'Calibrated Tumbling E optotype screener with physical dimension normalization, multi-tier progression, and Snellen equivalent determination.',
      href: '/acuity',
      badge: 'Calibrated',
      action: 'Begin Acuity Test',
      icon: Focus,
      specs: ['Screen mm calibration', 'Snellen 20/200 to 20/15', 'Directional response matrix']
    }
  ]

  const metrics = [
    { label: 'Classification Classes', value: '4', note: 'DR, Glaucoma, Cataract, Normal' },
    { label: 'Ishihara Recognition', value: '99.5%', note: 'Multi-font plate validation' },
    { label: 'Inference Latency', value: '< 120ms', note: 'Optimized CPU pipeline' },
    { label: 'Input Dimensions', value: '256 x 256', note: 'Standard fundus resolution' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        <section className="relative border-b border-border/80 px-4 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl text-balance">
              OculusAI Vision Diagnostics
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
              A personal exploration into computational vision science and deep learning. Features retinal fundus pathology screening, automated Ishihara plate digit recognition, real-time vision deficiency simulation, and a digital visual acuity screener.
            </p>

            <div className="mt-4 inline-block rounded border border-border/70 bg-muted/30 px-3 py-1.5 text-[11px] font-mono text-muted-foreground">
              Note: This is a personal research & demonstration project, not intended for formal clinical diagnosis.
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/analyze">
                <Button size="lg" className="h-11 px-6 text-xs font-medium uppercase tracking-wider rounded-md">
                  Retinal Screening <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/colorblindness">
                <Button size="lg" variant="outline" className="h-11 px-6 text-xs font-medium uppercase tracking-wider rounded-md">
                  Color Vision Test
                </Button>
              </Link>
              <Link href="/simulator">
                <Button size="lg" variant="ghost" className="h-11 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
                  View Simulator
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border/80 bg-muted/20 py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((m, i) => (
                <div key={i} className="border-l border-border pl-4 sm:pl-6">
                  <div className="text-2xl sm:text-3xl font-semibold font-mono tracking-tight">{m.value}</div>
                  <div className="text-xs font-medium text-foreground mt-1">{m.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{m.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-border">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Project Modules</div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Diagnostic Tools & Simulators</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-2 md:mt-0 max-w-md">
              Designed as modular vision screening experiments running neural network inference on CPU runtimes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod, idx) => {
              const Icon = mod.icon
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-6 sm:p-8 hover:border-foreground/30 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted/40 text-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                          {mod.category}
                        </span>
                      </div>
                      <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {mod.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                      {mod.title}
                    </h3>

                    <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {mod.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {mod.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded border border-border/80 bg-background px-2 py-1 text-[10px] font-mono text-muted-foreground"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between">
                    <Link
                      href={mod.href}
                      className="inline-flex items-center text-xs font-medium uppercase tracking-wider text-foreground group-hover:translate-x-0.5 transition-transform"
                    >
                      {mod.action} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-t border-border bg-muted/10 py-16 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">Project Architecture</h3>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Built with TensorFlow, Keras, Flask, Next.js, and React. Created by Aditya to explore automated medical image classification and chromatic vision perception.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/diseases">
                <Button variant="outline" size="sm" className="text-xs font-medium">
                  Review Pathologies
                </Button>
              </Link>
              <Link href="/evaluation">
                <Button variant="outline" size="sm" className="text-xs font-medium">
                  View Model Architecture
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
