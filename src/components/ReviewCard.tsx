import type { DisplayReview } from '../types/review'
import { formatReviewDate } from '../utils/formatDate'
import { getReadabilityBadgeClasses } from '../utils/readability'

type ReviewCardProps = {
  review: DisplayReview
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-xl border border-input-border bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 gap-y-2">
        <p className="font-semibold text-hero-navy">{review.reviewerName}</p>
        {review.isFirstReview && (
          <span className="rounded-full bg-amber-brand px-2.5 py-0.5 text-xs font-semibold text-white">
            First Review ⭐
          </span>
        )}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${getReadabilityBadgeClasses(review.readabilityScore)}`}
        >
          {review.readabilityScore.toFixed(1)}
        </span>
      </div>
      <p className="mt-4 leading-relaxed text-hero-navy/90">{review.reviewText}</p>
      <p className="mt-4 text-sm text-navy-700/60">
        {formatReviewDate(review.createdAt)}
      </p>
    </article>
  )
}
