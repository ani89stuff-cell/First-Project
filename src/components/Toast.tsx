type ToastProps = {
  message: string
  visible: boolean
  onDismiss: () => void
}

export function Toast({ message, visible, onDismiss }: ToastProps) {
  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-enter fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-lg bg-hero-navy px-5 py-3 text-sm font-medium text-white shadow-xl ring-1 ring-white/10">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          ✓
        </span>
        {message}
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}
