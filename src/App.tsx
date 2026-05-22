import { useCallback, useEffect, useState } from 'react'
import { AddReviewSection } from './components/AddReviewSection'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { SearchDiscoverSection } from './components/SearchDiscoverSection'
import { Toast } from './components/Toast'
import type { Book } from './types/book'

function App() {
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchRefreshKey, setSearchRefreshKey] = useState(0)

  const handleToast = useCallback((message: string) => {
    setToastMessage(message)
    setToastVisible(true)
    if (message === 'Review posted successfully') {
      setSearchRefreshKey((key) => key + 1)
    }
  }, [])

  const handleDismissToast = useCallback(() => {
    setToastVisible(false)
  }, [])

  const handleBookClick = useCallback((book: Book) => {
    setSelectedBook(book)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  useEffect(() => {
    if (!toastVisible) return
    const timer = window.setTimeout(() => setToastVisible(false), 4000)
    return () => window.clearTimeout(timer)
  }, [toastVisible])

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero />
        <AddReviewSection onToast={handleToast} />

        <SearchDiscoverSection
          onBookClick={handleBookClick}
          selectedBook={selectedBook}
          modalOpen={modalOpen}
          onCloseModal={handleCloseModal}
          refreshKey={searchRefreshKey}
        />

        <section
          id="about"
          className="section-padding scroll-mt-20 border-t border-input-border bg-hero-navy text-white"
        >
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              A community for readers who care
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              Book-O-Phile is where honest reviews meet discoverability. Share what
              you read, rate readability, and help fellow readers find their next
              great book.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-input-border bg-white py-8 text-center text-sm text-navy-700/60">
        © {new Date().getFullYear()} Book-O-Phile. All reviews are community-submitted.
      </footer>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onDismiss={handleDismissToast}
      />
    </div>
  )
}

export default App
