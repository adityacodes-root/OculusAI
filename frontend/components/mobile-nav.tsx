"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="md:hidden hover:bg-transparent active:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent dark:focus:bg-transparent"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] animate-fade-in md:hidden"
            onClick={closeMenu}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', pointerEvents: 'auto' }}
          />

          {/* Menu Panel */}
          <div 
            className="fixed right-0 top-0 bottom-0 w-80 shadow-xl z-[101] flex flex-col animate-slide-in-right md:hidden" 
            style={{ backgroundColor: 'var(--background)', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Menu</h2>
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Links */}
            <div className="flex-1 p-6 space-y-2" style={{ backgroundColor: 'var(--background)' }}>
              <Link href="/" onClick={closeMenu} className="block px-4 py-3 text-base font-medium rounded-lg transition-opacity" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}>
                Home
              </Link>
              <Link href="/analyze" onClick={closeMenu} className="block px-4 py-3 text-base font-medium rounded-lg transition-opacity" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}>
                Retinal Test
              </Link>
              <Link href="/colorblindness" onClick={closeMenu} className="block px-4 py-3 text-base font-medium rounded-lg transition-opacity" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}>
                Colour Blindness Test
              </Link>
              <Link href="/diseases" onClick={closeMenu} className="block px-4 py-3 text-base font-medium rounded-lg transition-opacity" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}>
                Diseases
              </Link>
              <Link href="/evaluation" onClick={closeMenu} className="block px-4 py-3 text-base font-medium rounded-lg transition-opacity" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}>
                Model
              </Link>
              <Link href="/about" onClick={closeMenu} className="block px-4 py-3 text-base font-medium rounded-lg transition-opacity" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}>
                About
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
