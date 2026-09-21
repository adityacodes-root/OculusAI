import Link from 'next/link'
import { Check, Shield, Cpu, Activity, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function AboutPage() {
  const specs = [
    {
      title: 'Retinal Pathology Engine',
      description: 'MobileNetV2 inverted residual network running 256x256 image tensors to detect Diabetic Retinopathy, Glaucoma, Cataract, and Normal tissue.',
      details: ['Transfer-learned feature extractor', 'Circular fundus edge validator', 'Multi-class probability distribution']
    },
    {
      title: 'Ishihara Digit Classifier',
      description: 'Custom 8-layer deep convolutional neural network processing 128x128 plate crops to recognize embedded numerical digits (0-9).',
      details: ['4-block Conv2D + BatchNorm + Dropout', '99.52% top-1 validation accuracy', 'Deutan vs Protan likelihood estimation']
    },
    {
      title: 'Vision Deficiency Simulator',
      description: 'Physiological color matrix transformation pipeline calculating real-time spectral absorption variations across all cone classes.',
      details: ['Protanopia, Deuteranopia, Tritanopia', 'Cataract optical turbidity filter', 'Dual-view interactive split slider']
    },
    {
      title: 'Digital Acuity Screener',
      description: 'Angular resolution testing utilizing international standard ISO 8596 Tumbling E optotypes with physical display calibration.',
      details: ['Standard 5 arcminute resolution', 'Snellen 20/200 down to 20/15', 'Directional response logging']
    }
  ]

  const stack = [
    { component: 'Interface Layer', technology: 'Next.js 16, React 19, TypeScript, Tailwind CSS v4' },
    { component: 'Inference Backend', technology: 'Python 3.11, Flask 3.1, Flask-CORS, Pillow' },
    { component: 'Machine Learning', technology: 'TensorFlow 2.20, Keras 3.x' },
    { component: 'Document Engine', technology: 'jsPDF, Canvas 2D API' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="border-b border-border pb-6 mb-8">
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Technical Specification</div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Platform Architecture & Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed max-w-xl">
            OculusAI is a personal academic and vision science demonstration project created by Aditya to explore deep transfer learning and interactive optometric screening.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-6 sm:p-8 border border-border bg-card">
            <h2 className="text-base font-semibold tracking-tight mb-4">Core Subsystems</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {specs.map((item, idx) => (
                <div key={idx} className="space-y-2 text-xs">
                  <div className="font-semibold text-foreground text-sm">{item.title}</div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  <ul className="space-y-1 text-muted-foreground font-mono text-[11px] pt-1">
                    {item.details.map((d, dIdx) => (
                      <li key={dIdx}>• {d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 sm:p-8 border border-border bg-card">
            <h2 className="text-base font-semibold tracking-tight mb-4">Technology Stack</h2>
            <div className="divide-y divide-border text-xs font-mono">
              {stack.map((s, idx) => (
                <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-foreground font-medium">{s.component}</span>
                  <span className="text-muted-foreground">{s.technology}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded border border-border bg-muted/20 p-5 text-xs text-muted-foreground space-y-1">
            <div className="font-mono text-[11px] uppercase tracking-wider text-foreground font-semibold">Personal Portfolio Scope</div>
            <p className="leading-relaxed">
              Developed as a personal portfolio project. Models generate experimental probability distributions and vision emulations intended for portfolio presentation and academic study rather than certified medical usage.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
