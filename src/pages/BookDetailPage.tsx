import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AddBookReviewForm } from '../components/AddBookReviewForm'
import { BookReviewsList } from '../components/BookReviewsList'
import { Toast } from '../components/Toast'
import { fetchBookById } from '../lib/books'
import {
  addReviewToDisplayList,
  fetchReviewsByBookId,
} from '../lib/reviews'
import type { Book } from '../types/book'
import type { DisplayReview, Review } from '../types/review'
import { getReadabilityBadgeClasses } from '../utils/readability'

function BookDetailBackLink() {
  return (
    <div className="border-b border-input-border bg-form-cream">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-sm font-medium text-hero-navy/80 transition hover:text-amber-brand"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

function BookDetailPageContent({ id }: { id: string }) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [reviews, setReviews] = useState<DisplayReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const handleToast = useCallback((message: string) => {
    setToastMessage(message)
    setToastVisible(true)
  }, [])

  const handleDismissToast = useCallback(() => {
    setToastVisible(false)
  }, [])

  const handleReviewSuccess = useCallback(
    async (newReview: Review) => {
      setReviews((prev) => addReviewToDisplayList(prev, newReview))
      setReviewsLoading(false)

      try {
        const updatedBook = await fetchBookById(id)
        if (updatedBook) setBook(updatedBook)
      } catch {
        // Header stats refresh failed silently; list still updated
      }
    },
    [id],
  )

  useEffect(() => {
    let cancelled = false

    async function loadBook() {
      setLoading(true)
      try {
        const result = await fetchBookById(id)
        if (cancelled) return
        if (!result) {
          setBook(null)
          setNotFound(true)
        } else {
          setBook(result)
          setNotFound(false)
        }
      } catch {
        if (!cancelled) {
          setBook(null)
          setNotFound(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBook()
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    let cancelled = false

    async function loadReviews() {
      setReviewsLoading(true)
      try {
        const data = await fetchReviewsByBookId(id)
        if (!cancelled) setReviews(data)
      } catch {
        if (!cancelled) setReviews([])
      } finally {
        if (!cancelled) setReviewsLoading(false)
      }
    }

    loadReviews()
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!toastVisible) return
    const timer = window.setTimeout(() => setToastVisible(false), 4000)
    return () => window.clearTimeout(timer)
  }, [toastVisible])

  const initial = book?.title.charAt(0).toUpperCase() ?? ''
  const hasReviews = book ? book.reviewCount > 0 : false

  return (
    <div className="min-h-screen bg-form-cream">
      <BookDetailBackLink />

      {loading ? (
        <div className="w-full bg-hero-navy py-20 text-center text-white/70">
          Loading…
        </div>
      ) : notFound ? (
        <div className="w-full bg-hero-navy py-20 text-center">
          <p className="font-display text-2xl font-bold text-white">
            Book not found
          </p>
        </div>
      ) : (
        book && (
          <>
            <header className="relative w-full overflow-hidden bg-hero-navy text-white">
              <div
                className="hero-pattern pointer-events-none absolute inset-0 opacity-[0.35]"
                aria-hidden
              />
              <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10 lg:gap-14">
                  <div className="flex shrink-0 items-center justify-center sm:justify-start">
                    <span
                      className="font-display font-semibold leading-none text-amber-brand"
                      style={{ fontSize: '120px' }}
                      aria-hidden
                    >
                      {initial}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                      {book.title}
                    </h1>
                    <p className="mt-2 text-lg text-white/65 sm:mt-3 sm:text-xl">
                      {book.author}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
                      <span className="rounded-full border-2 border-amber-brand px-3 py-1 text-sm font-medium text-amber-brand">
                        {book.genre}
                      </span>
                      {hasReviews && (
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${getReadabilityBadgeClasses(book.avgReadabilityScore)}`}
                        >
                          {book.avgReadabilityScore.toFixed(1)}
                        </span>
                      )}
                      <span className="text-sm text-white/55">
                        {book.reviewCount}{' '}
                        {book.reviewCount === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <AddBookReviewForm
              bookId={id}
              onSuccess={handleReviewSuccess}
              onToast={handleToast}
            />

            <BookReviewsList reviews={reviews} loading={reviewsLoading} />

            <Toast
              message={toastMessage}
              visible={toastVisible}
              onDismiss={handleDismissToast}
            />
          </>
        )
      )}
    </div>
  )
}

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <div className="min-h-screen bg-form-cream">
        <BookDetailBackLink />
        <div className="w-full bg-hero-navy py-20 text-center">
          <p className="font-display text-2xl font-bold text-white">
            Book not found
          </p>
        </div>
      </div>
    )
  }

  return <BookDetailPageContent id={id} />
}
