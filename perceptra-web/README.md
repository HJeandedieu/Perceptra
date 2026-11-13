# Perceptra Next.js application

Next.js serves both the interface and application APIs. The earlier Vite/Express apps remain preserved during migration.

## Run locally

Use Node 20.9 or newer. Run `npm ci`, `npm run db:generate`, then `npm run build`. Run `npm start` and open http://localhost:5000. Stop the old Express server first if it uses that port.

A local .env.local has been generated with random session and service secrets. Configure its DATABASE_URL with your actual PostgreSQL connection. For a fresh database, apply the copied legacy migration with `npm run db:migrate` (Prisma CLI requires DATABASE_URL in the shell or a .env file; .env.local is loaded by Next.js, not automatically by Prisma CLI). For an existing database, preserve its migration history and do not reset it.

## Administrator setup

Set BOOTSTRAP_PASSWORD in the PowerShell environment to a unique password of at least 12 characters. Run `npm run admin:create`, enter the admin email and name, then remove BOOTSTRAP_PASSWORD from the environment. The command refuses to overwrite an existing account. No default account is shipped.

## Implemented

- Responsive approved workspace shell and five routes, light/dark theme, and navigation.
- Native Next.js login/logout/me routes, bcrypt verification, eight-hour HTTP-only SameSite=Strict signed cookies, server-side page protection, and database lookup on each authenticated request.
- Origin checks on authentication mutations, account-based local login throttling, safe sign-in errors, and logout.
- Prisma client using the existing PostgreSQL User model, legacy migration history, and admin bootstrap command.
- `/api/health` reports process availability and capability status; it does not claim database or camera health.

The local HTTP deployment uses COOKIE_SECURE=false. Set COOKIE_SECURE=true when serving over HTTPS and set APP_ORIGIN to the browser origin.

## Remaining

Camera streaming, incident storage/lifecycle, persistent camera settings, live notifications, analytics, operator management, and reliability testing remain to be implemented. Disconnected screens deliberately display no fabricated footage or metrics. A running PostgreSQL instance is required to create an administrator and test successful login.

## Camera and incident milestone

An additive migration introduces Camera, Incident, IncidentActivity, Delivery, and IncidentStatus without replacing legacy tables. Apply it after PostgreSQL is configured. The migration has not been applied on this machine.

Authenticated APIs:
- GET /api/cameras, PATCH /api/cameras/camera-01 (admin only).
- GET /api/incidents?status=NEW&page=1 (25 records per page).
- GET /api/incidents/:id, POST /api/incidents/:id/acknowledge.
- POST /api/incidents/:id/resolve with JSON `{ "outcome": "RESOLVED", "note": "Checked entrance" }`; FALSE_ALARM is the other outcome.

Python-service integration contract (not yet connected to the current worker):
- GET /api/internal/config with Authorization: Bearer SERVICE_TOKEN.
- POST /api/internal/incidents with the same credential and JSON fields id, deliveryId, trackId, cameraId (camera-01), severity (medium/high), firstSeen and lastSeen (ISO timestamps), reason, and optional metadata object.
- Keep incident id stable across observations. Every new update uses a fresh deliveryId; retrying an update must reuse its deliveryId.
- Closed incidents ignore further ingestion updates. Escalation to high is monotonic; older observations do not replace lastSeen.

Incident list and detail screens call these APIs. Lists refresh every ten seconds. Settings save configuration versions, but report applied=false until worker configuration sync is implemented. Capture/inference/delivery health deliberately remains unavailable. No snapshot or streaming claim is made in this milestone.

Remaining: worker tracking/rules/outbox, snapshots, camera streaming/config sync, analytic/report APIs, notifications, retention, and database integration tests.

## Reporting and local operations

Analytics and overview now use persisted incident reports. UTC date filters accept a maximum 366-day period and 10,000 incidents per report. CSV export applies the same filters and neutralizes spreadsheet formulas. Browser notifications require an explicit operator click; in-app new-incident polling runs every ten seconds while the workspace is open. It does not replace external emergency notifications.

Run `npm run retention` to remove only incidents resolved/marked false alarm more than seven days ago, including their inline snapshots and activity. Unresolved incidents are retained. The startup script runs cleanup once per launch; there is no scheduled background cleanup yet. Idempotency delivery records remain retained to prevent duplicate replays.

