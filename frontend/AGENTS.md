<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Warungku frontend conventions

- Read the relevant installed Next.js guide under
  `node_modules/next/dist/docs/01-app/` before using or changing an App Router
  feature. The installed framework version is authoritative.
- Use `app/` for routes, `components/` for reusable UI, and `lib/` for typed
  mock data and shared non-UI helpers.
- Use Tailwind utility classes for component styling and Lucide React for UI
  icons. Avoid custom CSS classes unless Tailwind utilities cannot reasonably
  express the required style; keep `app/globals.css` focused on theme tokens and
  global framework setup.
- The homepage is Indonesian-language. Preserve semantic HTML, accessible
  labels, responsive layouts, and strict TypeScript types.
- Use Poppins and the design tokens in `app/globals.css`: primary `#227BF3`,
  secondary `#DBEDFF`.
- Keep mock homepage data in `lib/home-data.ts`; do not embed catalog content in
  presentation components.
- For frontend changes, run `bun run lint` and `bun run build` from this
  directory when appropriate.
