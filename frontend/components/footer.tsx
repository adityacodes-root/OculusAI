import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/50 py-10 px-4">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-5 w-5 items-center justify-center rounded border border-border bg-foreground text-background text-[10px] font-semibold">
            AI
          </div>
          <span className="text-xs font-mono text-muted-foreground tracking-tight">OculusAI</span>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
          <Link href="/analyze" className="hover:text-foreground transition-colors">Retina</Link>
          <Link href="/colorblindness" className="hover:text-foreground transition-colors">Color Vision</Link>
          <Link href="/simulator" className="hover:text-foreground transition-colors">Simulator</Link>
          <Link href="/acuity" className="hover:text-foreground transition-colors">Acuity</Link>
          <Link href="/diseases" className="hover:text-foreground transition-colors">Pathologies</Link>
          <Link href="/evaluation" className="hover:text-foreground transition-colors">Architecture</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">Specifications</Link>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground">
          v2.4
        </div>
      </div>
    </footer>
  )
}
