'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, RotateCcw, Check, AlertCircle, Focus, ShieldCheck } from 'lucide-react'

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'

interface AcuityLevel {
  snellen: string
  decimal: number
  logMAR: number
  sizePx: number
}

const ACUITY_LEVELS: AcuityLevel[] = [
  { snellen: '20/200', decimal: 0.10, logMAR: 1.0, sizePx: 140 },
  { snellen: '20/100', decimal: 0.20, logMAR: 0.7, sizePx: 95 },
  { snellen: '20/70',  decimal: 0.28, logMAR: 0.54, sizePx: 70 },
  { snellen: '20/50',  decimal: 0.40, logMAR: 0.4, sizePx: 52 },
  { snellen: '20/40',  decimal: 0.50, logMAR: 0.3, sizePx: 40 },
  { snellen: '20/30',  decimal: 0.67, logMAR: 0.18, sizePx: 30 },
  { snellen: '20/25',  decimal: 0.80, logMAR: 0.1, sizePx: 24 },
  { snellen: '20/20',  decimal: 1.00, logMAR: 0.0, sizePx: 19 },
  { snellen: '20/15',  decimal: 1.33, logMAR: -0.12, sizePx: 14 },
]

const DIRECTIONS: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT']

export default function AcuityPage() {
  const [stage, setStage] = useState<'intro' | 'testing' | 'completed'>('intro')
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [currentDirection, setCurrentDirection] = useState<Direction>('RIGHT')
  const [trialsInLevel, setTrialsInLevel] = useState(0)
  const [correctInLevel, setCorrectInLevel] = useState(0)
  const [bestPassedIndex, setBestPassedIndex] = useState<number | null>(null)
  const [testLog, setTestLog] = useState<Array<{ level: string; passed: boolean }>>([])

  const getRandomDirection = (): Direction => {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
  }

  const startTest = () => {
    setCurrentLevelIndex(0)
    setTrialsInLevel(0)
    setCorrectInLevel(0)
    setBestPassedIndex(null)
    setTestLog([])
    setCurrentDirection(getRandomDirection())
    setStage('testing')
  }

  const handleResponse = useCallback((selectedDir: Direction) => {
    if (stage !== 'testing') return

    const isCorrect = selectedDir === currentDirection
    const nextTrials = trialsInLevel + 1
    const nextCorrect = isCorrect ? correctInLevel + 1 : correctInLevel

    if (nextTrials < 3) {
      setTrialsInLevel(nextTrials)
      setCorrectInLevel(nextCorrect)
      setCurrentDirection(getRandomDirection())
    } else {
      const levelPassed = nextCorrect >= 2
      const currentLevel = ACUITY_LEVELS[currentLevelIndex]

      setTestLog((prev) => [...prev, { level: currentLevel.snellen, passed: levelPassed }])

      if (levelPassed) {
        setBestPassedIndex(currentLevelIndex)
        if (currentLevelIndex + 1 < ACUITY_LEVELS.length) {
          setCurrentLevelIndex(currentLevelIndex + 1)
          setTrialsInLevel(0)
          setCorrectInLevel(0)
          setCurrentDirection(getRandomDirection())
        } else {
          setStage('completed')
        }
      } else {
        setStage('completed')
      }
    }
  }, [stage, currentDirection, trialsInLevel, correctInLevel, currentLevelIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage !== 'testing') return

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        handleResponse('UP')
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        handleResponse('RIGHT')
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        handleResponse('DOWN')
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        handleResponse('LEFT')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stage, handleResponse])

  const getRotationClass = (dir: Direction): string => {
    switch (dir) {
      case 'UP': return '-rotate-90'
      case 'RIGHT': return 'rotate-0'
      case 'DOWN': return 'rotate-90'
      case 'LEFT': return 'rotate-180'
    }
  }

  const finalLevel = bestPassedIndex !== null ? ACUITY_LEVELS[bestPassedIndex] : null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">OculusAI • Optometric Examination</div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Digital Visual Acuity Screener</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Standardized Tumbling E directional resolution testing based on ISO 8596 angular resolution.
            </p>
          </div>
          <div className="text-[11px] font-mono text-muted-foreground mt-3 md:mt-0">
            Distance: 1.0 meter (approx. arm&apos;s length)
          </div>
        </div>

        {stage === 'intro' && (
          <Card className="p-8 border border-border bg-card">
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Test Instructions</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  The Tumbling E optotype will be presented on screen in one of four directions (Up, Right, Down, Left). As you progress, the optotype progressively decreases in physical angular size.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-5 space-y-3 text-xs">
                <div className="font-mono text-[11px] uppercase tracking-wider text-foreground">Calibration & Protocol</div>
                <ul className="space-y-2 text-muted-foreground list-disc pl-4">
                  <li>Position yourself approximately 1 meter (arm&apos;s length + 30cm) from your screen.</li>
                  <li>Cover one eye for monocular testing, or keep both eyes open for binocular screening.</li>
                  <li>Ensure corrective lenses (glasses/contacts) are worn if usually required for screen distance.</li>
                  <li>Use keyboard arrow keys or on-screen directional controls.</li>
                </ul>
              </div>

              <div className="flex justify-center pt-2">
                <Button onClick={startTest} className="h-11 px-8 text-xs font-medium uppercase tracking-wider">
                  Begin Examination
                </Button>
              </div>
            </div>
          </Card>
        )}

        {stage === 'testing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border pb-3">
              <div>
                Target Level: <span className="text-foreground font-semibold">{ACUITY_LEVELS[currentLevelIndex].snellen}</span>
              </div>
              <div>
                Trial {trialsInLevel + 1} of 3
              </div>
              <div>
                Dec: {ACUITY_LEVELS[currentLevelIndex].decimal.toFixed(2)}
              </div>
            </div>

            <Card className="p-12 border border-border bg-card flex flex-col items-center justify-center min-h-[320px]">
              <div
                className={`transition-transform duration-100 flex items-center justify-center select-none font-mono font-bold leading-none ${getRotationClass(currentDirection)}`}
                style={{
                  fontSize: `${ACUITY_LEVELS[currentLevelIndex].sizePx}px`,
                  lineHeight: 1,
                }}
              >
                E
              </div>
            </Card>

            <div className="flex flex-col items-center space-y-3">
              <div className="text-[11px] font-mono text-muted-foreground uppercase">
                Indicate Optotype Opening
              </div>

              <div className="grid grid-cols-3 gap-2 w-48">
                <div />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-full rounded border-border hover:border-foreground"
                  onClick={() => handleResponse('UP')}
                  aria-label="Up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <div />

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-full rounded border-border hover:border-foreground"
                  onClick={() => handleResponse('LEFT')}
                  aria-label="Left"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-full rounded border-border hover:border-foreground"
                  onClick={() => handleResponse('DOWN')}
                  aria-label="Down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-full rounded border-border hover:border-foreground"
                  onClick={() => handleResponse('RIGHT')}
                  aria-label="Right"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-[10px] font-mono text-muted-foreground">
                Shortcut: Arrow Keys or W / A / S / D
              </div>
            </div>
          </div>
        )}

        {stage === 'completed' && (
          <Card className="p-8 border border-border bg-card">
            <div className="max-w-xl mx-auto text-center space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted/40 text-foreground mx-auto">
                <Focus className="h-6 w-6" />
              </div>

              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Acuity Rating</div>
                <div className="text-4xl font-semibold font-mono tracking-tight text-foreground mt-2">
                  {finalLevel ? finalLevel.snellen : '< 20/200'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Decimal Acuity: {finalLevel ? finalLevel.decimal.toFixed(2) : '< 0.10'} • LogMAR: {finalLevel ? finalLevel.logMAR.toFixed(2) : '> 1.0'}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/10 p-5 text-left text-xs space-y-3">
                <div className="font-mono text-[11px] uppercase tracking-wider text-foreground">Diagnostic Assessment</div>
                {finalLevel && finalLevel.decimal >= 1.0 ? (
                  <p className="text-muted-foreground leading-relaxed">
                    Normal visual acuity achieved. The visual system successfully resolved 5 arcminutes optotype targets at standard calibrated viewing distance.
                  </p>
                ) : finalLevel && finalLevel.decimal >= 0.5 ? (
                  <p className="text-muted-foreground leading-relaxed">
                    Mild reduction in distant visual resolution. Meets general driving standard criteria in most jurisdictions, but may benefit from formal refraction testing.
                  </p>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    Reduced visual acuity detected. Comprehensive clinical examination by a registered optometrist or ophthalmologist is advised to evaluate refractive errors or media opacities.
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4 text-left">
                <div className="text-[11px] font-mono uppercase text-muted-foreground mb-2">Level Summary</div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {testLog.map((log, idx) => (
                    <div
                      key={idx}
                      className={`rounded border px-2 py-1.5 text-center text-[10px] font-mono ${
                        log.passed
                          ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                          : 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {log.level} {log.passed ? '✓' : '✗'}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={startTest} variant="outline" className="text-xs font-mono">
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retest Visual Acuity
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
