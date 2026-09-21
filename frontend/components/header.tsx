'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNav } from '@/components/mobile-nav'

export function Header() {
  const pathname = usePathname()

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
          <div className="hidden items-center gap-2 rounded-full border border-border px-2.5 py-1 text-[11px] font-mono text-muted-foreground lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>API Online :5000</span>
          </div>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
