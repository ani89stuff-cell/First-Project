import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchHotBooks } from '../lib/books'
import type { Book } from '../types/book'
import { BookCard } from './BookCard'
import { BookCardSkeleton } from './BookCardSkeleton'

type WhatsHotSectionProps = {
  refreshKey?: number
}

export function WhatsHotSection({ refreshKey = 0 }: WhatsHotSectionProps) {
  const navigate = useNavigate()
  const [books, setBooks] = useState<Book[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadHotBooks() {
      try {
        const results = await fetchHotBooks()
        if (!cancelled) setBooks(results)
      } catch {
        if (!cancelled) setBooks([])
      }
    }

    loadHotBooks()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  if (books !== null && books.length === 0) {
    return null
  }

  return (
    <section className="section-padding scroll-mt-20 border-t border-input-border bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-hero-navy sm:text-3xl lg:text-4xl">
          What&apos;s Hot Right Now 🔥
        </h2>
        <div className="mt-3 flex justify-center sm:justify-start" aria-hidden>
          <div className="h-[3px] w-10 rounded-full bg-amber-brand" />
        </div>
        <p className="mt-2 text-base text-navy-700/80 sm:text-lg">
          Most reviewed books in the last 7 days
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books === null
            ? Array.from({ length: 3 }, (_, index) => (
                <BookCardSkeleton key={index} />
              ))
            : books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => navigate(`/book/${book.id}`)}
                />
              ))}
        </div>
      </div>
    </section>
  )
}
