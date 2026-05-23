import { useCallback, useEffect, useRef, useState } from 'react'
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
import { useScrolledPast } from '../hooks/useScrolledPast'
import { getReadabilityBadgeClasses } from '../utils/readability'

function BookDetailBackLink() {
  return (
    <div className="border-b border-input-border bg-form-cream">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center text-sm font-medium text-hero-navy/80 transition hover:text-amber-brand"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

type StickyBookHeaderProps = {
  book: Book
  visible: boolean
  scrolled: boolean
}

function StickyBookHeader({ book, visible, scrolled }: StickyBookHeaderProps) {
  const hasReviews = book.reviewCount > 0

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-hero-navy text-white transition-all duration-200 ease-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${scrolled ? 'sticky-book-header-scrolled shadow-sm' : ''}`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4 sm:px-6 md:h-14 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-base font-bold leading-tight md:text-lg">
            {book.title}
          </p>
          <p className="truncate text-xs text-white/65 md:text-sm">{book.author}</p>
        </div>
        {hasReviews && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getReadabilityBadgeClasses(book.avgReadabilityScore)}`}
          >
            {book.avgReadabilityScore.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  )
}

function BookDetailPageContent({ id }: { id: string }) {
  const scrolled = useScrolledPast(20)
  const headerRef = useRef<HTMLElement>(null)
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [reviews, setReviews] = useState<DisplayReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)

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

  useEffect(() => {
    const headerEl = headerRef.current
    if (!headerEl || !book) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyVisible(!entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(headerEl)
    return () => observer.disconnect()
  }, [book])

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
            <StickyBookHeader
              book={book}
              visible={stickyVisible}
              scrolled={scrolled}
            />

            <header
              ref={headerRef}
              className="relative w-full overflow-hidden bg-hero-navy text-white"
            >
              <div
                className="hero-pattern pointer-events-none absolute inset-0 opacity-[0.35]"
                aria-hidden
              />
              <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:gap-10 md:text-left lg:gap-14">
                  <div className="flex shrink-0 items-center justify-center md:justify-start">
                    <span
                      className="font-display text-[80px] font-semibold leading-none text-amber-brand md:text-[120px]"
                      aria-hidden
                    >
                      {initial}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl lg:leading-[1.15]">
                      {book.title}
                    </h1>
                    <p className="mt-2 text-lg text-white/65 md:mt-3 md:text-xl">
                      {book.author}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:mt-6 md:justify-start">
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

            <div
              className={`book-detail-body transition-[padding] duration-200 ease-out ${
                stickyVisible ? 'pt-12 md:pt-14' : ''
              } [&_article]:w-full [&_article]:p-4 sm:[&_article]:p-6 [&_button]:min-h-11 [&_button]:min-w-11 [&_fieldset_button]:!h-11 [&_fieldset_button]:!w-11 [&_fieldset_button]:!min-h-11 [&_fieldset_button]:!min-w-11 [&_input]:max-w-none [&_input]:w-full [&_textarea]:w-full`}
            >
              <AddBookReviewForm
                bookId={id}
                onSuccess={handleReviewSuccess}
                onToast={handleToast}
              />

              <BookReviewsList reviews={reviews} loading={reviewsLoading} />
            </div>

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
