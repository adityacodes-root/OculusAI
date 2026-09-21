'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Sliders, Grid, Split, Info } from 'lucide-react'

type DeficiencyKey = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'cataract' | 'achromatopsia'

interface DeficiencyInfo {
  name: string
  subtitle: string
  coneType: string
  prevalence: string
  description: string
  filterClass: string
  svgFilterId?: string
}

const DEFICIENCIES: Record<DeficiencyKey, DeficiencyInfo> = {
  normal: {
    name: 'Normal Vision',
    subtitle: 'Standard Trichromacy',
    coneType: 'L, M, and S cones fully functional',
    prevalence: 'Typical population baseline',
    description: 'Full chromatic discrimination across the visible light spectrum (380nm to 740nm).',
    filterClass: '',
  },
  protanopia: {
    name: 'Protanopia',
    subtitle: 'Red-Blind / L-Cone Absent',
    coneType: 'Absence of long-wavelength photopigment',
    prevalence: '~1.0% of males, ~0.02% of females',
    description: 'Reds appear dark brown, olive, or gray. Red-green discrimination is severely impaired.',
    filterClass: '',
    svgFilterId: 'protanopia-filter',
  },
  deuteranopia: {
    name: 'Deuteranopia',
    subtitle: 'Green-Blind / M-Cone Absent',
    coneType: 'Absence of medium-wavelength photopigment',
    prevalence: '~1.1% of males, ~0.03% of females',
    description: 'Most common severe color blindness. Greens appear beige, yellowish-brown, or neutral gray.',
    filterClass: '',
    svgFilterId: 'deuteranopia-filter',
  },
  tritanopia: {
    name: 'Tritanopia',
    subtitle: 'Blue-Blind / S-Cone Absent',
    coneType: 'Absence of short-wavelength photopigment',
    prevalence: '< 0.01% of population (autosomal)',
    description: 'Blues appear greenish, and yellows appear violet or light gray. Rarer genetic deficiency.',
    filterClass: '',
    svgFilterId: 'tritanopia-filter',
  },
  cataract: {
    name: 'Cataract Turbidity',
    subtitle: 'Crystalline Lens Sclerosis',
    coneType: 'Optical media opacity, not retinal cone defect',
    prevalence: '>50% of adults aged 80+',
    description: 'Protein denaturing in the lens scatters light, reducing contrast, blurring acuity, and adding an amber tint.',
    filterClass: 'contrast-75 brightness-95 blur-[1.2px] sepia-[0.25]',
  },
  achromatopsia: {
    name: 'Achromatopsia',
    subtitle: 'Total Color Blindness',
    coneType: 'Complete cone dystrophia / rod monochromatic',
    prevalence: '~1 in 30,000 individuals',
    description: 'Total inability to distinguish any hues. Vision is perceived solely in luminance variations.',
    filterClass: 'grayscale',
  },
}

const PRESETS = [
  { id: 'landscape', label: 'Landscape (Default)', url: '/samples/landscape.jpg' },
  { id: 'retina', label: 'Retinal Fundus', url: '/samples/100_left.jpeg' },
  { id: 'ishihara', label: 'Ishihara Plate', url: '/samples/1_LikhanNormaltheme_1 type_1.png' },
]

