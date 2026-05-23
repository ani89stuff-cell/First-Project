import { createBook, findBookByTitle } from './books'
import { supabase } from './supabase'
import type { DisplayReview, Review, UserReviewWithBook } from '../types/review'

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
  userId: string | null
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
    user_id: input.userId,
    reviewer_name: input.reviewerName.trim(),
    review_text: input.reviewText.trim(),
    readability_score: input.readabilityScore,
  })

  if (error) throw error
}

export type InsertBookReviewInput = {
  reviewerName: string
  reviewText: string
  readabilityScore: number
  userId: string | null
}

export async function insertBookReview(
  bookId: string,
  input: InsertBookReviewInput,
): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      book_id: bookId,
      user_id: input.userId,
      reviewer_name: input.reviewerName.trim(),
      review_text: input.reviewText.trim(),
      readability_score: input.readabilityScore,
    })
    .select(
      'id, book_id, reviewer_name, review_text, readability_score, created_at',
    )
    .single()

  if (error) throw error
  return mapReviewRow(data)
}

function toReview(display: DisplayReview): Review {
  return {
    id: display.id,
    bookId: display.bookId,
    reviewerName: display.reviewerName,
    reviewText: display.reviewText,
    readabilityScore: display.readabilityScore,
    createdAt: display.createdAt,
  }
}

export function addReviewToDisplayList(
  existing: DisplayReview[],
  newReview: Review,
): DisplayReview[] {
  const reviews: Review[] = [...existing.map(toReview), newReview]
  return orderReviewsForDisplay(reviews)
}

type BookJoinRow = { title: string; author: string }

type UserReviewRow = ReviewRow & {
  books: BookJoinRow | BookJoinRow[] | null
}

function resolveBookJoin(
  books: BookJoinRow | BookJoinRow[] | null,
): BookJoinRow | null {
  if (!books) return null
  if (Array.isArray(books)) return books[0] ?? null
  return books
}

function mapUserReviewRow(row: UserReviewRow): UserReviewWithBook {
  const book = resolveBookJoin(row.books)
  return {
    ...mapReviewRow(row),
    bookTitle: book?.title ?? 'Unknown book',
    bookAuthor: book?.author ?? 'Unknown author',
  }
}

export async function fetchReviewsByUserId(
  userId: string,
): Promise<UserReviewWithBook[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
      id,
      book_id,
      reviewer_name,
      review_text,
      readability_score,
      created_at,
      books ( title, author )
    `,
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => mapUserReviewRow(row as UserReviewRow))
}

export type UpdateReviewInput = {
  reviewText: string
  readabilityScore: number
}

export async function updateReview(
  reviewId: string,
  userId: string,
  input: UpdateReviewInput,
): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .update({
      review_text: input.reviewText.trim(),
      readability_score: input.readabilityScore,
    })
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select(
      'id, book_id, reviewer_name, review_text, readability_score, created_at',
    )
    .single()

  if (error) throw error
  return mapReviewRow(data)
}
