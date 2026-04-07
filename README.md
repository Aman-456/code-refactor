# User Directory

Next.js frontend (`client/`) and NestJS API (`server/`) for a searchable, paginated user directory. Legacy reference code lives in `legacy/` only; see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for goals.

## Prerequisites

- Node.js 20+ recommended
- npm

## Ports

| App    | Port | URL                    |
|--------|------|------------------------|
| API    | 3002 | http://localhost:3002  |
| Client | 3001 | http://localhost:3001  |

CORS on the API allows the client origin `http://localhost:3001` (and `127.0.0.1`).

## Setup

### API

```bash
cd server
npm install
npm run start:dev
```

Optional: set `PORT` in the environment if you need a different API port.

### Client

```bash
cd client
npm install
cp .env.local.example .env.local
npm run dev
```

If the API is not on `http://localhost:3002`, edit `client/.env.local` and set `NEXT_PUBLIC_API_URL` to your API base URL (no trailing slash).

## Client URL query parameters

The directory syncs **search** and **pagination** with the browser address bar (so you can bookmark or share a view):

- `page` — current page (default `1` if omitted until the UI normalizes the URL)
- `limit` — page size (default `20`; common values `10`, `20`, `50`, `100`, max `100` on the API)
- `q` — search text (optional)
- `layout` — `grid` for a multi-column card grid; omit (or any other value) for full-width list cards

Example: `http://localhost:3001/?page=2&limit=50&q=admin&layout=grid`

## API: users

`GET /api/users` supports:

- `page` (default 1)
- `limit` (default 20, max 100)
- `q` — optional search across name, role, and status (server-side filter, then pagination)

Response shape: `{ success, data, total, page, limit }`.

## Production builds

```bash
cd server && npm run build && npm run start:prod
cd client && npm run build && npm start
```

Use `next start -p 3001` (or configure your host) if you need the same port as local dev.
