import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
] as const

const linkClass =
  'text-sm font-medium text-hero-navy/80 transition hover:text-amber-brand'

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function getFirstName(
  metadata: Record<string, unknown> | undefined,
  email: string | undefined,
): string {
  const fullName = metadata?.full_name
  if (typeof fullName === 'string' && fullName.trim()) {
    return fullName.trim().split(/\s+/)[0]
  }
  const givenName = metadata?.given_name
  if (typeof givenName === 'string' && givenName.trim()) {
    return givenName.trim()
  }
  if (email) return email.split('@')[0]
  return 'Reader'
}

function getAvatarUrl(metadata: Record<string, unknown> | undefined): string | null {
  const avatar = metadata?.avatar_url ?? metadata?.picture
  return typeof avatar === 'string' && avatar ? avatar : null
}

function NavbarAuth() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  if (loading) {
    return <div className="h-9 w-20 shrink-0" aria-hidden />
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => signInWithGoogle()}
        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border-2 border-hero-navy px-3 py-1.5 text-sm font-medium text-hero-navy transition hover:bg-hero-navy/5"
      >
        <GoogleIcon />
        Sign In
      </button>
    )
  }

  const firstName = getFirstName(user.user_metadata, user.email)
  const avatarUrl = getAvatarUrl(user.user_metadata)

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setDropdownOpen((open) => !open)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-hero-navy/5"
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full object-cover ring-1 ring-input-border"
            width={32}
            height={32}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hero-navy/10 text-sm font-semibold text-hero-navy">
            {firstName.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="max-w-[6rem] truncate text-sm font-medium text-hero-navy sm:max-w-[8rem]">
          {firstName}
        </span>
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[11rem] overflow-hidden rounded-lg border border-input-border bg-white py-1 shadow-lg"
        >
          <a
            href="#"
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-hero-navy transition hover:bg-hero-navy/5"
            onClick={() => setDropdownOpen(false)}
          >
            My Activities
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setDropdownOpen(false)
              await signOut()
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-hero-navy transition hover:bg-hero-navy/5"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

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
        className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-2 px-4 py-4 sm:gap-3 sm:px-6 lg:px-8"
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={linkClass}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <NavbarAuth />

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
        </div>
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
