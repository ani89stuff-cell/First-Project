const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#overview', label: 'Overview' },
] as const

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-input-border bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-baseline gap-0.5">
          <span className="font-display text-2xl font-bold tracking-tight text-hero-navy sm:text-[1.65rem]">
            Book
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-amber-brand sm:text-[1.65rem]">
            -O-
          </span>
          <span className="font-display text-2xl font-bold italic tracking-tight text-hero-navy sm:text-[1.65rem]">
            Phile
          </span>
        </a>

        <ul className="flex items-center gap-6 sm:gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm font-medium text-hero-navy/80 transition hover:text-amber-brand"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
