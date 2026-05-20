export function getReadabilityBadgeClasses(score: number): string {
  if (score >= 8) {
    return 'bg-emerald-100 text-emerald-800 ring-emerald-200'
  }
  if (score >= 5) {
    return 'bg-amber-100 text-amber-800 ring-amber-200'
  }
  return 'bg-red-100 text-red-800 ring-red-200'
}
