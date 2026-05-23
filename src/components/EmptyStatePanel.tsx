type EmptyStatePanelProps = {
  heading: string
  subtext: string
  ctaLabel: string
  ctaHref: string
}

function OpenBookIcon() {
  return (
    <svg
      className="mx-auto h-16 w-16 text-hero-navy/25"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 12c0-2 2-4 6-4 8 0 12 4 18 4 6 0 10-4 18-4 4 0 6 2 6 4v40c0 2-2 3-6 2-6-2-12-6-18-6S14 52 8 54c-4 1-6 0-6-2V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M56 12c0-2-2-4-6-4-8 0-12 4-18 4-6 0-10-4-18-4-4 0-6 2-6 4v40c0 2 2 3 6 2 6-2 12-6 18-6s12 4 18 6c4 1 6 0 6-2V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M32 8v48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function EmptyStatePanel({
  heading,
  subtext,
  ctaLabel,
  ctaHref,
}: EmptyStatePanelProps) {
  return (
    <div className="col-span-full rounded-2xl border border-input-border bg-form-cream px-6 py-14 text-center sm:px-10 sm:py-16">
      <OpenBookIcon />
      <h3 className="mt-6 font-display text-xl font-bold text-hero-navy sm:text-2xl">
        {heading}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-navy-700/80 sm:text-base">
        {subtext}
      </p>
      <a
        href={ctaHref}
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-brand-hover hover:shadow-md"
      >
        {ctaLabel}
      </a>
    </div>
  )
}
