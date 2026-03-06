# Plan: IS24 Scraper Blocking, Proxy, and JSON-First Extraction

**Generated**: 2026-03-06  
**Estimated Complexity**: High

## Overview
Stabilize the IS24 scraper stack under `apps/backend-api/src/scraper` and connected runtime roots so that:
1. We reliably diagnose and reduce blocking under direct and proxy modes.
2. We prefer JSON payload extraction (network/API or embedded script) and treat HTML parsing as fallback.
3. We add a gated Captcha-solving integration that only runs when challenge type is solvable and policy allows it.

Current architecture roots in scope:
- `apps/backend-api/src/scraper/*`
- `apps/backend-api/src/services/run_service.py`
- `apps/backend-api/scripts/*` (manual/probe scripts)
- `apps/backend-api/src/test/unit/*` and `apps/backend-api/tests/*` (coverage expansion)

## Baseline Findings (Phase 0 Research + Live Probe)
- `PlaywrightFetchClient` returns `blocked` for both direct and proxy modes on real IS24 search URL.
- Block status is HTTP `401` with static challenge page title `Ich bin kein Roboter - ImmobilienScout24`.
- Challenge response currently does **not** expose listing payload (`resultlistEntries` missing).
- `IS24Client` direct mode also returns HTTP 401.
- `IS24Client` proxy mode fails SSL verification (`CERTIFICATE_VERIFY_FAILED`) under current proxy/TLS handling.
- `IS24Client` BrightData API mode is not configured (`BRIGHTDATA_API_KEY` missing).
- JSON-first parser exists (`is24_parser.py`) but fetch layer does not yet capture network JSON into `extracted_json_text`.

Diagnostics snapshot (captured 2026-03-06 UTC):
```json
{
  "playwright": [
    {"use_proxy": false, "status": "blocked", "http_status": 401, "contains_robot": true},
    {"use_proxy": true, "status": "blocked", "http_status": 401, "contains_robot": true}
  ],
  "http_client": [
    {"provider": "direct", "error": "401 Unauthorized"},
    {"provider": "oxylabs_residential", "error": "CERTIFICATE_VERIFY_FAILED"},
    {"provider": "brightdata", "error": "BRIGHTDATA_API_KEY is not configured"}
  ]
}
```

## Prerequisites
- Python env in `apps/backend-api/.venv` with Playwright + browser binaries installed.
- Verified env vars in `.env.local`/runtime secret store for selected provider.
- Agreement on legal/compliance constraints for bot mitigation and captcha solving.
- Staging-safe watchlist URL(s) for repeatable scrape probes.

## Assumptions To Confirm
- Primary target remains IS24 DE search pages (no multi-country rollout in this scope).
- Residential proxy provider and contract terms permit automated access for this workflow.
- Captcha solving is allowed only for approved challenge types and approved providers.
- JSON-first strict mode can fail fast when JSON payload is unavailable (instead of silently falling back).
- Budget/latency overhead from solver calls is acceptable only behind feature flags.

## Sprint 1: Baseline Instrumentation and JSON Diagnostics
**Goal**: Make blocking/proxy behavior measurable and reproducible with machine-readable output.  
**Demo/Validation**:
- Run diagnostics script and receive JSON report with per-provider status/error/block markers.
- Confirm run stats store block reasons (not only generic `fetch.no_hits`).

### Task 1.1: Add Unified Blocking Diagnostics Script
- **Location**: `apps/backend-api/scripts/is24_blocking_diagnostics.py`
- **Description**: Add script that executes direct/proxy probes (Playwright + HTTP client) and outputs a stable JSON schema.
- **Complexity**: 3
- **Dependencies**: None
- **Acceptance Criteria**:
  - Script prints valid JSON to stdout.
  - Includes `timestamp_utc`, `url`, `playwright[]`, `http_client[]`, and per-attempt status/error fields.
- **Validation**:
  - `PYTHONPATH=.:src ./.venv/bin/python scripts/is24_blocking_diagnostics.py --url "<is24-url>" --format json`
  - JSON schema check via unit test.

