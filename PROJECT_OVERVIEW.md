# User Directory — What I’m Doing

Take-home from First Epic: refactor the User Directory page and untangle the code. Next.js + Nest.js.

## Project layout

- **`legacy/`** — old reference code only (`page.tsx`, `users.controller.ts`, etc.). Do not extend it; use it to understand behavior and requirements.
- **`client/`** — new Next.js app (User Directory UI and related code).
- **`server/`** — new Nest API (users endpoint and related code).

## First: Get it Running

- Scaffold or wire up the apps under `client/` and `server/`, configure API URL, CORS, and env as needed so they talk to each other.
- Verify both run locally before refactoring behavior.

## Backend (`server/`)

- `/api/users` should not return the full dataset in one response.
- Implement pagination (`page` + `limit` or `offset` + `limit`). Return only a slice of data and include a total count for UI pagination.

## Frontend (`client/`)

- Don’t fetch all users at once; use the paginated API.
- Break the directory UI into components (list row, controls, search bar).
- Move fetch + state logic into a hook or server component.
- Add a search box to filter the list; client- vs server-side choice explained in PR.

## Ship Checklist

- GitHub repo with working project.
- Short PR writeup in plain English for non-developers.