Run `./scripts/Start-Perceptra.ps1` after installation, build, migrations, and admin setup. It checks prerequisites and launches hidden loopback Next.js and Python worker processes with logs under .runtime. Run `./scripts/Stop-Perceptra.ps1` to stop only the recorded processes after checking PID/start-time identity. Stop is a process termination, so the SQLite outbox provides recovery of committed deliveries on restart. Camera health is checked through the dashboard after launch; preflight does not open the webcam.

Successful PostgreSQL execution, actual webcam behavior, and the two-hour soak remain unverified on this machine. Startup scripts are syntax-checked only until those prerequisites are available.

## Verified local deployment (latest)

The isolated local PostgreSQL cluster is now initialized and both migrations have been applied. Credentials and port are in ignored .env.local. Run `npm run db:start` after reboot (`Start-Perceptra.ps1` also does this). `npm run db:stop` stops only this project cluster.

Actual database-backed HTTP integration verification and webcam/CPU-inference/stream-proxy verification have passed. Run `npm run test:integration` for temporary-account API verification; it restores camera settings and removes its own test records. Run `npm run test:camera` only while the normal worker is stopped: it opens the real webcam and starts temporary servers, uses a 600-second dwell threshold to avoid incidental alerts, and writes health samples to ignored .runtime/worker-verification.json.

Create your permanent account using `npm run admin:create` with BOOTSTRAP_PASSWORD set locally, then start the station. Do not use test account identities: those are deleted after verification.

Still required before claiming readiness: a two-hour soak with CPU/RAM measurements, visual browser QA, retention execution verification, and a witnessed real loitering incident through operator resolution.

## Monitored area and operator access

Station settings now includes an authenticated camera preview. Drag a rectangle or use the four normalized numeric coordinates; save configuration to apply it. Invalid/reversed/zero-area rectangles are rejected. The worker confirmation message appears after settings sync. The editor needs visual browser verification; API persistence/validation is covered by integration tests.

Administrators can list users and create OPERATOR accounts from Team & access. Operator passwords require at least 12 characters and at most 72 UTF-8 bytes. Only the bcrypt hash is stored. Operators cannot manage accounts or change camera settings. Account removal is permanent, requires an administrator, and preserves incident history. The permanent administrator and the current user cannot be removed through this interface. Password resets remain a local administrator task.

The stop script now compares timestamps as DateTime ticks (PowerShell deserializes JSON timestamps) and stops the verified Python launcher child before its parent, avoiding a second worker competing for the webcam after restart.

## Notification and retention completion

Notification preferences now persist per user in PostgreSQL. In-app banners, browser notifications, and sound are independently configurable. Browser permission and AudioContext activation require explicit header clicks. Preferences are edited in Your notifications. Incident update polling uses a timestamp/id cursor, including severity changes, rather than only the newest first-seen incidents.

Retention now uses one shared policy for manual cleanup and a server-start/hourly scheduler registered through Next.js instrumentation. It runs only in the Node server runtime, not the production build phase. Failures are logged and retried at the next interval; unresolved incidents are preserved.

Chrome desktop verification passed for login, overview/live screens, light/dark settings, saved preferences, and logout. The loopback sign-in origin issue was fixed: localhost and 127.0.0.1 are accepted only at the configured protocol/port; unrelated hosts/ports remain denied.

See OPERATOR_GUIDE.md for the operator workflow. Remaining acceptance work: mobile rendering, actual audible/OS notification delivery, user-witnessed loitering/escalation/resolution, physical unplug/reconnect, and the two-hour AI-enabled soak. No long stability result is claimed.

## Acceptance updates

The real ONN incident was acknowledged and resolved through the browser by a temporary QA operator, with an explicit controlled-test note. The operator account was removed and the incident history preserved. Mobile rendering was reviewed at 390x844; mobile sign-out was added and verified. Notification policy was corrected so acknowledgement does not trigger another alert, and closed incidents clear their banner.

After a restart, the default Windows camera backend stopped returning frames even though Windows still enumerated the ONN camera. DirectShow capture succeeded, so Windows USB capture now uses CAP_DSHOW explicitly. File/network sources still use CAP_ANY. Capture tests passed after this change.

`npm run test:soak` performs the planned 7200-second AI-enabled resource sample. The station must already be running. It temporarily enables monitoring with a 600-second threshold, samples process-tree CPU/RAM and worker freshness/queue data, then restores settings. Test incidents can still arise if someone stays in view beyond that threshold. Results are written to ignored .runtime/soak-result.json and resource-sample.json. `npm run test:soak -- 30` is a short runner check, not the two-hour acceptance test. Keep the PC awake and do not restart services during sampling.

The physical unplug/reconnect check must be coordinated with the operator before the long soak; it is not simulated by an application restart.
