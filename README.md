# Book-O-Phile

A community book review platform — landing page with live Supabase data.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Supabase](https://supabase.com/)

## Getting started

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Add your Supabase project URL and anon key to `.env`.

3. Run the schema in `supabase/schema.sql` in the Supabase SQL editor.

4. Install and start:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment variables

| Variable | Description |
| -------- | ----------- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |

Set these in `.env` locally and in your Vercel project settings for production.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Features

- Post reviews (creates books when needed, deduplicates by title)
- Book name autocomplete from Supabase
- Search & discover by title, author, or genre
- Form validation with inline error messages
