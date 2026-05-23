export function ReviewCardSkeleton() {
  return (
    <article
      className="rounded-xl border border-input-border border-l-2 border-l-amber-100 bg-white p-6 shadow-sm"
      aria-hidden
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="h-6 w-32 rounded-md skeleton-shimmer" />
        <div className="h-5 w-14 rounded-full skeleton-shimmer" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded-md skeleton-shimmer" />
        <div className="h-4 w-full rounded-md skeleton-shimmer" />
        <div className="h-4 w-[75%] rounded-md skeleton-shimmer" />
      </div>
      <div className="mt-6 flex justify-end">
        <div className="h-4 w-24 rounded-md skeleton-shimmer" />
      </div>
    </article>
  )
}
