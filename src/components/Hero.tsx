export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-[400px] w-full items-center overflow-hidden bg-hero-navy py-20 text-white"
    >
      <div
        className="hero-dot-grid pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div
        className="hero-pattern pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
          Your next favourite book is one{' '}
          <span className="text-amber-brand">honest</span> review away.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/55 sm:mt-5 sm:text-lg">
          Honest reviews from real readers. Nothing else.
        </p>
      </div>
    </section>
  )
}
