export type Book = {
  id: string
  title: string
  author: string
  genre: string
  avgReadabilityScore: number
  reviewCount: number
}

export type BookSuggestion = {
  id: string
  title: string
  author: string
  genre: string
}

export type SearchTab = 'book' | 'author' | 'genre'

export const GENRES = [
  'Biography',
  "Children's",
  'Fantasy',
  'History',
  'Literary Fiction',
  'Management',
  'Mystery & Thriller',
  'Non-Fiction',
  'Other',
  'Romance',
  'Science Fiction',
  'Self-Help',
] as const

type ReviewScoreRow = { readability_score: number }

type BookWithReviewsRow = {
  id: string
  title: string
  author: string
  genre: string
  reviews: ReviewScoreRow[] | null
}

export function mapBookRow(row: BookWithReviewsRow): Book {
  const scores = (row.reviews ?? []).map((r) => Number(r.readability_score))
  const reviewCount = scores.length
  const avgReadabilityScore = reviewCount
    ? scores.reduce((sum, score) => sum + score, 0) / reviewCount
    : 0

  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    avgReadabilityScore,
    reviewCount,
  }
}
