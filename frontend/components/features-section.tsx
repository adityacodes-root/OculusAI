import { Zap, Brain, Shield, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Brain,
    title: 'Advanced AI Model',
    description: 'Trained on 100,000+ retinal images using deep learning algorithms'
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get comprehensive results in seconds, not hours'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'HIPAA-compliant processing with end-to-end encryption'
  },
  {
    icon: TrendingUp,
    title: 'Clinical Accuracy',
    description: '98.2% accuracy rate validated by ophthalmologists'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-muted/40">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Why Choose OculusAI</h2>
          <p className="text-muted-foreground">Cutting-edge technology for eye disease detection</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
