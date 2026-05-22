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