### Task 1.2: Improve Block Classification Metadata in FetchArtifact
- **Location**: `apps/backend-api/src/scraper/models/listing_schema.py`, `apps/backend-api/src/scraper/services/playwright_client.py`
- **Description**: Add challenge metadata fields (`challenge_title`, `challenge_type`, `challenge_markers`) populated by fetch layer.
- **Complexity**: 5
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - Artifact includes structured block diagnostics for static deny pages.
  - Metadata is serializable and persisted in diagnostics output.
- **Validation**:
  - Unit test with mocked challenge HTML verifies classifier output.

### Task 1.3: Preserve Fetch Failure Semantics in Run Service
- **Location**: `apps/backend-api/src/services/run_service.py`
- **Description**: Differentiate `blocked/challenge` from generic `no_hits` in run error classification and stats payload.
- **Complexity**: 4
- **Dependencies**: Task 1.2
- **Acceptance Criteria**:
  - Failed runs include `fetch.error_kind=fetch.reject_block` when block was detected.
  - Stats include challenge metadata and provider/session context.
- **Validation**:
  - Add/adjust unit tests in `apps/backend-api/src/test/unit/test_run_service_schema_and_validation.py`.

## Sprint 2: Enforce JSON-First Data Acquisition (HTML Fallback Only)
**Goal**: Retrieve listing data from JSON sources first; use HTML parser only when explicit fallback conditions are met.  
**Demo/Validation**:
- At least one happy-path scrape returns `source=json_endpoint` or `source=embedded_script`.
- HTML parser path is only used when JSON extraction is absent/invalid and fallback is enabled.

### Task 2.1: Capture Network JSON in Playwright Fetch Layer
- **Location**: `apps/backend-api/src/scraper/services/playwright_client.py`
- **Description**: Listen for XHR/fetch responses likely containing IS24 result-list payload; store payload text in `FetchArtifact.extracted_json_text`.
- **Complexity**: 8
- **Dependencies**: Sprint 1 complete
- **Acceptance Criteria**:
  - When network JSON exists, artifact includes non-empty `extracted_json_text`.
  - Response metadata (URL/content-type/status) logged for traceability.
- **Validation**:
  - Unit/integration test with mocked Playwright response stream.

### Task 2.2: Add Explicit JSON-First/Fallback Policy Controls
- **Location**: `apps/backend-api/src/scraper/scraper.py`, `apps/backend-api/src/services/run_service.py`
- **Description**: Add config switch (e.g., `IS24_HTML_FALLBACK_ENABLED`) so `json_first` remains default but HTML parser can be hard-disabled in strict mode.
- **Complexity**: 6
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - Strict mode rejects HTML fallback and returns structured reason.
  - Default mode keeps controlled fallback for resilience.
- **Validation**:
  - Extend `apps/backend-api/src/test/unit/test_is24_scraper_fetch_artifact.py` for strict-vs-fallback behavior.

### Task 2.3: Add Script-Level JSON Output Contract
- **Location**: `apps/backend-api/scripts/manual_scrape_test.py` (or new `scripts/scrape_search_json.py`)
- **Description**: Ensure manual scrape command returns standardized JSON envelope (`fetch`, `parse`, `listings`) instead of ad-hoc prints.
- **Complexity**: 4
- **Dependencies**: Task 2.2
- **Acceptance Criteria**:
  - Script output is parseable JSON.
  - Includes `source` and fallback indicator.
- **Validation**:
  - CLI smoke run piped to `jq` succeeds.

## Sprint 3: Proxy Reliability and Anti-Block Hardening
**Goal**: Resolve proxy transport issues and improve identity/session behavior to reduce immediate hard blocks.  
**Demo/Validation**:
- Proxy mode no longer fails at TLS handshake.
- Controlled probe shows improved pass/block ratio versus baseline.

