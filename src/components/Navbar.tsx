import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#overview', label: 'Overview' },
] as const

const linkClass =
  'text-sm font-medium text-hero-navy/80 transition hover:text-amber-brand'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-input-border bg-white/95 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <a
          href="#home"
          className="font-display shrink-0 whitespace-nowrap text-xl font-bold leading-none tracking-tight md:text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-hero-navy">Book</span>
          <span className="text-amber-brand">-O-</span>
          <span className="italic text-hero-navy">Phile</span>
        </a>

        {/* Desktop: inline links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={linkClass}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile: hamburger keeps wordmark on one line */}
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-hero-navy transition hover:bg-hero-navy/5 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      <div
        id="mobile-nav-menu"
        className={`border-t border-input-border bg-white md:hidden ${menuOpen ? 'block' : 'hidden'}`}
      >
        <ul className="flex flex-col px-4 py-3 sm:px-6">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`block rounded-lg px-2 py-3 ${linkClass} hover:bg-hero-navy/5`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
