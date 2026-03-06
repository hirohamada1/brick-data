# brick-data — German Real Estate Intelligence Platform

## Purpose
KeepaAPI-style historical price tracking for German real estate.
Solo developer project. AI agents do the heavy lifting.

## Tech Stack
- Backend: Python 3.12+, FastAPI, SQLAlchemy 2.0
- Database: PostgreSQL 16 + TimescaleDB + pgvector + PostGIS
- Task Queue: Celery + Redis
- Scraping: Playwright + Scrapy
- Agent Framework: LangGraph v1.0 + PydanticAI v1.0
- Frontend: Next.js 14+ (later phase)
- Monitoring: Langfuse (self-hosted)

## Commands
- `make dev`: Start FastAPI dev server
- `make test`: Run pytest (single file: `make test F=path/to/test.py`)
- `make lint`: Ruff check + mypy
- `make migrate`: Alembic migrations
- `make scrape`: Manual scraper trigger
- `make celery`: Start Celery worker + beat

## Architecture
- `/src/agents/` — LangGraph agent definitions
- `/src/scrapers/` — Playwright/Scrapy spiders per source
- `/src/models/` — SQLAlchemy models (ORM)
- `/src/api/` — FastAPI routes
- `/src/services/` — Business logic layer
- `/src/mcp_servers/` — Custom MCP tool servers
- `/docs/specs/` — Feature specs (ALWAYS read before implementing)
- `/docs/architecture/` — ADRs and system design docs

## Constraints
- MUST use typed Pydantic models for ALL agent inputs/outputs
- MUST store prices as BIGINT (cents), NEVER float
- MUST NOT use LLM calls for tasks solvable with deterministic code
- MUST write tests before marking any task complete
- MUST commit in small, atomic commits with conventional commit messages
- NEVER modify migration files directly — create new migrations
- NEVER store personal data (names, phones, emails) from scraped listings

## Workflow
- Always read the relevant spec in docs/specs/ BEFORE implementing
- Create feature branch from main for every task
- Run `make lint` and `make test` before committing
- For complex features, use Plan Mode first → write spec → new session
- Use subagents for parallel review/testing tasks

## Gotchas
- ImmoScout24 uses Reese84 bot detection — see docs/scraping-strategy.md
- TimescaleDB hypertables need special handling in Alembic migrations
- pgvector HNSW index rebuilds are slow — batch embedding updates
- PostGIS requires GEOGRAPHY type for distance queries, not GEOMETRY
```