### Task 3.1: Normalize Proxy Configuration Across Clients
- **Location**: `apps/backend-api/src/scraper/is24_client.py`, `apps/backend-api/src/scraper/services/proxy_provider.py`
- **Description**: Align provider naming/settings, remove BrightData/Oxylabs ambiguity, and standardize env mapping.
- **Complexity**: 5
- **Dependencies**: Sprint 1 complete
- **Acceptance Criteria**:
  - Single documented proxy config contract used by HTTP and Playwright clients.
  - Misconfiguration errors become explicit and actionable.
- **Validation**:
  - Unit tests for env parsing + proxy URL generation.

### Task 3.2: Fix Proxy TLS Behavior for HTTP Client Mode
- **Location**: `apps/backend-api/src/scraper/is24_client.py`
- **Description**: Support custom CA bundle or controlled `verify` override for proxy endpoints that present chain issues.
- **Complexity**: 6
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - Proxy HTTP fetch no longer fails with certificate chain error in configured mode.
  - TLS behavior is explicit via env flags and default-secure.
- **Validation**:
  - Integration probe in diagnostics script confirms no SSL handshake error.

### Task 3.3: Session Affinity and Rotation Strategy
- **Location**: `apps/backend-api/src/scraper/services/session_manager.py`, `apps/backend-api/src/services/run_service.py`
- **Description**: Persist session-per-run, rotate session only on block/error thresholds, and surface session ids in logs/stats.
- **Complexity**: 5
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - Stable session id during nominal run.
  - Rotation happens deterministically after block condition.
- **Validation**:
  - Unit tests for session lifecycle and rotation trigger.

### Task 3.4: Browser Fingerprint/Request Profile Tuning
- **Location**: `apps/backend-api/src/scraper/services/playwright_client.py`, `apps/backend-api/src/scraper/services/anti_detection.py`
- **Description**: Add realistic headers/profile consistency and optional storage-state reuse (already modeled but not fully used).
- **Complexity**: 7
- **Dependencies**: Task 3.3
- **Acceptance Criteria**:
  - Reduced static-block rate in controlled probe set.
  - No policy-violating aggressive retries.
- **Validation**:
  - Compare baseline vs tuned diagnostics runs.

## Sprint 4: Captcha Solver API Integration (Gated, Not Default)
**Goal**: Add solver capability where technically applicable, while skipping unsolved/static deny flows.  
**Demo/Validation**:
- Solver path activates only for recognized interactive captcha types.
- Static 401 deny page bypass attempts are skipped with explicit reason.

### Task 4.1: Implement Challenge Type Classifier
- **Location**: `apps/backend-api/src/scraper/services/challenge_classifier.py` (new), integrate in `playwright_client.py`
- **Description**: Classify challenge pages as `static_deny`, `recaptcha`, `hcaptcha`, `turnstile`, `unknown`.
- **Complexity**: 5
- **Dependencies**: Sprint 1 complete
- **Acceptance Criteria**:
  - Current “Ich bin kein Roboter” page classifies as `static_deny`.
  - Classifier emits confidence + markers.
- **Validation**:
  - Fixture-based unit tests with sample challenge HTML.

### Task 4.2: Define Solver Interface and Provider Adapter
- **Location**: `apps/backend-api/src/scraper/services/captcha_solver.py` (new)
- **Description**: Add provider-agnostic API (`solve(sitekey, page_url, challenge_type)`) with timeout, retries, and error taxonomy.
- **Complexity**: 6
- **Dependencies**: Task 4.1
- **Acceptance Criteria**:
  - Interface supports plug-in providers without changing fetch orchestration.
  - Clear error types: timeout, rejected, unsupported challenge.
- **Validation**:
  - Unit tests with mocked provider responses.

### Task 4.3: Add Playwright Solver Flow for Interactive Challenges
- **Location**: `apps/backend-api/src/scraper/services/playwright_client.py`
- **Description**: Extract challenge sitekey/frame params, request token, inject token, and retry navigation once.
- **Complexity**: 8
- **Dependencies**: Task 4.2
- **Acceptance Criteria**:
  - Max one solver attempt per page by default.
  - If no challenge widget/sitekey present, solver is skipped.
