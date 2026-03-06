# Backend API – Agent Rules

## Environment rules
- In local development, set `APP_ENV=local`.
- In local development, set `DB_SCHEMA=public`.
- Hybrid schema routing is not allowed.
- In test mode, all reads and writes must target `DB_SCHEMA`.
- Tests must validate schema consistency.

## Invariant enforcement rules
- Apply these checks after changes to routing, schema behavior, env loading, or the request builder.
- `POST /watchlists` must return `200`.
- `POST /watchlists/{id}/runs` must return `200`.
- `GET latest run` must return non-null.
- At least one `l1_listing` must be inserted.
- Reads must reflect writes in the same schema.
- If any condition fails, revert or fix before proceeding.

## Layer isolation rule
- Frontend helpers must not guess ports
- Frontend helpers must not retry random hosts
- Frontend helpers must use only an explicit env base URL
