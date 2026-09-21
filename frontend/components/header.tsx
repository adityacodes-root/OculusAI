'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNav } from '@/components/mobile-nav'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  checkApiHealth,
  type HealthStatus,
} from '@/lib/api-config'
import {
  CheckCircle2,
  AlertCircle,
  WifiOff,
  RotateCw,
  ChevronDown,
  Server,
  Cpu,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
    modelsLoaded: false,
    url: '',
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const performCheck = useCallback(async () => {
    setIsRefreshing(true)
    const result = await checkApiHealth()
    setHealth(result)
    setIsRefreshing(false)
  }, [])

  useEffect(() => {
    performCheck()
    const interval = setInterval(() => {
      performCheck()
    }, 20000)

    return () => {
      clearInterval(interval)
    }
  }, [performCheck])

  const navItems = [
    { href: '/analyze', label: 'Retina' },
    { href: '/colorblindness', label: 'Color Vision' },
    { href: '/simulator', label: 'Simulator' },
    { href: '/acuity', label: 'Acuity' },
    { href: '/diseases', label: 'Pathology' },
    { href: '/evaluation', label: 'Models' },
    { href: '/about', label: 'Overview' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-foreground text-background">
              <span className="text-xs font-semibold tracking-tight">AI</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight">OculusAI</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Read-only API & Model Status Popover */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-border px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-mono text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/50 hover:text-foreground cursor-pointer"
                title="Click to view AI models & server status"
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors',
                    health.status === 'online' && 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]',
                    health.status === 'no_models' && 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]',
                    health.status === 'offline' && 'bg-zinc-400',
                    health.status === 'checking' && 'bg-amber-400 animate-pulse'
                  )}
                />
                <span>
                  {health.status === 'online'
                    ? 'API Online'
                    : health.status === 'no_models'
                    ? 'No Models'
                    : health.status === 'offline'
                    ? 'API Offline'
                    : 'Checking API...'}
                </span>
                <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-4 text-xs font-sans shadow-xl border-border bg-background">
              <div className="space-y-3.5">
                {/* Header with Recheck Button */}
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <div className="flex items-center gap-2 font-medium">
                    <Server className="h-4 w-4 text-primary" />
                    <span>Inference Server Status</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => performCheck()}
                    disabled={isRefreshing}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
                    title="Refresh status now"
                  >
                    <RotateCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin text-primary')} />
                  </button>
                </div>

                {/* Status Overview Card */}
                <div
                  className={cn(
                    'rounded-lg border p-3 flex items-start gap-2.5',
                    health.status === 'online' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200',
                    health.status === 'no_models' && 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200',
                    health.status === 'offline' && 'border-border bg-muted/40 text-muted-foreground',
                    health.status === 'checking' && 'border-border bg-muted/20 text-muted-foreground'
                  )}
                >
                  {health.status === 'online' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : health.status === 'no_models' ? (
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-medium leading-none">
                      {health.status === 'online'
                        ? 'Backend Connected'
                        : health.status === 'no_models'
                        ? 'Server Online (Models Missing)'
                        : health.status === 'offline'
                        ? 'Backend Offline'
                        : 'Checking connection...'}
                    </p>
                    <p className="text-[11px] opacity-85 leading-tight">
                      {health.status === 'online'
                        ? 'All neural models are loaded and ready for automated screening.'
                        : health.status === 'no_models'
                        ? 'Backend responded, but neural network weights are not initialized.'
                        : 'Inference backend is currently offline or not deployed.'}
                    </p>
                  </div>
                </div>

                {/* Neural Models Load Status */}
                <div className="rounded-lg border border-border bg-card/60 p-2.5 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground font-sans">
                    <Cpu className="h-3 w-3" />
                    <span>Neural Models Status</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs">Retinal Pathology (Keras)</span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-mono',
                        health.models?.eye_disease ?? health.modelsLoaded
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {health.models?.eye_disease ?? health.modelsLoaded ? 'LOADED' : 'OFFLINE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs">Ishihara Digit Classifier</span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-mono',
                        health.models?.ishihara ?? health.modelsLoaded
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {health.models?.ishihara ?? health.modelsLoaded ? 'LOADED' : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                {/* Status Footer info */}
                <div className="pt-1 text-[10px] text-muted-foreground/80 leading-normal border-t border-border">
                  {health.status === 'online'
                    ? 'Screening models are verified and active on the deployed backend.'
                    : 'When the backend is deployed with models, this indicator updates automatically.'}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