- **Validation**:
  - Integration test with mocked challenge DOM + token flow.

### Task 4.4: Add Cost/Policy Guardrails
- **Location**: `apps/backend-api/src/services/run_service.py`, env docs (`apps/backend-api/.env.example`)
- **Description**: Add flags and budgets (`CAPTCHA_SOLVER_ENABLED`, max solves/run, max spend/day) and structured audit logging.
- **Complexity**: 4
- **Dependencies**: Task 4.3
- **Acceptance Criteria**:
  - Solver never runs when disabled or budget exceeded.
  - Run stats include solver usage counts and outcomes.
- **Validation**:
  - Unit tests for gating and budget enforcement.

## Sprint 5: End-to-End Verification and Rollout
**Goal**: Ship safely with measurable improvements and rollback safety.  
**Demo/Validation**:
- End-to-end watchlist run completes with non-zero listings in staging test set.
- JSON-first sources dominate parse source metrics; HTML fallback remains low.

### Task 5.1: Add Integration Scenarios for Blocked vs Successful Paths
- **Location**: `apps/backend-api/tests/integration/`
- **Description**: Add deterministic tests for direct block, proxy transport failure, JSON extraction success, and fallback behavior.
- **Complexity**: 6
- **Dependencies**: Sprints 2-4
- **Acceptance Criteria**:
  - Coverage includes both transport and parser decision branches.
- **Validation**:
  - Integration suite run with fixture/mocked network.

### Task 5.2: Add Operational Runbook and Alert Thresholds
- **Location**: `apps/backend-api/specs/` (new markdown runbook)
- **Description**: Document known block signatures, remediation playbook, and when to switch providers/solver mode.
- **Complexity**: 3
- **Dependencies**: Sprint 4 complete
- **Acceptance Criteria**:
  - Runbook includes exact commands and expected JSON diagnostics schema.
- **Validation**:
  - Manual dry-run by another engineer.

### Task 5.3: Progressive Rollout + Rollback Checkpoint
- **Location**: deployment/config docs + env settings
- **Description**: Roll out in phases (diagnostic-only -> JSON-first strict -> optional solver), with clear rollback toggles.
- **Complexity**: 4
- **Dependencies**: Task 5.1, Task 5.2
- **Acceptance Criteria**:
  - Feature flags allow immediate revert to previous behavior.
  - No DB schema risk required for initial rollout.
- **Validation**:
  - Staging canary + controlled production subset.

## Testing Strategy
- Unit:
  - Parser source-priority behavior (`json_endpoint` > `embedded_script` > HTML fallback).
  - Challenge classifier and solver gating.
  - Proxy config and TLS option parsing.
- Integration:
  - Realistic fetch artifact pipelines (success/blocked/error).
  - RunService error taxonomy and stats payload completeness.
- Smoke:
  - JSON diagnostics script on staging URL set.
  - One watchlist queue run with proxy enabled and strict JSON-first mode.

## Potential Risks & Gotchas
- Current observed block is static 401 deny page; captcha solver may provide **no immediate benefit** unless challenge type changes to interactive token flow.
- Over-aggressive retry or session rotation can worsen reputation and increase block rate.
- Proxy TLS workarounds can reduce transport security if not scoped carefully.
- HTML structure and network payload contracts can change without notice; parser must remain defensive.
- CI/sandbox browser limitations can produce false negatives; maintain non-browser diagnostics fallback.

## Rollback Plan
- Keep feature flags for:
  - `IS24_HTML_FALLBACK_ENABLED`
  - `CAPTCHA_SOLVER_ENABLED`
  - Proxy provider mode (`IS24_PROVIDER` / `BRIGHTDATA_PROXY_ENABLED`)
- If regression occurs:
  1. Disable solver (`CAPTCHA_SOLVER_ENABLED=false`).
  2. Re-enable HTML fallback while JSON path is fixed.
  3. Fall back to previous proxy mode and session strategy.
  4. Use diagnostics script JSON report to isolate transport vs challenge vs parser failures.
