import { useEffect, useRef, useState } from 'react'
import { GENRES, MOCK_BOOKS, type Book } from '../data/mockBooks'
import { ReadabilityScoreSelector } from './ReadabilityScoreSelector'

type AddReviewSectionProps = {
  onSubmitSuccess: () => void
}

export function AddReviewSection({ onSubmitSuccess }: AddReviewSectionProps) {
  const [bookName, setBookName] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [review, setReview] = useState('')
  const [readabilityScore, setReadabilityScore] = useState(7)
  const [reviewerName, setReviewerName] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const suggestions = bookName.trim()
    ? MOCK_BOOKS.filter((book) =>
        book.title.toLowerCase().includes(bookName.trim().toLowerCase()),
      ).slice(0, 5)
    : []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectBook(book: Book) {
    setBookName(book.title)
    setAuthor(book.author)
    setGenre(book.genre)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmitSuccess()
  }

  return (
    <section id="home" className="scroll-mt-20 bg-form-cream pb-20 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-hero-navy sm:text-3xl lg:text-4xl">
          Read something good lately? Tell the world.
        </h2>

        <form onSubmit={handleSubmit} className="form-card">
          <div className="grid gap-5 sm:grid-cols-2">
            <div ref={wrapperRef} className="relative sm:col-span-2">
              <label htmlFor="book-name" className="form-label">
                Book Name
              </label>
              <input
                id="book-name"
                type="text"
                value={bookName}
                onChange={(e) => {
                  setBookName(e.target.value)
                  setShowSuggestions(true)
                  setHighlightedIndex(-1)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (!showSuggestions || suggestions.length === 0) return
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setHighlightedIndex((i) =>
                      i < suggestions.length - 1 ? i + 1 : 0,
                    )
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setHighlightedIndex((i) =>
                      i > 0 ? i - 1 : suggestions.length - 1,
                    )
                  } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                    e.preventDefault()
                    selectBook(suggestions[highlightedIndex])
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false)
                  }
                }}
                autoComplete="off"
                className="form-input"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul
                  className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-input-border bg-white py-1 shadow-lg"
                  role="listbox"
                >
                  {suggestions.map((book, index) => (
                    <li key={book.id} role="option" aria-selected={index === highlightedIndex}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectBook(book)}
                        className={`w-full px-3.5 py-2.5 text-left text-sm transition hover:bg-amber-brand/10 ${
                          index === highlightedIndex ? 'bg-amber-brand/15' : ''
                        }`}
                      >
                        <span className="font-medium text-hero-navy">{book.title}</span>
                        <span className="text-navy-700/70"> — {book.author}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="genre" className="form-label">
                Genre
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="form-input"
              >
                <option value="">Select a genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="review" className="form-label">
                Your Review
              </label>
              <textarea
                id="review"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you think? Be honest."
                className="form-input resize-y"
              />
            </div>

            <div className="sm:col-span-2">
              <ReadabilityScoreSelector
                value={readabilityScore}
                onChange={setReadabilityScore}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="reviewer-name" className="form-label">
                Your Name
              </label>
              <input
                id="reviewer-name"
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="form-input sm:max-w-md"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-brand-hover hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-hero-navy focus-visible:ring-offset-2 sm:w-auto"
              >
                Post Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
