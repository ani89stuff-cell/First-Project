export type Book = {
  id: string
  title: string
  author: string
  genre: string
  readabilityScore: number
  reviewCount: number
}

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Literary Fiction',
    readabilityScore: 8.4,
    reviewCount: 132,
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    readabilityScore: 9.1,
    reviewCount: 214,
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    readabilityScore: 7.8,
    reviewCount: 98,
  },
  {
    id: '4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'History',
    readabilityScore: 8.7,
    reviewCount: 176,
  },
  {
    id: '5',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Mystery & Thriller',
    readabilityScore: 7.2,
    reviewCount: 88,
  },
  {
    id: '6',
    title: 'Ikigai',
    author: 'Héctor García',
    genre: 'Self-Help',
    readabilityScore: 6.9,
    reviewCount: 54,
  },
]

export const GENRES = [
  'Literary Fiction',
  'Non-Fiction',
  'Fantasy',
  'Science Fiction',
  'Mystery & Thriller',
  'Biography',
  'Self-Help',
  'History',
  'Romance',
  "Children's",
  'Other',
] as const

export type SearchTab = 'book' | 'author' | 'genre'
