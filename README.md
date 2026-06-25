# Empact — Charity Finder

AI-powered semantic charity discovery platform. (Product requirements and visual design system reference are kept outside this repo.)

Instead of rigid country/theme dropdowns, users describe their cause in plain English ("girls' education in East Africa under $100") and get ranked GlobalGiving projects, each with an AI-generated summary and a computed funding-impact estimate.

## Architecture

```
GlobalGiving API → FastAPI cache job → Postgres (pgvector) → FastAPI query endpoints → React frontend
```

- **Frontend** — React + Vite + TypeScript + Tailwind v4, using the "Steep" design token set.
- **Backend** — FastAPI, the only client of the GlobalGiving API (hides the key, enables caching).
- **Database** — PostgreSQL + `pgvector`. Local dev via Docker Compose; production on Supabase/Neon.
- **AI** — OpenAI `text-embedding-3-small` for semantic search embeddings; Anthropic Claude Haiku for project summaries.

### Why these choices

- **Postgres + pgvector, not a dedicated vector DB** — the data is already relational (orgs → projects → snapshots); pgvector lets similarity search and structured filtering live in one query instead of stitching together two databases.
- **A caching layer in front of GlobalGiving** — avoids live scraping on every search and avoids rate limits; all AI outputs (embeddings, summaries) are generated once per project and stored, so a repeated search never re-triggers a paid API call.
- **Claude Haiku for summarization, OpenAI for embeddings** — summarization is a cheap, latency-tolerant batch job (good fit for a small/fast model), while embeddings need to match whatever model generated the corpus vectors; splitting providers also avoids a single point of failure across both AI features.
- **An append-only snapshots table from day one** — the funding-velocity impact estimate needs `amount_raised` over time; collecting it from the first cache refresh means that feature has real data to work with once it's built, rather than waiting for a schema migration later.

## Project layout

```
backend/    FastAPI app, SQLAlchemy models, Alembic migrations, GlobalGiving/embedding/summary services
frontend/   React + Vite + Tailwind v4 app
```

## Local development

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# create a .env file with: DATABASE_URL, GLOBALGIVING_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, ALLOWED_ORIGINS
uvicorn app.main:app --reload
```

Requires a running Postgres with `pgvector` — `docker compose up db` (see `docker-compose.yml`) once Docker Desktop is installed, or point `DATABASE_URL` at a hosted Supabase/Neon instance with the `pgvector` extension enabled.

### Frontend

```bash
cd frontend
npm install
# create a .env file with: VITE_API_BASE_URL (defaults to http://localhost:8000 if unset)
npm run dev
```

## Status

Early scaffold: backend API, data model, and AI service wiring are in place and verified against a local Postgres+pgvector instance. Frontend is a bare Vite/Tailwind shell — pages haven't been built yet. GlobalGiving response shapes still need verification against a live API key.
