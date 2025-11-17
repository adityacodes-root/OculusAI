'use client'

import Link from 'next/link'
import { ArrowLeft, Eye, AlertCircle, Droplet, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNav } from '@/components/mobile-nav'

export default function DiseasesPage() {
  const diseases = [
    {
      name: 'Cataract',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: 'A clouding of the normally clear lens of the eye, leading to decreased vision.',
      longDescription: 'Cataracts develop when proteins in the eye lens break down and clump together, creating cloudy areas. This is a natural part of aging but can also result from injury, medications, or other health conditions.',
      symptoms: [
        'Cloudy or blurry vision',
        'Faded colors',
        'Glare and halos around lights',
        'Poor night vision',
        'Double vision in one eye',
        'Frequent prescription changes'
      ],
      causes: [
        'Aging (most common)',
        'Diabetes',
        'Prolonged UV exposure',
        'Smoking',
        'Eye injury or surgery',
        'Long-term corticosteroid use',
        'Excessive alcohol consumption'
      ],
      treatment: [
        'Early stage: Updated eyeglass prescription, better lighting',
        'Advanced stage: Cataract surgery (phacoemulsification)',
        'Intraocular lens (IOL) implantation',
        'Surgery is safe, effective, and commonly performed',
        'Success rate: >95% with modern techniques'
      ],
      prevention: [
        'Wear UV-protective sunglasses',
        'Quit smoking',
        'Limit alcohol consumption',
        'Manage diabetes and blood pressure',
        'Eat antioxidant-rich foods',
        'Regular eye examinations'
      ]
    },
    {
      name: 'Diabetic Retinopathy',
      icon: Droplet,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      description: 'A diabetes complication that damages blood vessels in the retina.',
      longDescription: 'Diabetic retinopathy occurs when high blood sugar levels damage the tiny blood vessels in the retina. It can progress from mild vision problems to blindness if left untreated. It\'s the leading cause of blindness in working-age adults.',
      symptoms: [
        'Floaters or dark spots in vision',
        'Blurred or fluctuating vision',
        'Dark or empty areas in vision',
        'Difficulty seeing colors',
        'Vision loss (in advanced stages)',
        'Often asymptomatic in early stages'
      ],
      causes: [
        'Poorly controlled blood sugar levels',
        'Long duration of diabetes',
        'High blood pressure',
        'High cholesterol',
        'Pregnancy (gestational diabetes)',
        'Smoking'
      ],
      treatment: [
        'Strict blood sugar control (HbA1c <7%)',
        'Anti-VEGF injections (Lucentis, Eylea, Avastin)',
        'Laser photocoagulation therapy',
        'Vitrectomy surgery for severe cases',
        'Regular monitoring and early intervention',
        'Control blood pressure and cholesterol'
      ],
      prevention: [
        'Maintain optimal blood glucose levels',
        'Monitor HbA1c regularly (every 3 months)',
        'Annual dilated eye exams',
        'Control blood pressure (<140/90)',
        'Manage cholesterol levels',
        'Quit smoking',
        'Healthy diet and regular exercise'
      ]
    },
    {
      name: 'Glaucoma',
      icon: AlertCircle,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      description: 'A group of eye diseases that damage the optic nerve, often due to high eye pressure.',
      longDescription: 'Glaucoma is called the "silent thief of sight" because it typically has no early symptoms. It progressively damages the optic nerve, usually due to increased intraocular pressure. Once vision is lost to glaucoma, it cannot be recovered.',
      symptoms: [
        'Gradual loss of peripheral vision',
        'Tunnel vision (advanced stages)',
        'Severe eye pain (acute angle-closure)',
        'Headache',
        'Nausea and vomiting (acute type)',
        'Blurred vision',
        'Halos around lights'
      ],
      causes: [
        'Elevated intraocular pressure (IOP)',
        'Poor drainage of aqueous humor',
        'Reduced blood flow to optic nerve',
        'Genetic factors',
        'Thin corneas',
        'Optic nerve sensitivity'
      ],
      treatment: [
        'Prescription eye drops (prostaglandins, beta-blockers)',
        'Oral medications to reduce IOP',
        'Laser trabeculoplasty (SLT)',
        'Minimally invasive glaucoma surgery (MIGS)',
        'Trabeculectomy (filtering surgery)',
        'Drainage implants for advanced cases',
        'Lifelong monitoring required'
      ],
      prevention: [
        'Regular comprehensive eye exams (every 1-2 years)',
        'Early detection through screening',
        'Know your family history',
        'Exercise regularly (can lower IOP)',
        'Protect eyes from injury',
        'Limit caffeine intake',
        'Take prescribed eye drops consistently'
      ]
    },
    {
      name: 'Normal Eye',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      description: 'Healthy eye with no detectable signs of disease.',
      longDescription: 'A normal, healthy eye has clear optics, well-perfused retinal blood vessels, a healthy optic nerve, and proper intraocular pressure. Regular maintenance and preventive care help preserve eye health throughout life.',
      symptoms: [
        'Clear, sharp vision',
        'No pain or discomfort',
        'No floaters or flashes',
        'Normal color perception',
        'Good peripheral vision',
        'Comfortable in various lighting'
      ],
      causes: [
        'Genetic factors supporting good eye health',
        'Healthy lifestyle choices',
        'Adequate nutrition',
        'Protection from UV exposure',
        'Regular eye care',
        'Absence of systemic diseases affecting eyes'
      ],
      treatment: [
        'No treatment needed',
        'Continue routine eye examinations',
        'Maintain healthy lifestyle',
        'Use corrective lenses if needed for refractive errors',
        'Protect eyes from injury and UV light'
      ],
      prevention: [
        'Annual comprehensive eye exams',
        'Wear UV-protective sunglasses',
        'Maintain healthy diet (leafy greens, omega-3s)',
        'Exercise regularly',
        'Don\'t smoke',
        'Manage systemic health conditions',
        'Give eyes regular breaks from screens (20-20-20 rule)',
        'Stay hydrated'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-lg sm:text-xl font-bold cursor-pointer">OculusAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              Home
            </Link>
            <Link href="/analyze" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              Retinal Test
            </Link>
            <Link href="/colorblindness" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              Colour Blindness Test
            </Link>
            <Link href="/diseases" className="text-xs sm:text-sm text-foreground font-medium hover:text-foreground transition-smooth hidden md:inline">
              Diseases
            </Link>
            <Link href="/evaluation" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              Model
            </Link>
            <Link href="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-smooth hidden md:inline">
              About
            </Link>
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Introduction */}
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Detectable Eye Conditions</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mb-4">
            Learn about the four categories of eye diseases that OculusAI can detect from retinal fundus images. 
            Understanding these conditions helps in early detection and timely intervention.
          </p>
          <p className="text-muted-foreground text-base max-w-3xl">
            <strong className="text-foreground">Note:</strong> OculusAI also provides colour vision testing 
            using AI-powered Ishihara-style tests to detect Protan and Deutan type colour blindness. 
            Visit the <Link href="/colorblindness" className="text-primary hover:underline">Colour Blindness Test</Link> page to learn more.
          </p>
        </div>

        {/* Disease Cards */}
        <div className="space-y-12">
          {diseases.map((disease, index) => {
            const Icon = disease.icon
            return (
              <Card 
                key={disease.name} 
                className={`p-6 sm:p-8 border-2 ${disease.borderColor} ${disease.bgColor} animate-fade-in-up hover-card-subtle`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${disease.color}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">{disease.name}</h3>
                    <p className="text-muted-foreground">{disease.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Overview */}
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-foreground">Overview</h4>
                    <p className="text-muted-foreground leading-relaxed">{disease.longDescription}</p>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-foreground">Common Symptoms</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {disease.symptoms.map((symptom, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${disease.color} mt-2 flex-shrink-0`}></div>
                          <span className="text-sm text-muted-foreground">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Causes & Risk Factors */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-foreground">Causes & Risk Factors</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {disease.causes.map((cause, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${disease.color} mt-2 flex-shrink-0`}></div>
                          <span className="text-sm text-muted-foreground">{cause}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-foreground">Treatment Options</h4>
                    <div className="space-y-2">
                      {disease.treatment.map((treatment, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${disease.color} mt-2 flex-shrink-0`}></div>
                          <span className="text-sm text-muted-foreground">{treatment}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prevention */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-foreground">Prevention & Management</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {disease.prevention.map((prevention, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${disease.color} mt-2 flex-shrink-0`}></div>
                          <span className="text-sm text-muted-foreground">{prevention}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Important Notice */}
        <Card className="mt-12 p-6 bg-amber-500/5 border-amber-500/20 animate-fade-in-up">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Important Medical Disclaimer</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This information is for educational purposes only. OculusAI is an academic demonstration project 
                and should not be used for actual medical diagnosis. If you experience any vision problems or symptoms, 
                please consult a qualified ophthalmologist or eye care professional immediately. Early detection and 
                proper medical care are crucial for preserving vision and preventing complications.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
