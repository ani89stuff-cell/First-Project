import { createBook, findBookByTitle } from './books'
import { supabase } from './supabase'

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
