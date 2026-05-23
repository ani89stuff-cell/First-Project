import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { EmptyStatePanel } from '../components/EmptyStatePanel'
import { MyActivityReviewCard } from '../components/MyActivityReviewCard'
import { Navbar } from '../components/Navbar'
import { Toast } from '../components/Toast'
import { useAuth } from '../hooks/useAuth'
import { fetchReviewsByUserId } from '../lib/reviews'
import type { UserReviewWithBook } from '../types/review'

export function MyActivitiesPage() {
  const { user, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<UserReviewWithBook[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const handleToast = useCallback((message: string) => {
    setToastMessage(message)
    setToastVisible(true)
  }, [])

  const handleDismissToast = useCallback(() => {
    setToastVisible(false)
  }, [])

  useEffect(() => {
    if (!toastVisible) return
    const timer = window.setTimeout(() => setToastVisible(false), 4000)
    return () => window.clearTimeout(timer)
  }, [toastVisible])

  useEffect(() => {
    if (authLoading || !user) return

    let cancelled = false
    setLoading(true)
    setLoadError(false)

    fetchReviewsByUserId(user.id)
      .then((data) => {
        if (!cancelled) setReviews(data)
      })
      .catch(() => {
        if (!cancelled) {
          setReviews([])
          setLoadError(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  function handleReviewUpdated(updated: UserReviewWithBook) {
    setReviews((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-form-cream">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center text-navy-700/70 sm:px-6 lg:px-8">
          Loading…
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-form-cream">
      <Navbar />

      <div className="border-b border-input-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center text-sm font-medium text-hero-navy/80 transition hover:text-amber-brand"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <header className="mb-8 sm:mb-10">
          <h1 className="font-display text-3xl font-bold text-hero-navy sm:text-4xl">
            My Activities
          </h1>
          <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
            Reviews you&apos;ve shared with the community
          </p>
        </header>

        {loading ? (
          <p className="text-center text-navy-700/70">Loading your reviews…</p>
        ) : loadError ? (
          <p className="text-center text-red-600">
            Could not load your reviews. Please try again later.
          </p>
        ) : reviews.length === 0 ? (
          <EmptyStatePanel
            heading="No reviews yet"
            subtext="You haven't posted any reviews yet. Start exploring books!"
            ctaLabel="Add a Review"
            ctaHref="/#home"
          />
        ) : (
          <ul className="flex flex-col gap-5 sm:gap-6">
            {reviews.map((review) => (
              <li key={review.id}>
                <MyActivityReviewCard
                  review={review}
                  userId={user.id}
                  onUpdated={handleReviewUpdated}
                  onToast={handleToast}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onDismiss={handleDismissToast}
      />
    </div>
  )
}
