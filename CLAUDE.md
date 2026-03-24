# CLAUDE.md - Project Context for AI Development

## Project Overview

Personal portfolio website for Yann Troadec, IT Technician focused on networking.
Deployed at https://yanntroadec.com via Vercel (auto-deploys from main branch).

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS 4 with PostCSS
- **Animation**: Framer Motion
- **Analytics**: @vercel/analytics v2
- **Linting**: ESLint 9 with TypeScript and React plugins (flat config)
- **Deployment**: Vercel

## Architecture

- All page components use `'use client'` for interactive features (carousels, state, animations)
- **Metadata is exported from route-level `layout.tsx` files** (server components) — never via `useEffect`
- Root layout (`app/layout.tsx`) defines global metadata with title template `"%s | Yann Troadec"`
- Components live in `/components/` (all client components)
- API routes in `app/api/` (Caesar cipher logic, GitHub proxy)
- Dynamic sitemap at `app/sitemap.ts`, dynamic robots at `app/robots.ts`

## Key Conventions

- Dark theme with cyan accent (`#22d3ee` / cyan-400)
- Font: system monospace (`font-mono`)
- Every page includes `FloatingParticles`, `Header`, and `Footer`
- Consistent page structure: grain overlay → particles → header → content → footer
- English documentation and code comments
- ESM modules throughout (`"type": "module"` in package.json)

## SEO

- Each route has its own `layout.tsx` with metadata export and canonical URL
- Root layout includes `Person` schema.org JSON-LD
- Blog articles include `BlogPosting` schema.org JSON-LD with datePublished
- Sitemap: `app/sitemap.ts` (dynamic, includes all routes)
- Robots: `app/robots.ts` (dynamic)

## Build & Deploy

```bash
npm run dev       # Local development
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check (zero warnings allowed)
```

## Important Notes

- Do NOT remove `'use client'` from page components — they use interactive features
- The `React` import in carousel components IS actively used (`React.cloneElement`, `React.isValidElement`, etc.)
- All metadata MUST be in `layout.tsx` files, NOT in `useEffect`
- `next lint` does not exist in Next.js 16 — use `eslint .` directly
- `@typescript-eslint` expects TypeScript <6.0.0 (peer dep warning) but works fine in practice
- Security headers are configured in `next.config.js` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
