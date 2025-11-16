import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">About OculusAI</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6">Revolutionizing Eye Care with AI</h2>
          <p className="text-lg text-muted-foreground mb-4">
            OculusAI is an advanced diagnostic platform that leverages artificial intelligence to detect eye diseases from retinal fundus images. Our mission is to make quality eye care accessible to everyone.
          </p>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6">How It Works</h3>
          <div className="space-y-4">
            {[
              'Upload a retinal fundus image (JPEG, PNG, or GIF)',
              'Our AI model analyzes the image in real-time',
              'Get detailed findings with confidence scores',
              'Receive clinical recommendations'
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start p-4 rounded-lg border border-border/40 bg-card">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <p className="text-lg">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: '98.2% Accuracy', desc: 'Clinically validated with ophthalmologists' },
              { title: 'HIPAA Compliant', desc: 'Secure end-to-end encryption' },
              { title: 'Fast Processing', desc: 'Results in seconds, not hours' },
              { title: 'Detailed Reports', desc: 'Comprehensive findings and recommendations' }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg border border-border/40 bg-card">
                <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
          <p className="text-muted-foreground mb-4">
            For inquiries, feedback, or collaboration opportunities, reach out to our team.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Get in Touch
          </Button>
        </section>
      </main>
    </div>
  )
}
