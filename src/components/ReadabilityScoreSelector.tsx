type ReadabilityScoreSelectorProps = {
  value: number
  onChange: (score: number) => void
}

export function ReadabilityScoreSelector({
  value,
  onChange,
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
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ease-out ${
                selected
                  ? 'border-2 border-amber-brand bg-amber-brand text-white shadow-sm'
                  : 'border-2 border-hero-navy bg-white text-hero-navy hover:border-amber-brand hover:text-amber-brand'
              }`}
            >
              {score}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
