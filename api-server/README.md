# API Server (Express)

This folder contains a minimal Express server that serves the same API endpoints previously provided by the Next.js `/api/*` routes, but as a standalone backend using Supabase.

Setup

```bash
cd api-server
npm install
```

Environment

- Uses the same `.env.local` from the project root. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.

Run

```bash
npm run dev    # requires nodemon
# or
npm start
```

The server runs on port `4000` by default and exposes endpoints under `/api/*` (e.g. `POST /api/auth/login`).
