import { useEffect, useRef, useState } from 'react'
import { searchBookSuggestions } from '../lib/books'
import { submitReview } from '../lib/reviews'
import { GENRES, type BookSuggestion } from '../types/book'
import { useDebounce } from '../hooks/useDebounce'
import {
  hasValidationErrors,
  validateReviewForm,
  type ReviewFormErrors,
} from '../utils/validation'
import { ReadabilityScoreSelector } from './ReadabilityScoreSelector'

type AddReviewSectionProps = {
  onToast: (message: string) => void
}

const emptyForm = {
  bookName: '',
  author: '',
  genre: '',
  review: '',
  readabilityScore: null as number | null,
  reviewerName: '',
}

export function AddReviewSection({ onToast }: AddReviewSectionProps) {
  const [bookName, setBookName] = useState(emptyForm.bookName)
  const [author, setAuthor] = useState(emptyForm.author)
  const [genre, setGenre] = useState(emptyForm.genre)
  const [review, setReview] = useState(emptyForm.review)
  const [readabilityScore, setReadabilityScore] = useState<number | null>(
    emptyForm.readabilityScore,
  )
  const [reviewerName, setReviewerName] = useState(emptyForm.reviewerName)
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [errors, setErrors] = useState<ReviewFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const autocompleteSelectionRef = useRef(false)

  const debouncedBookName = useDebounce(bookName, 300)

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

  const debouncedTerm = debouncedBookName.trim()

  useEffect(() => {
    if (!debouncedTerm) return

    let cancelled = false

    searchBookSuggestions(debouncedTerm)
      .then((results) => {
        if (!cancelled) setSuggestions(results)
      })
      .catch(() => {
        if (!cancelled) setSuggestions([])
      })

    return () => {
      cancelled = true
    }
  }, [debouncedTerm])

  const visibleSuggestions = debouncedTerm ? suggestions : []

  function clearAutocompleteLink() {
    setAuthor('')
    setGenre('')
    setSelectedBookId(null)
    autocompleteSelectionRef.current = false
  }

  function handleBookNameChange(value: string) {
    if (autocompleteSelectionRef.current) {
      clearAutocompleteLink()
    }
    setBookName(value)
    if (!value.trim()) setSuggestions([])
    setShowSuggestions(true)
    setHighlightedIndex(-1)
    setErrors((prev) => ({
      ...prev,
      bookName: undefined,
      author: undefined,
      genre: undefined,
    }))
  }

  function selectBook(book: BookSuggestion) {
    setBookName(book.title)
    setAuthor(book.author)
    setGenre(book.genre)
    setSelectedBookId(book.id)
    autocompleteSelectionRef.current = true
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    setErrors((prev) => ({
      ...prev,
      bookName: undefined,
      author: undefined,
      genre: undefined,
    }))
  }

  function clearForm() {
    setBookName(emptyForm.bookName)
    setAuthor(emptyForm.author)
    setGenre(emptyForm.genre)
    setReview(emptyForm.review)
    setReadabilityScore(emptyForm.readabilityScore)
    setReviewerName(emptyForm.reviewerName)
    setSelectedBookId(null)
    autocompleteSelectionRef.current = false
    setSuggestions([])
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    setErrors({})
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const validationErrors = validateReviewForm({
      bookName,
      author,
      genre,
      review,
      readabilityScore,
      reviewerName,
    })

    setErrors(validationErrors)
    if (hasValidationErrors(validationErrors)) return

    setSubmitting(true)
    try {
      await submitReview({
        bookTitle: bookName,
        author,
        genre,
        reviewerName,
        reviewText: review,
        readabilityScore: readabilityScore as number,
        selectedBookId,
      })
      onToast('Review posted successfully')
      clearForm()
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

  const fieldError = (name: keyof ReviewFormErrors) =>
    errors[name] ? (
      <p className="mt-1.5 text-sm text-red-600">{errors[name]}</p>
    ) : null

  return (
    <section id="home" className="scroll-mt-20 bg-form-cream pb-20 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-hero-navy sm:text-3xl lg:text-4xl">
          Read something good lately? Tell the world.
        </h2>

        <form onSubmit={handleSubmit} className="form-card" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div ref={wrapperRef} className="relative sm:col-span-2">
              <label htmlFor="book-name" className="form-label">
                Book Name
              </label>
              <input
                id="book-name"
                type="text"
                value={bookName}
                onChange={(e) => handleBookNameChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (!showSuggestions || visibleSuggestions.length === 0) return
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setHighlightedIndex((i) =>
                      i < visibleSuggestions.length - 1 ? i + 1 : 0,
                    )
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setHighlightedIndex((i) =>
                      i > 0 ? i - 1 : visibleSuggestions.length - 1,
                    )
                  } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                    e.preventDefault()
                    selectBook(visibleSuggestions[highlightedIndex])
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false)
                  }
                }}
                autoComplete="off"
                className="form-input"
                aria-invalid={Boolean(errors.bookName)}
              />
              {fieldError('bookName')}
              {showSuggestions && visibleSuggestions.length > 0 && (
                <ul
                  className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-input-border bg-white py-1 shadow-lg"
                  role="listbox"
                >
                  {visibleSuggestions.map((book, index) => (
                    <li
                      key={book.id}
                      role="option"
                      aria-selected={index === highlightedIndex}
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectBook(book)}
                        className={`w-full px-3.5 py-2.5 text-left text-sm transition hover:bg-amber-brand/10 ${
                          index === highlightedIndex ? 'bg-amber-brand/15' : ''
                        }`}
                      >
                        <span className="font-medium text-hero-navy">
                          {book.title}
                        </span>
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
                onChange={(e) => {
                  setAuthor(e.target.value)
                  setErrors((prev) => ({ ...prev, author: undefined }))
                }}
                className="form-input"
                aria-invalid={Boolean(errors.author)}
              />
              {fieldError('author')}
            </div>

            <div>
              <label htmlFor="genre" className="form-label">
                Genre
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value)
                  setErrors((prev) => ({ ...prev, genre: undefined }))
                }}
                className="form-input"
                aria-invalid={Boolean(errors.genre)}
              >
                <option value="">Select a genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {fieldError('genre')}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="review" className="form-label">
                Your Review
              </label>
              <textarea
                id="review"
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

            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
              <label htmlFor="reviewer-name" className="form-label">
                Your Name
              </label>
              <input
                id="reviewer-name"
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

            <div className="sm:col-span-2">
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
