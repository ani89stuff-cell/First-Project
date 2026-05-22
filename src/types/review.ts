export type Review = {
  id: string
  bookId: string
  reviewerName: string
  reviewText: string
  readabilityScore: number
  createdAt: string
}

export type DisplayReview = Review & {
  isFirstReview: boolean
}
