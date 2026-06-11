# chandan.dev — personal portfolio & blog

Personal site for **Chandan Joshi**, full stack engineer. A fast, minimal,
dark/light portfolio with a Markdown-powered blog.

🔗 **Live:** _add your deployed URL here_

## Tech stack

- **React 19** + **Vite 7** — SPA with fast HMR and an optimized production build
- **React Router 7** — client-side routing (`/`, `/blog`, `/blog/:slug`)
- **Markdown blog** — posts live in `src/content/*.md`, parsed at build time with
  `front-matter`, rendered via `react-markdown` + `rehype-highlight` for syntax highlighting
- **CSS custom properties** — theming and a dark/light toggle, no UI framework
- **Inter** via Google Fonts

## Project structure

```
src/
  components/    Header, Hero, Footer, ProjectCard, ThemeToggle
  pages/         Home, Blog, BlogPost
  content/       Blog posts as Markdown (front-matter: title, date, description, tags)
  index.css      Design tokens (colors, spacing, type) + base styles
  App.jsx        Routes
public/
  favicon.svg
```

## Run locally

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build to /dist
npm run preview  # preview the production build
npm run lint     # eslint
```

## Adding a blog post

Create a new file in `src/content/`, e.g. `my-post.md`:

```md
---
title: "Your title"
date: "2026-01-15"
description: "One-line summary shown on the blog index."
tags: ["engineering", "opinion"]
---

Your content in Markdown…
```

It’s picked up automatically — the slug is the filename (`my-post`).

## License

© Chandan Joshi. All rights reserved.
