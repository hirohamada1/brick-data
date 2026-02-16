# Immotool – Core Project

## Project Description
Immotool processes scraped real-estate data to:
- Normalize data
- Score properties (DSCR, Cap Rate, etc.)
- Provide dashboards & alerts
- Run tests & CI

## Environment
- Node.js + TypeScript + Supabase
- CLI commands: `pnpm dev`, `pnpm test`, `pnpm lint`

## Build instructions
- Build: `pnpm build`
- Dev: `pnpm dev`
- DB migrations: `supabase migrate`

## Test instructions
- Unit tests: `pnpm test`
- Integration tests: `pnpm test:integration`
- Property tests: `pnpm test:property`

## Safety rules
- No direct production writes without staging approval
- DB writes only after tests passed
