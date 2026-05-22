import { useEffect, useState } from 'react'
import { fetchReviewsByBookId } from '../lib/reviews'
import type { DisplayReview } from '../types/review'
import { ReviewCard } from './ReviewCard'

type BookReviewsListProps = {
  bookId: string
}

export function BookReviewsList({ bookId }: BookReviewsListProps) {
  const [reviews, setReviews] = useState<DisplayReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadReviews() {
      setLoading(true)
      try {
        const data = await fetchReviewsByBookId(bookId)
        if (!cancelled) setReviews(data)
      } catch {
        if (!cancelled) setReviews([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadReviews()
    return () => {
      cancelled = true
    }
  }, [bookId])

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
