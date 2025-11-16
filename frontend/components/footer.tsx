export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">OculusAI</h3>
            <p className="text-sm text-muted-foreground">Advancing eye disease detection with AI</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <p className="text-xs text-muted-foreground text-center">
            © 2025 OculusAI. All rights reserved. For medical use only.
          </p>
        </div>
      </div>
    </footer>
  )
}
