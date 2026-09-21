'use client'

import Link from 'next/link'
import { Eye, AlertCircle, Droplet, Activity, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function DiseasesPage() {
  const diseases = [
    {
      name: 'Cataract',
      icon: Eye,
      description: 'Progressive opacification of the crystalline lens decreasing light transmittance and visual resolution.',
      longDescription: 'Cataracts develop when structural crystallin proteins in the lens aggregate into insoluble clumps. Common risk factors include aging, ultraviolet radiation, and metabolic dysregulation.',
      symptoms: [
        'Cloudy or blurred optical transmission',
        'Impaired chromatic discrimination',
        'Glare and halos around luminaires',
        'Reduced scotopic (night) sensitivity',
        'Monocular diplopia',
        'Frequent myopic shifts'
      ],
      causes: [
        'Senescent protein oxidation (primary etiology)',
        'Diabetic glycation reactions',
        'Prolonged cumulative UV-B exposure',
        'Cigarette smoking',
        'Ocular trauma or prior intraocular surgery',
        'Chronic corticosteroid therapy'
      ],
      treatment: [
        'Early stages: Refractive compensation and high-contrast illumination',
        'Definitive: Extracapsular phacoemulsification with intraocular lens (IOL) implantation',
        'Prognosis: >98% visual restoration post-surgery'
      ],
      prevention: [
        'UV-blocking ophthalmic lenses',
        'Glycemic control in diabetic cohorts',
        'Smoking cessation',
        'Periodic slit-lamp biomicroscopy'
      ]
    },
    {
      name: 'Diabetic Retinopathy',
      icon: Droplet,
      description: 'Retinal microvascular angiopathy precipitated by chronic hyperglycemia and capillary basement thickening.',
      longDescription: 'Diabetic retinopathy progresses from non-proliferative (microaneurysms, intraretinal hemorrhages, hard exudates) to proliferative stages marked by VEGF-mediated neovascularization, vitreous hemorrhage, and tractional retinal detachment.',
      symptoms: [
        'Floating vitreous opacities and scotomas',
        'Fluctuating visual acuity',
        'Central scotoma from macular edema',
        'Impaired color contrast',
        'Often asymptomatic in early microvascular stages'
      ],
      causes: [
        'Chronic elevated glycated hemoglobin (HbA1c)',
        'Duration of diabetes mellitus',
        'Concurrent systemic hypertension',
        'Hyperlipidemia and endothelial dysfunction'
      ],
      treatment: [
        'Strict metabolic regulation (HbA1c < 7.0%)',
        'Intravitreal anti-VEGF pharmacotherapy (Aflibercept, Ranibizumab)',
        'Panretinal photocoagulation (PRP)',
        'Pars plana vitrectomy for non-clearing vitreous hemorrhage'
      ],
      prevention: [
        'Quarterly HbA1c monitoring',
        'Annual dilated fundus biomicroscopy',
        'Strict blood pressure regulation (<130/80 mmHg)'
      ]
    },
    {
      name: 'Glaucoma',
      icon: AlertCircle,
      description: 'Progressive optic neuropathy characterized by retinal ganglion cell apoptosis and visual field loss.',
      longDescription: 'Glaucoma represents a group of ocular disorders leading to irreversible retinal ganglion cell axon loss. It often correlates with elevated intraocular pressure secondary to trabecular meshwork outflow resistance.',
      symptoms: [
        'Insidious peripheral visual field constriction',
        'Arcuate scotomas and nasal stepping',
        'Tunnel vision in end-stage neuropathy',
        'Severe periorbital pain and nausea in acute angle closure'
      ],
      causes: [
        'Elevated intraocular pressure (>21 mmHg)',
        'Trabecular outflow resistance',
        'Optic nerve head microvascular hypoperfusion',
        'Genetic predisposition (MYOC, OPTN variants)',
        'Thin central corneal thickness (<555 µm)'
      ],
      treatment: [
        'Topical prostaglandin analogues and beta-adrenergic antagonists',
        'Selective laser trabeculoplasty (SLT)',
        'Minimally invasive glaucoma surgery (MIGS)',
        'Trabeculectomy and aqueous shunt implantation'
      ],
      prevention: [
        'Routine baseline tonometry and pachymetry',
        'Peripapillary retinal nerve fiber layer OCT scanning',
        'Automated Humphrey visual field perimetry'
      ]
    },
    {
      name: 'Normal Physiological Fundus',
      icon: Activity,
      description: 'Healthy posterior pole with intact neuroretinal rim, sharp macula, and patent vascular tree.',
      longDescription: 'A physiological fundus demonstrates crisp optic disc margins with a cup-to-disc ratio typically <0.4, distinct foveal light reflex, smooth arteriovenous caliber (A:V ratio ~2:3), and absence of exudation or hemorrhages.',
      symptoms: [
        'Normal 20/20 Snellen visual acuity',
        'Unimpaired visual field parameters',
        'Standard trichromatic color discrimination',
        'Absence of photopsias or metamorphopsia'
      ],
      causes: [
        'Intact blood-retina barrier',
        'Normal intraocular hydrodynamics',
        'Absence of systemic vascular disease'
      ],
      treatment: [
        'No therapeutic intervention indicated',
        'Routine periodic preventive surveillance'
      ],
      prevention: [
        'Annual comprehensive ophthalmic checkups',
        'Adequate UV protection',
        'Balanced systemic cardiovascular health'
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-b border-border pb-6 mb-10">
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Clinical Reference</div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Ophthalmic Pathologies</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Pathological profiles for the 4 retinal categories classified by the deep learning pipeline.
          </p>
        </div>

        <div className="space-y-8">
          {diseases.map((d, i) => {
            const Icon = d.icon
            return (
              <Card key={i} className="p-6 sm:p-8 border border-border bg-card">
                <div className="flex items-start gap-4 pb-6 border-b border-border">
                  <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-muted/40 text-foreground shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">{d.name}</h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d.description}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-5 text-xs">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Pathophysiology</div>
                    <p className="text-muted-foreground leading-relaxed">{d.longDescription}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Clinical Manifestations</div>
                      <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                        {d.symptoms.map((s, sI) => (
                          <li key={sI}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Etiology & Risk Factors</div>
                      <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                        {d.causes.map((c, cI) => (
                          <li key={cI}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Clinical Management</div>
                      <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                        {d.treatment.map((t, tI) => (
                          <li key={tI}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Preventive Surveillance</div>
                      <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                        {d.prevention.map((p, pI) => (
                          <li key={pI}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 rounded border border-border bg-muted/20 p-5 text-xs text-muted-foreground space-y-1">
          <div className="font-mono text-[11px] uppercase tracking-wider text-foreground font-semibold">Diagnostic Disclaimer</div>
          <p className="leading-relaxed">
            This module provides reference academic information. Machine learning classifications must always be corroborated with direct slit-lamp examination, optical coherence tomography (OCT), and certified clinical perimetry.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
