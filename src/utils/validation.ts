import { GENRES } from '../types/book'

export type ReviewFormValues = {
  bookName: string
  author: string
  genre: string
  review: string
  readabilityScore: number | null
  reviewerName: string
}

export type ReviewFormErrors = Partial<Record<keyof ReviewFormValues, string>>

export function validateReviewForm(
  values: ReviewFormValues,
): ReviewFormErrors {
  const errors: ReviewFormErrors = {}

  if (!values.bookName.trim()) {
    errors.bookName = 'Book name is required.'
  }

  if (!values.author.trim()) {
    errors.author = 'Author is required.'
  }

  if (!values.genre) {
    errors.genre = 'Please select a genre.'
  } else if (!GENRES.includes(values.genre as (typeof GENRES)[number])) {
    errors.genre = 'Please select a valid genre.'
  }

  if (!values.review.trim()) {
    errors.review = 'Review is required.'
  } else if (values.review.trim().length < 50) {
    errors.review = 'Review must be at least 50 characters.'
  }

  if (values.readabilityScore === null) {
    errors.readabilityScore = 'Please select a readability score.'
  }

  if (!values.reviewerName.trim()) {
    errors.reviewerName = 'Your name is required.'
  }

  return errors
}

export function hasValidationErrors(errors: ReviewFormErrors): boolean {
  return Object.keys(errors).length > 0
}

export type BookDetailReviewFormValues = {
  review: string
  readabilityScore: number | null
  reviewerName: string
}

export type BookDetailReviewFormErrors = Partial<
  Record<keyof BookDetailReviewFormValues, string>
>

export function validateBookDetailReviewForm(
  values: BookDetailReviewFormValues,
): BookDetailReviewFormErrors {
  const errors: BookDetailReviewFormErrors = {}

  if (!values.review.trim()) {
    errors.review = 'Review is required.'
  } else if (values.review.trim().length < 50) {
    errors.review = 'Review must be at least 50 characters.'
  }

  if (values.readabilityScore === null) {
    errors.readabilityScore = 'Please select a readability score.'
  }

  if (!values.reviewerName.trim()) {
    errors.reviewerName = 'Your name is required.'
  }

  return errors
}

export function hasBookDetailValidationErrors(
  errors: BookDetailReviewFormErrors,
): boolean {
  return Object.keys(errors).length > 0
}
