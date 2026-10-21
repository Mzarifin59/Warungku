# Warungku

Warungku is a marketplace for Indonesian UMKM (micro, small, and medium-sized
businesses). It helps customers discover local shops and products, while giving
sellers a simple way to manage their online storefronts.

## Repository layout

- `frontend/` — Next.js App Router application and the marketplace homepage.
- `backend/` — Laravel application and API foundation.

The current homepage uses frontend mock data; it is not yet connected to the
backend catalog or ordering flows.

## Frontend

See [frontend/README.md](frontend/README.md) for setup, scripts, directory
structure, and design-system details.

From `frontend/`, run `bun run dev` and open [http://localhost:3000](http://localhost:3000).
Run `bun run lint` and `bun run build` there to validate frontend changes.

## Guidance for AI coding agents

- Read [frontend/AGENTS.md](frontend/AGENTS.md) before changing the frontend and
  [backend/AGENTS.md](backend/AGENTS.md) before changing the backend.
- Keep frontend mock catalog content in `frontend/lib/` and reusable UI in
  `frontend/components/`.
- Preserve the frontend design tokens: Poppins, primary `#227BF3`, and
  secondary `#DBEDFF`.
- Validate frontend changes with the focused lint/build scripts in the frontend
  package.
