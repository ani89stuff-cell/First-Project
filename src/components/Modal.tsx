import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-hero-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl ring-1 ring-hero-navy/10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-navy-700/60 transition hover:bg-hero-navy/5 hover:text-hero-navy"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
