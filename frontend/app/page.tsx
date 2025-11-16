import Link from 'next/link'
import { Sparkles, ArrowRight, Brain, Zap, Shield, BarChart3, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in-up">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold">OculusAI</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/analyze" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth">
              Analyze
            </Link>
            <Link href="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden sm:inline">
              About
            </Link>
            <ThemeToggle />
            <Link href="/analyze">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth text-xs sm:text-sm px-3 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-20 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute bottom-0 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-accent/20 rounded-full blur-3xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">AI-Powered Eye Disease Detection</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-balance mb-4 sm:mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            See Better, <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Diagnose Faster</span>
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto mb-8 sm:mb-10 px-4 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            OculusAI uses advanced machine learning to detect eye diseases from retinal images with 98.2% accuracy. Fast, secure, and trusted by healthcare professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <Link href="/analyze">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 transition-smooth w-full sm:w-auto">
                Start Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="transition-smooth w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 animate-fade-in-up">Why Choose OculusAI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'Advanced AI', desc: 'Trained on 100K+ images', stat: '100K+' },
              { icon: Zap, title: 'Instant Results', desc: 'Analyze in seconds', stat: '<3s' },
              { icon: Shield, title: 'HIPAA Secure', desc: 'End-to-end encryption', stat: '100%' },
              { icon: BarChart3, title: '98.2% Accurate', desc: 'Clinically validated', stat: '98.2%' }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div 
                  key={i} 
                  className="p-6 rounded-xl border border-border/40 bg-card hover:border-primary/40 transition-smooth-lg hover-lift animate-fade-in-up relative overflow-hidden group"
                  style={{ animationDelay: `${0.1 * i}s` }}
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2 animate-float">
                      {item.stat}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics Dashboard */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4">Trusted by Healthcare Professionals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform is making a real impact in early detection and prevention of eye diseases worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Images Analyzed', value: '2.5M+', change: '+12% this month', icon: Eye },
              { label: 'Healthcare Partners', value: '850+', change: 'Across 40 countries', icon: Shield },
              { label: 'Early Detections', value: '125K+', change: 'Lives impacted', icon: Brain },
              { label: 'Avg. Analysis Time', value: '2.8s', change: '99.9% uptime', icon: Zap }
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card 
                  key={idx} 
                  className="p-6 text-center hover-lift animate-fade-in-up border-border/40 hover:border-primary/30 transition-smooth-lg"
                  style={{ animationDelay: `${0.1 * idx}s` }}
                >
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2 animate-gradient">
                    {stat.value}
                  </div>
                  <div className="font-semibold mb-1 text-sm">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.change}</div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Eye Care?</h2>
          <p className="text-muted-foreground mb-8">Start analyzing retinal images with OculusAI today.</p>
          <Link href="/analyze">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth">
              Begin Analysis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 sm:py-8 px-4 bg-muted/30 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">© 2025 OculusAI. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth">Privacy</a>
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth">Terms</a>
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
