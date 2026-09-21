'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

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
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 md:hidden text-foreground"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="fixed right-0 top-0 bottom-0 z-50 w-72 border-l border-border bg-background p-6 shadow-2xl md:hidden flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded border border-border bg-foreground text-background text-xs font-semibold">
                    AI
                  </div>
                  <span className="text-sm font-semibold tracking-tight">OculusAI</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 flex flex-col space-y-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col gap-2 text-[11px] font-mono text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
