export const PENDING_REVIEW_STORAGE_KEY = 'bookophile_pending_review'
const PENDING_REVIEW_INFLIGHT_KEY = 'bookophile_pending_review_inflight'

export function markPendingReviewSubmitInflight(): boolean {
  if (sessionStorage.getItem(PENDING_REVIEW_INFLIGHT_KEY)) return false
  sessionStorage.setItem(PENDING_REVIEW_INFLIGHT_KEY, '1')
  return true
}

export function clearPendingReviewSubmitInflight(): void {
  sessionStorage.removeItem(PENDING_REVIEW_INFLIGHT_KEY)
}

export type PendingReviewPayload = {
  bookName: string
  author: string
  genre: string
  reviewText: string
  readabilityScore: number
  reviewerName: string
  bookId: string | null
}

export function savePendingReview(payload: PendingReviewPayload): void {
  localStorage.setItem(PENDING_REVIEW_STORAGE_KEY, JSON.stringify(payload))
}

export function loadPendingReview(): PendingReviewPayload | null {
  try {
    const raw = localStorage.getItem(PENDING_REVIEW_STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const data = parsed as Record<string, unknown>
    const readabilityScore = data.readabilityScore
    if (
      typeof data.bookName !== 'string' ||
      typeof data.author !== 'string' ||
      typeof data.genre !== 'string' ||
      typeof data.reviewText !== 'string' ||
      typeof data.reviewerName !== 'string' ||
      typeof readabilityScore !== 'number' ||
      !Number.isFinite(readabilityScore)
    ) {
      return null
    }

    const bookId = data.bookId
    return {
      bookName: data.bookName,
      author: data.author,
      genre: data.genre,
      reviewText: data.reviewText,
      readabilityScore,
      reviewerName: data.reviewerName,
      bookId:
        bookId === null || bookId === undefined
          ? null
          : typeof bookId === 'string'
            ? bookId
            : null,
    }
  } catch {
    return null
  }
}

export function clearPendingReview(): void {
  localStorage.removeItem(PENDING_REVIEW_STORAGE_KEY)
}

export function hasPendingReview(): boolean {
  return loadPendingReview() !== null
}
