import { useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useAuth } from '../hooks/useAuth'
import { insertBookReview } from '../lib/reviews'
import type { Review } from '../types/review'
import { getUserDisplayName } from '../utils/userDisplayName'
import {
  hasBookDetailValidationErrors,
  validateBookDetailReviewForm,
  type BookDetailReviewFormErrors,
} from '../utils/validation'
import { ReadabilityScoreSelector } from './ReadabilityScoreSelector'

type AddBookReviewFormProps = {
  bookId: string
  onSuccess: (review: Review) => void
  onToast: (message: string) => void
}

const emptyForm = {
  review: '',
  readabilityScore: null as number | null,
  reviewerName: '',
}

function defaultReviewerNameForUser(user: User | null): string {
  if (!user) return ''
  return getUserDisplayName(user.user_metadata, user.email)
}

export function AddBookReviewForm({
  bookId,
  onSuccess,
  onToast,
}: AddBookReviewFormProps) {
  const { user, loading: authLoading } = useAuth()
  const [review, setReview] = useState(emptyForm.review)
  const [readabilityScore, setReadabilityScore] = useState<number | null>(
    emptyForm.readabilityScore,
  )
  const [reviewerName, setReviewerName] = useState(emptyForm.reviewerName)
  const [errors, setErrors] = useState<BookDetailReviewFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const prefilledUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (user && prefilledUserIdRef.current !== user.id) {
      prefilledUserIdRef.current = user.id
      setReviewerName(defaultReviewerNameForUser(user))
      return
    }

    if (!user) {
      prefilledUserIdRef.current = null
    }
  }, [user, authLoading])

  function clearForm() {
    setReview(emptyForm.review)
    setReadabilityScore(emptyForm.readabilityScore)
    setReviewerName(defaultReviewerNameForUser(user))
    setErrors({})
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const validationErrors = validateBookDetailReviewForm({
      review,
      readabilityScore,
      reviewerName,
    })

    setErrors(validationErrors)
    if (hasBookDetailValidationErrors(validationErrors)) return

    setSubmitting(true)
    try {
      const newReview = await insertBookReview(bookId, {
        reviewerName,
        reviewText: review,
        readabilityScore: readabilityScore as number,
        userId: user?.id ?? null,
      })
      onSuccess(newReview)
      clearForm()
      onToast('Review posted!')
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to post review.'
      onToast(message)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldError = (name: keyof BookDetailReviewFormErrors) =>
    errors[name] ? (
      <p className="mt-1.5 text-sm text-red-600">{errors[name]}</p>
    ) : null

  return (
    <section className="border-t border-input-border bg-form-cream py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-hero-navy sm:text-3xl">
          Add Your Review
        </h2>

        <form onSubmit={handleSubmit} className="form-card" noValidate>
          <div className="grid gap-5">
            <div>
              <label htmlFor="book-detail-review" className="form-label">
                Your Review
              </label>
              <textarea
                id="book-detail-review"
                rows={4}
                value={review}
                onChange={(e) => {
                  setReview(e.target.value)
                  setErrors((prev) => ({ ...prev, review: undefined }))
                }}
                placeholder="What did you think? Be honest."
                className="form-input resize-y"
                aria-invalid={Boolean(errors.review)}
              />
              {fieldError('review')}
            </div>

            <div>
              <ReadabilityScoreSelector
                value={readabilityScore}
                onChange={(score) => {
                  setReadabilityScore(score)
                  setErrors((prev) => ({
                    ...prev,
                    readabilityScore: undefined,
                  }))
                }}
                error={errors.readabilityScore}
              />
            </div>

            <div>
              <label htmlFor="book-detail-reviewer-name" className="form-label">
                Your Name
              </label>
              <input
                id="book-detail-reviewer-name"
                type="text"
                value={reviewerName}
                onChange={(e) => {
                  setReviewerName(e.target.value)
                  setErrors((prev) => ({ ...prev, reviewerName: undefined }))
                }}
                className="form-input sm:max-w-md"
                aria-invalid={Boolean(errors.reviewerName)}
              />
              {fieldError('reviewerName')}
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-amber-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-brand-hover hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-hero-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? 'Posting…' : 'Post Review'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
