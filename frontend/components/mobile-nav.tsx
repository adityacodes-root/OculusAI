'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu, RotateCw, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  checkApiHealth,
  type HealthStatus,
} from '@/lib/api-config'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
    modelsLoaded: false,
    url: '',
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const performCheck = useCallback(async () => {
    setIsRefreshing(true)
    const result = await checkApiHealth()
    setHealth(result)
    setIsRefreshing(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      performCheck()
    }
  }, [isOpen, performCheck])

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/analyze', label: 'Retinal Screening' },
    { href: '/colorblindness', label: 'Ishihara Color Test' },
    { href: '/simulator', label: 'Vision Deficiency Simulator' },
    { href: '/acuity', label: 'Visual Acuity Screener' },
    { href: '/diseases', label: 'Ophthalmic Conditions' },
    { href: '/evaluation', label: 'Model Benchmarks' },
    { href: '/about', label: 'System Specifications' },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden text-foreground cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[85vw] max-w-xs p-6 flex flex-col justify-between overflow-y-auto bg-background border-l border-border z-[100]"
      >
        <div className="space-y-6">
          <SheetHeader className="p-0 text-left">
            <SheetTitle asChild>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-foreground text-background">
                  <span className="text-xs font-semibold tracking-tight">AI</span>
                </div>
                <span className="text-sm font-semibold tracking-tight">OculusAI</span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Inference & Model Status Section at Bottom of Mobile Drawer */}
        <div className="pt-6 border-t border-border space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Server className="h-3.5 w-3.5 text-primary" />
              <span>Inference Engine</span>
            </div>
            <button
              type="button"
              onClick={() => performCheck()}
              disabled={isRefreshing}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Refresh status"
            >
              <RotateCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin text-primary')} />
            </button>
          </div>

          <div
            className={cn(
              'rounded-md border p-2.5 flex items-center justify-between',
              health.status === 'online' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200',
              health.status === 'no_models' && 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200',
              health.status === 'offline' && 'border-border bg-muted/40 text-muted-foreground',
              health.status === 'checking' && 'border-border bg-muted/20 text-muted-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  health.status === 'online' && 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
                  health.status === 'no_models' && 'bg-amber-400',
                  health.status === 'offline' && 'bg-zinc-400',
                  health.status === 'checking' && 'bg-amber-400 animate-pulse'
                )}
              />
              <span className="font-medium text-xs">
                {health.status === 'online'
                  ? 'API Online'
                  : health.status === 'no_models'
                  ? 'Models Missing'
                  : health.status === 'offline'
                  ? 'API Offline'
                  : 'Checking...'}
              </span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">
              {health.modelsLoaded ? '2/2 Models' : '0/2 Models'}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono text-muted-foreground bg-card/60 border border-border p-2 rounded">
            <div className="flex items-center justify-between">
              <span>Retina (Keras)</span>
              <span className={cn('text-[10px] px-1 rounded', health.models?.eye_disease ?? health.modelsLoaded ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted')}>
                {health.models?.eye_disease ?? health.modelsLoaded ? 'LOADED' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ishihara (CNN)</span>
              <span className={cn('text-[10px] px-1 rounded', health.models?.ishihara ?? health.modelsLoaded ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted')}>
                {health.models?.ishihara ?? health.modelsLoaded ? 'LOADED' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
