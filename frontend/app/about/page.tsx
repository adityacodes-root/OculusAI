import Link from 'next/link'
import { ArrowLeft, Check, Brain, Code, Database, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="transition-smooth">
                <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold">About OculusAI</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">AI-Powered Eye Disease Detection</h2>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            OculusAI is an academic demonstration project showcasing the application of deep learning 
            technology in medical imaging, specifically for detecting eye diseases from retinal fundus images.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This project demonstrates how convolutional neural networks can be trained to assist in 
            identifying common eye conditions, providing a proof-of-concept for AI in ophthalmology.
          </p>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 animate-fade-in-up">How It Works</h3>
          <div className="space-y-4">
            {[
              { step: 'Upload a retinal fundus image (JPEG, PNG, or GIF format)', icon: '1' },
              { step: 'Image is preprocessed and resized to 256×256 pixels', icon: '2' },
              { step: 'CNN model analyzes the image and predicts disease class', icon: '3' },
              { step: 'Get detailed results with confidence scores for all 4 classes', icon: '4' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start p-4 rounded-lg border border-border bg-card hover-card-subtle transition-smooth animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{item.icon}</span>
                </div>
                <p className="text-base text-foreground pt-0.5">{item.step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 animate-fade-in-up">Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Deep Learning', desc: 'TensorFlow & Keras CNN model', icon: Brain },
              { title: 'Modern Frontend', desc: 'Next.js 15 with React 19 & TypeScript', icon: Code },
              { title: 'Fast Backend', desc: 'Flask API with Python integration', icon: Zap },
              { title: 'Model Format', desc: '.keras format with 256×256 input', icon: Database }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} className="p-6 border-border hover-card-subtle transition-smooth animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-foreground">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 animate-fade-in-up">Detectable Conditions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Cataract - Lens clouding',
              'Diabetic Retinopathy - Retinal blood vessel damage',
              'Glaucoma - Optic nerve damage',
              'Normal - Healthy eye'
            ].map((condition, i) => (
              <div key={i} className="flex gap-3 items-center p-4 rounded-lg border border-border bg-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-foreground">{condition}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 animate-fade-in-up">Project Purpose</h3>
          <Card className="p-6 bg-muted/30 border-border">
            <p className="text-muted-foreground mb-4 leading-relaxed">
              This is an <strong className="text-foreground">academic project</strong> created to demonstrate 
              the potential of AI in medical imaging. It serves as a proof-of-concept for how deep learning 
              can be applied to assist healthcare professionals in early disease detection.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The project showcases modern web technologies, machine learning workflows, and user-centered 
              design principles for medical applications.
            </p>
          </Card>
        </section>

        <section className="animate-fade-in-up">
          <Card className="p-6 bg-amber-500/5 border-amber-500/20">
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              <Check className="w-5 h-5 text-amber-500" />
              Important Notice
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              This application is a demonstration project for educational and research purposes only. 
              It is <strong className="text-foreground">not intended for clinical use</strong> or as a 
              substitute for professional medical diagnosis. Always consult qualified ophthalmologists 
              for actual eye health concerns and medical advice.
            </p>
          </Card>
        </section>
      </main>
    </div>
  )
}
