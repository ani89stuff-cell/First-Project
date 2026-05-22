import { supabase } from './supabase'
import {
  mapBookRow,
  type Book,
  type BookSuggestion,
  type SearchTab,
} from '../types/book'

const BOOK_SELECT = `
  id,
  title,
  author,
  genre,
  reviews ( readability_score )
`

export async function searchBookSuggestions(
  term: string,
): Promise<BookSuggestion[]> {
  const trimmed = term.trim()
  if (!trimmed) return []

  const { data, error } = await supabase
    .from('books')
    .select('id, title, author, genre')
    .ilike('title', `%${trimmed}%`)
    .order('title')
    .limit(5)

  if (error) throw error
  return data ?? []
}

export async function findBookByTitle(
  title: string,
): Promise<BookSuggestion | null> {
  const trimmed = title.trim()
  if (!trimmed) return null

  const { data, error } = await supabase
    .from('books')
    .select('id, title, author, genre')
    .ilike('title', trimmed)

  if (error) throw error
  if (!data?.length) return null

  const normalized = trimmed.toLowerCase()
  return (
    data.find((book) => book.title.trim().toLowerCase() === normalized) ?? null
  )
}

export async function createBook(
  title: string,
  author: string,
  genre: string,
): Promise<string> {
  const { data, error } = await supabase
    .from('books')
    .insert({
      title: title.trim(),
      author: author.trim(),
      genre,
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

export async function fetchBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .select(BOOK_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return mapBookRow(data)
}

const HOT_BOOK_LIMIT = 3
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function countReviewsByBook(
  reviews: { book_id: string }[],
): Map<string, number> {
  const counts = new Map<string, number>()
  for (const review of reviews) {
    counts.set(review.book_id, (counts.get(review.book_id) ?? 0) + 1)
  }
  return counts
}

function topBookIdsByCount(
  counts: Map<string, number>,
  limit: number,
  exclude: Set<string> = new Set(),
): string[] {
  return [...counts.entries()]
    .filter(([bookId]) => !exclude.has(bookId))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([bookId]) => bookId)
}

export async function fetchHotBooks(): Promise<Book[]> {
  const { data: allReviews, error: allError } = await supabase
    .from('reviews')
    .select('book_id')

  if (allError) throw allError
  if (!allReviews?.length) return []

  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS).toISOString()

  const { data: recentReviews, error: recentError } = await supabase
    .from('reviews')
    .select('book_id')
    .gte('created_at', sevenDaysAgo)

  if (recentError) throw recentError

  const recentCounts = countReviewsByBook(recentReviews ?? [])
  const allTimeCounts = countReviewsByBook(allReviews)

  const selectedIds: string[] = []
  const recentTop = topBookIdsByCount(recentCounts, HOT_BOOK_LIMIT)
  selectedIds.push(...recentTop)

  if (selectedIds.length < HOT_BOOK_LIMIT) {
    const exclude = new Set(selectedIds)
    const fillCount = HOT_BOOK_LIMIT - selectedIds.length
    const allTimeTop = topBookIdsByCount(allTimeCounts, fillCount, exclude)
    selectedIds.push(...allTimeTop)
  }

  if (selectedIds.length === 0) return []

  const { data: books, error: booksError } = await supabase
    .from('books')
    .select(BOOK_SELECT)
    .in('id', selectedIds)

  if (booksError) throw booksError

  const bookById = new Map((books ?? []).map((row) => [row.id, mapBookRow(row)]))

  return selectedIds
    .map((id) => bookById.get(id))
    .filter((book): book is Book => book !== undefined)
}

export async function searchBooks(
  tab: SearchTab,
  query: string,
): Promise<Book[]> {
  let builder = supabase.from('books').select(BOOK_SELECT)

  if (tab === 'genre') {
    if (query) {
      builder = builder.eq('genre', query)
    }
  } else {
    const trimmed = query.trim()
    if (trimmed) {
      const column = tab === 'book' ? 'title' : 'author'
      builder = builder.ilike(column, `%${trimmed}%`)
    }
  }

  const { data, error } = await builder.order('title')

  if (error) throw error
  return (data ?? []).map(mapBookRow)
}
