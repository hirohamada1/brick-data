# IS24 Scraper Operations Runbook

## Purpose
Operational guide for diagnosing blocking, proxy issues, JSON-first parsing behavior, and optional captcha solver runs.

## Diagnostics
Run JSON diagnostics:

```bash
cd apps/backend-api
PYTHONPATH=.:src ./.venv/bin/python scripts/is24_blocking_diagnostics.py --url "<is24-search-url>"
```

Expected keys:
- `playwright[].http_status`
- `playwright[].block_reason`
- `playwright[].challenge_type`
- `playwright[].challenge_markers`
- `http_client[].error` or payload markers

## Queue Run
Start backend and trigger a watchlist run:

```bash
cd apps/backend-api
PYTHONPATH=.:src ./.venv/bin/python scripts/run_real_url_watchlist_test.py --timeout 600
```

Inspect run stats:
- `fetch.ingestion_mode`
- `fetch.html_fallback_enabled`
- `fetch.challenge_type`
- `fetch.captcha.*`

## Feature Flags
- `IS24_INGESTION_MODE=json_first|json_only|html_only`
- `IS24_HTML_FALLBACK_ENABLED=true|false`
- `CAPTCHA_SOLVER_ENABLED=true|false`
- `CAPTCHA_MAX_SOLVES_PER_RUN=2`
- `CAPTCHA_MIN_BALANCE=<float>`

## Known Blocking Signatures
- HTTP `401|403|429|503`
- Title: `Ich bin kein Roboter - ImmobilienScout24`
- `challenge_type=static_deny` means no interactive token flow was detected.

## Rollback
Immediate rollback is env-only:
1. `CAPTCHA_SOLVER_ENABLED=false`
2. Keep `IS24_INGESTION_MODE=json_first`
3. Set `IS24_HTML_FALLBACK_ENABLED=true` if strict JSON-only caused data loss.
4. Re-run diagnostics and verify `fetch.error_kind` and `fetch.block_reason`.
