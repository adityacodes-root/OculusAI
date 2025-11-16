import { Zap, Brain, Shield, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Brain,
    title: 'Deep Learning Model',
    description: 'Convolutional Neural Network trained to detect multiple eye diseases'
  },
  {
    icon: Zap,
    title: 'Real-Time Analysis',
    description: 'Get predictions within seconds using Flask backend and Keras model'
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'All processing done locally with no data storage or external sharing'
  },
  {
    icon: TrendingUp,
    title: 'Multi-Class Detection',
    description: 'Detects cataract, glaucoma, diabetic retinopathy, and normal eyes'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-muted/40">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Project Features</h2>
          <p className="text-muted-foreground">Academic demonstration of AI technology in ophthalmology</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="p-6 bg-card border-border hover-card-subtle transition-smooth">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
