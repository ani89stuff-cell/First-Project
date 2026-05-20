import { useMemo, useState } from 'react'
import { GENRES, MOCK_BOOKS, type Book, type SearchTab } from '../data/mockBooks'
import { BookCard } from './BookCard'
import { Modal } from './Modal'

const TABS: { id: SearchTab; label: string }[] = [
  { id: 'book', label: 'By Book Name' },
  { id: 'author', label: 'By Author' },
  { id: 'genre', label: 'By Genre' },
]

type SearchDiscoverSectionProps = {
  onBookClick: (book: Book) => void
  selectedBook: Book | null
  modalOpen: boolean
  onCloseModal: () => void
}

export function SearchDiscoverSection({
  onBookClick,
  selectedBook,
  modalOpen,
  onCloseModal,
}: SearchDiscoverSectionProps) {
  const [activeTab, setActiveTab] = useState<SearchTab>('book')
  const [query, setQuery] = useState('')

  const filteredBooks = useMemo(() => {
    if (activeTab === 'genre') {
      if (!query) return MOCK_BOOKS
      return MOCK_BOOKS.filter((book) => book.genre === query)
    }

    const q = query.trim().toLowerCase()
    if (!q) return MOCK_BOOKS

    return MOCK_BOOKS.filter((book) => {
      if (activeTab === 'book') {
        return book.title.toLowerCase().includes(q)
      }
      return book.author.toLowerCase().includes(q)
    })
  }, [activeTab, query])

  const placeholder =
    activeTab === 'book'
      ? 'Search by book name…'
      : 'Search by author…'

  function handleTabChange(tab: SearchTab) {
    setActiveTab(tab)
    setQuery('')
  }

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
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => onBookClick(book)}
                />
              ))
            ) : (
              <p className="col-span-full py-12 text-center text-navy-700/70">
                No books match your search. Try a different term.
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={onCloseModal}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-brand/15 text-2xl">
            📚
          </div>
          <h3 className="font-display text-xl font-bold text-hero-navy">
            Full book reviews — coming soon.
          </h3>
          {selectedBook && (
            <p className="mt-2 text-sm text-navy-700/80">
              {selectedBook.title} by {selectedBook.author}
            </p>
          )}
          <button
            type="button"
            onClick={onCloseModal}
            className="mt-6 rounded-lg bg-hero-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            Got it
          </button>
        </div>
      </Modal>
    </section>
  )
}
