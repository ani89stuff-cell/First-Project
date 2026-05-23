import { useState } from 'react'
import { Link } from 'react-router-dom'
import { updateReview } from '../lib/reviews'
import type { UserReviewWithBook } from '../types/review'
import { formatReviewDate } from '../utils/formatDate'
import { getReadabilityBadgeClasses } from '../utils/readability'
import {
  hasReviewEditValidationErrors,
  validateReviewEditForm,
  type ReviewEditFormErrors,
} from '../utils/validation'
import { ReadabilityScoreSelector } from './ReadabilityScoreSelector'

type MyActivityReviewCardProps = {
  review: UserReviewWithBook
  userId: string
  onUpdated: (review: UserReviewWithBook) => void
  onToast: (message: string) => void
}

export function MyActivityReviewCard({
  review,
  userId,
  onUpdated,
  onToast,
}: MyActivityReviewCardProps) {
  const [editing, setEditing] = useState(false)
  const [reviewText, setReviewText] = useState(review.reviewText)
  const [readabilityScore, setReadabilityScore] = useState<number | null>(
    review.readabilityScore,
  )
  const [errors, setErrors] = useState<ReviewEditFormErrors>({})
  const [saving, setSaving] = useState(false)

  function startEdit() {
    setReviewText(review.reviewText)
    setReadabilityScore(review.readabilityScore)
    setErrors({})
    setEditing(true)
  }

  function cancelEdit() {
    setReviewText(review.reviewText)
    setReadabilityScore(review.readabilityScore)
    setErrors({})
    setEditing(false)
  }

  async function handleSave() {
    const validationErrors = validateReviewEditForm({
      review: reviewText,
      readabilityScore,
    })
    setErrors(validationErrors)
    if (hasReviewEditValidationErrors(validationErrors)) return

    setSaving(true)
    try {
      const updated = await updateReview(review.id, userId, {
        reviewText,
        readabilityScore: readabilityScore as number,
      })
      onUpdated({
        ...review,
        reviewText: updated.reviewText,
        readabilityScore: updated.readabilityScore,
      })
      setEditing(false)
      onToast('Review updated!')
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to update review.'
      onToast(message)
    } finally {
      setSaving(false)
    }
  }

  const fieldError = (name: keyof ReviewEditFormErrors) =>
    errors[name] ? (
      <p className="mt-1.5 text-sm text-red-600">{errors[name]}</p>
    ) : null

  return (
    <article className="rounded-xl border border-input-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            to={`/book/${review.bookId}`}
            className="font-display text-lg font-bold text-hero-navy transition hover:text-amber-brand sm:text-xl"
          >
            {review.bookTitle}
          </Link>
          <p className="mt-0.5 text-sm text-navy-700/70">{review.bookAuthor}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${getReadabilityBadgeClasses(
            editing ? (readabilityScore ?? review.readabilityScore) : review.readabilityScore,
          )}`}
        >
          {(editing ? (readabilityScore ?? review.readabilityScore) : review.readabilityScore).toFixed(1)}
        </span>
      </div>

      {editing ? (
        <div className="mt-5 space-y-5 border-t border-input-border pt-5">
          <div>
            <label htmlFor={`edit-review-${review.id}`} className="form-label">
              Your Review
            </label>
            <textarea
              id={`edit-review-${review.id}`}
              rows={4}
              value={reviewText}
              onChange={(e) => {
                setReviewText(e.target.value)
                setErrors((prev) => ({ ...prev, review: undefined }))
              }}
              className="form-input resize-y"
              aria-invalid={Boolean(errors.review)}
            />
            {fieldError('review')}
          </div>

          <ReadabilityScoreSelector
            value={readabilityScore}
            onChange={(score) => {
              setReadabilityScore(score)
              setErrors((prev) => ({ ...prev, readabilityScore: undefined }))
            }}
            error={errors.readabilityScore}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-amber-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="rounded-lg border border-input-border bg-white px-5 py-2.5 text-sm font-semibold text-hero-navy transition hover:bg-hero-navy/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-4 leading-relaxed text-hero-navy/90">{review.reviewText}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-navy-700/60">
              {formatReviewDate(review.createdAt)}
            </p>
            <button
              type="button"
              onClick={startEdit}
              className="rounded-lg border-2 border-amber-brand px-3 py-1.5 text-xs font-semibold text-amber-brand transition hover:bg-amber-brand/10"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </article>
  )
}
