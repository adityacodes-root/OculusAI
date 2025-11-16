'use client'

import { Eye } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <Eye className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">OculusAI</h1>
              <p className="text-xs text-muted-foreground">Precision Eye Disease Detection</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">AI-Powered Analysis</p>
          </div>
        </div>
      </div>
    </header>
  )
}
