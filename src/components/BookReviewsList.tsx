import type { DisplayReview } from '../types/review'
import { ReviewCard } from './ReviewCard'

type BookReviewsListProps = {
  reviews: DisplayReview[]
  loading: boolean
}

export function BookReviewsList({ reviews, loading }: BookReviewsListProps) {
  return (
    <section className="border-t border-input-border bg-form-cream py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-hero-navy sm:text-3xl">
          Reviews
        </h2>

        {loading ? (
          <p className="mt-8 text-center text-navy-700/70">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="mt-8 text-center text-navy-700/70">
            No reviews yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="mt-8">
            {reviews.map((review, index) => (
              <div key={review.id}>
                <ReviewCard review={review} />
                {index < reviews.length - 1 && (
                  <div
                    className="my-6 border-t border-input-border"
                    role="separator"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
