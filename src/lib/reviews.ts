import { createBook, findBookByTitle } from './books'
import { supabase } from './supabase'
import type { DisplayReview, Review } from '../types/review'

type ReviewRow = {
  id: string
  book_id: string
  reviewer_name: string
  review_text: string
  readability_score: number
  created_at: string
}

function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    bookId: row.book_id,
    reviewerName: row.reviewer_name,
    reviewText: row.review_text,
    readabilityScore: Number(row.readability_score),
    createdAt: row.created_at,
  }
}

export function orderReviewsForDisplay(reviews: Review[]): DisplayReview[] {
  if (reviews.length === 0) return []

  const earliest = reviews.reduce((min, review) =>
    new Date(review.createdAt).getTime() < new Date(min.createdAt).getTime()
      ? review
      : min,
  )

  const others = reviews
    .filter((review) => review.id !== earliest.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  return [
    { ...earliest, isFirstReview: true },
    ...others.map((review) => ({ ...review, isFirstReview: false })),
  ]
}

export async function fetchReviewsByBookId(
  bookId: string,
): Promise<DisplayReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(
      'id, book_id, reviewer_name, review_text, readability_score, created_at',
    )
    .eq('book_id', bookId)

  if (error) throw error
  return orderReviewsForDisplay((data ?? []).map(mapReviewRow))
}

export type SubmitReviewInput = {
  bookTitle: string
  author: string
  genre: string
  reviewerName: string
  reviewText: string
  readabilityScore: number
  selectedBookId: string | null
}

export async function submitReview(input: SubmitReviewInput): Promise<void> {
  let bookId = input.selectedBookId

  if (!bookId) {
    const existing = await findBookByTitle(input.bookTitle)
    if (existing) {
      bookId = existing.id
    } else {
      bookId = await createBook(input.bookTitle, input.author, input.genre)
    }
  }

  const { error } = await supabase.from('reviews').insert({
    book_id: bookId,
    reviewer_name: input.reviewerName.trim(),
    review_text: input.reviewText.trim(),
    readability_score: input.readabilityScore,
  })

  if (error) throw error
}
