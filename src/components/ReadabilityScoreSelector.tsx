type ReadabilityScoreSelectorProps = {
  value: number | null
  onChange: (score: number) => void
  error?: string
}

export function ReadabilityScoreSelector({
  value,
  onChange,
  error,
}: ReadabilityScoreSelectorProps) {
  return (
    <fieldset>
      <legend className="form-label">Your Readability Score</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => {
          const selected = value === score
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              aria-pressed={selected}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-150 ease ${
                selected
                  ? 'scale-[1.15] border-amber-brand bg-amber-brand text-white shadow-sm score-selected-pulse'
                  : 'scale-100 border-hero-navy bg-white text-hero-navy hover:scale-110 hover:border-amber-brand hover:text-amber-brand'
              }`}
            >
              {score}
            </button>
          )
        })}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </fieldset>
  )
}