export default function SimulatorPage() {
  const [activeDeficiency, setActiveDeficiency] = useState<DeficiencyKey>('deuteranopia')
  const [viewMode, setViewMode] = useState<'split' | 'side' | 'grid'>('split')
  const [sliderPosition, setSliderPosition] = useState(50)
  const [currentImage, setCurrentImage] = useState('/samples/landscape.jpg')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sliderContainerRef = useRef<HTMLDivElement>(null)

  const handleCustomUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderContainerRef.current) return
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    setSliderPosition((x / rect.width) * 100)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderContainerRef.current) return
    const touch = e.touches[0]
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width))
    setSliderPosition((x / rect.width) * 100)
  }

  const currentInfo = DEFICIENCIES[activeDeficiency]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <svg className="hidden">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.56667 0.43333 0 0 0
                      0.55833 0.44167 0 0 0
                      0 0.24167 0.75833 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0
                      0.7 0.3 0 0 0
                      0 0.3 0.7 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95 0.05 0 0 0
                      0 0.43333 0.56667 0 0
                      0 0.475 0.525 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">OculusAI • Optometric Emulation</div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Vision Deficiency Simulator</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Inspect chromatic degradation and refractive turbidity in real time across simulated vision profiles.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="inline-flex rounded-md border border-border p-0.5 bg-muted/30">
              <Button
                variant={viewMode === 'split' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs font-mono px-2.5"
                onClick={() => setViewMode('split')}
              >
                <Split className="h-3.5 w-3.5 mr-1" /> Split
              </Button>
              <Button
                variant={viewMode === 'side' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs font-mono px-2.5"
                onClick={() => setViewMode('side')}
              >
                <Sliders className="h-3.5 w-3.5 mr-1" /> Dual
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs font-mono px-2.5"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-3.5 w-3.5 mr-1" /> Matrix
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-mono"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomUpload}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground mr-1">Condition:</span>
          {(Object.keys(DEFICIENCIES) as DeficiencyKey[]).map((key) => {
            const isSelected = activeDeficiency === key
            return (
              <button
                key={key}
                onClick={() => setActiveDeficiency(key)}
                className={`rounded border px-2.5 py-1 text-xs font-mono transition-colors ${
                  isSelected
                    ? 'border-foreground bg-foreground text-background font-medium'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40'
                }`}
              >
                {DEFICIENCIES[key].name}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col items-center">
            {viewMode === 'split' && (
              <div
                ref={sliderContainerRef}
                className="relative w-full max-w-2xl aspect-[4/3] rounded-lg border border-border overflow-hidden select-none bg-muted/20 cursor-ew-resize"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                <img
                  src={currentImage}
                  alt="Original Vision"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />

                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                >
                  <img
                    src={currentImage}
                    alt="Simulated Vision"
                    className={`w-full h-full object-cover ${currentInfo.filterClass}`}
                    style={
                      currentInfo.svgFilterId
                        ? { filter: `url(#${currentInfo.svgFilterId})` }
                        : {}
                    }
                  />
                </div>

                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-lg"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border border-border bg-background flex items-center justify-center shadow-lg">
                    <Split className="h-3.5 w-3.5 text-foreground" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 rounded border border-border/80 bg-background/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-mono">
                  Normal Vision
                </div>
                <div className="absolute bottom-3 right-3 rounded border border-border/80 bg-background/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-mono">
                  {currentInfo.name}
                </div>
              </div>
            )}

            {viewMode === 'side' && (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4 bg-card flex flex-col items-center">
                  <div className="w-full text-xs font-mono text-muted-foreground pb-2 border-b border-border mb-3 flex items-center justify-between">
                    <span>Reference</span>
                    <span>Normal Vision</span>
                  </div>
                  <div className="w-full aspect-[4/3] relative flex items-center justify-center rounded overflow-hidden">
                    <img
                      src={currentImage}
                      alt="Normal vision"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4 bg-card flex flex-col items-center">
                  <div className="w-full text-xs font-mono text-muted-foreground pb-2 border-b border-border mb-3 flex items-center justify-between">
                    <span>Simulated</span>
                    <span className="font-medium text-foreground">{currentInfo.name}</span>
                  </div>
                  <div className="w-full aspect-[4/3] relative flex items-center justify-center rounded overflow-hidden">
                    <img
                      src={currentImage}
                      alt={currentInfo.name}
                      className={`w-full h-full object-cover ${currentInfo.filterClass}`}
                      style={
                        currentInfo.svgFilterId
                          ? { filter: `url(#${currentInfo.svgFilterId})` }
                          : {}
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(DEFICIENCIES) as DeficiencyKey[]).map((key) => {
                  const info = DEFICIENCIES[key]
                  return (
                    <div key={key} className="rounded-lg border border-border p-3 bg-card flex flex-col">
                      <div className="text-[11px] font-mono text-foreground font-medium pb-1.5 border-b border-border mb-2">
                        {info.name}
                      </div>
                      <div className="aspect-[4/3] relative w-full flex items-center justify-center bg-muted/10 rounded overflow-hidden">
                        <img
                          src={currentImage}
                          alt={info.name}
                          className={`w-full h-full object-cover ${info.filterClass}`}
                          style={
                            info.svgFilterId
                              ? { filter: `url(#${info.svgFilterId})` }
                              : {}
                          }
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <span>Preset:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentImage(p.url)}
                  className={`underline hover:text-foreground ${currentImage === p.url ? 'text-foreground font-semibold' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Card className="p-6 border border-border bg-card">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Clinical Profile</div>
              <h2 className="text-xl font-semibold tracking-tight mt-1">{currentInfo.name}</h2>
              <div className="text-xs text-muted-foreground mt-0.5">{currentInfo.subtitle}</div>

              <div className="mt-6 space-y-4 text-xs">
                <div className="border-t border-border pt-3">
                  <div className="font-mono text-muted-foreground uppercase text-[10px]">Receptor Mechanism</div>
                  <div className="text-foreground font-medium mt-0.5">{currentInfo.coneType}</div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="font-mono text-muted-foreground uppercase text-[10px]">Prevalence</div>
                  <div className="text-foreground font-medium mt-0.5">{currentInfo.prevalence}</div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="font-mono text-muted-foreground uppercase text-[10px]">Functional Manifestation</div>
                  <p className="text-muted-foreground mt-1 leading-relaxed">{currentInfo.description}</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 border border-border bg-muted/20 text-xs">
              <div className="font-mono text-[11px] uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-2">
                <Info className="h-3.5 w-3.5" /> Spectral Model
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Color matrix filtering calculates normalized linear RGB cone absorptions based on Machado et al. physiological spectral response approximations.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
