import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchBooks } from '../lib/books'
import { GENRES, type Book, type SearchTab } from '../types/book'
import { useDebounce } from '../hooks/useDebounce'
import { BookCard } from './BookCard'

const TABS: { id: SearchTab; label: string }[] = [
  { id: 'book', label: 'By Book Name' },
  { id: 'author', label: 'By Author' },
  { id: 'genre', label: 'By Genre' },
]

const EMPTY_MESSAGE = 'No books found. Be the first to add a review.'

type SearchDiscoverSectionProps = {
  refreshKey?: number
}

export function SearchDiscoverSection({
  refreshKey = 0,
}: SearchDiscoverSectionProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SearchTab>('book')
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)

  const debouncedQuery = useDebounce(query, activeTab === 'genre' ? 0 : 300)

  useEffect(() => {
    let cancelled = false

    async function loadBooks() {
      setLoading(true)
      try {
        const results = await searchBooks(activeTab, debouncedQuery)
        if (!cancelled) {
          setBooks(results)
          setHasSearched(true)
        }
      } catch {
        if (!cancelled) {
          setBooks([])
          setHasSearched(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBooks()
    return () => {
      cancelled = true
    }
  }, [activeTab, debouncedQuery, refreshKey])

  const placeholder =
    activeTab === 'book'
      ? 'Search by book name…'
      : 'Search by author…'

  function handleTabChange(tab: SearchTab) {
    setActiveTab(tab)
    setQuery('')
    setHasSearched(false)
  }

  const showEmptyMessage =
    hasSearched && !loading && books.length === 0

  return (
    <section
      id="overview"
      className="section-padding scroll-mt-20 border-t border-input-border bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-hero-navy sm:text-3xl lg:text-4xl">
          Find your next read.
        </h2>

        <div className="mt-8">
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Search filters"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition duration-200 sm:px-5 ${
                  activeTab === tab.id
                    ? 'bg-hero-navy text-white shadow-sm'
                    : 'border-2 border-hero-navy bg-transparent text-hero-navy hover:bg-hero-navy/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {activeTab === 'genre' ? (
              <>
                <label htmlFor="search-genre" className="form-label">
                  Genre
                </label>
                <select
                  id="search-genre"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select a genre</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label htmlFor="search-books" className="sr-only">
                  Search books
                </label>
                <input
                  id="search-books"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="form-input"
                />
              </>
            )}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="col-span-full py-12 text-center text-navy-700/70">
                Loading books…
              </p>
            ) : showEmptyMessage ? (
              <p className="col-span-full py-12 text-center text-navy-700/70">
                {EMPTY_MESSAGE}
              </p>
            ) : (
              books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => navigate(`/book/${book.id}`)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
