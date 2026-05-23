export function BookCardSkeleton() {
  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-xl border border-input-border bg-white shadow-md"
      aria-hidden
    >
      <div className="aspect-[4/3] shrink-0 bg-hero-navy/10 skeleton-shimmer" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <div className="h-5 w-[80%] rounded-md skeleton-shimmer" />
          <div className="h-4 w-1/2 rounded-md skeleton-shimmer" />
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-full skeleton-shimmer" />
          <div className="h-6 w-12 rounded-full skeleton-shimmer" />
          <div className="h-4 w-20 rounded-md skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}
