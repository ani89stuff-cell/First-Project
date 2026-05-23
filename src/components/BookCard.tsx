import type { Book } from '../types/book'
import { getReadabilityBadgeClasses } from '../utils/readability'

type BookCardProps = {
  book: Book
  onClick: () => void
}

export function BookCard({ book, onClick }: BookCardProps) {
  const initial = book.title.charAt(0).toUpperCase()
  const hasReviews = book.reviewCount > 0

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-input-border bg-white text-left shadow-md transition-[transform,box-shadow] duration-[250ms] ease hover:-translate-y-1.5 hover:border-amber-brand/40 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-hero-navy/30"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-hero-navy">
        <span className="font-display text-6xl font-semibold text-amber-brand transition duration-200 group-hover:scale-105 sm:text-7xl">
          {initial}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-hero-navy line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-0.5 text-sm text-navy-700/80">{book.author}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-hero-navy/8 px-2.5 py-0.5 text-xs font-medium text-hero-navy">
            {book.genre}
          </span>
          {hasReviews && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 transition duration-[250ms] ease group-hover:brightness-110 ${getReadabilityBadgeClasses(book.avgReadabilityScore)}`}
            >
              {book.avgReadabilityScore.toFixed(1)}
            </span>
          )}
          <span className="text-xs text-navy-700/60">
            {book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>
    </button>
  )
}
