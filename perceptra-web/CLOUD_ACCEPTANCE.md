# Cloud pilot acceptance — 9 November 2026

## 4K quality update

The active station now captures 3840 × 2160 using MJPG USB transport and publishes a 4K video track, capped at 8 FPS and 6 Mbps. A separate receive-only LiveKit subscriber decoded an actual 3840 × 2160 frame. DirectShow requires MJPG to be selected after dimensions/FPS; otherwise it silently falls back to YUY2 and approximately 1 FPS at 4K. Native MJPG capture measured approximately 11 FPS; with streaming and AI running, a 30-second sample measured 7.8–8.8 capture FPS and 2.7–2.9 inference FPS, worker CPU 34.5–37.4% normalized across 12 logical processors, and 913–939 MB worker RSS. This is an initial sample, not a 4K endurance test.

AI input remains at most 640 pixels wide and boxes are mapped back to capture coordinates before tracking and monitored-area checks. Incident JPEG evidence is independently bounded to 1920 pixels wide and 600 KB to fit the ingestion API limit; video is 4K, snapshots are not claimed as 4K. Local MJPEG preview is bounded to 1280 pixels and 5 FPS. The player preserves the actual video aspect ratio and the UI displays actual capture dimensions. Ten capture/frame regression checks, five incident/outbox checks, one restart recovery check and TypeScript passed. Updated production deployment `dpl_5R8c5GYcxnEryu5LyUo24wBiq3ku` is READY.

4K consumes the free video bandwidth allowance more quickly; no plan or billing change was made.

Production: https://perceptra-phi.vercel.app

Final deployment: `dpl_8pc2EiqWyBBzknqCxWbefoghBCFf` — READY, Next.js, production. Source uploaded directly from the workspace rather than a Git commit. Final public checks: login 200, health 200, unauthenticated camera API 401. The temporary acceptance operator was removed and the browser returned to sign-in.

The Next.js frontend and API are hosted on the existing Perceptra Vercel project. Neon database `perceptra-pilot` is new and on Free; six schema migrations applied successfully. LiveKit project `Perceptra` uses Build, with a displayed next invoice of $0.00. No paid plan was selected.

## Verified

- Fresh cloud admin created, with password entered privately by the owner. Local accounts/history were not migrated.
- Production build and TypeScript passed. Earlier regression runs: 36 local database-backed checks, 12 cloud-mode checks, 7 reporting/notification checks, and 6 worker/outbox checks.
- Fifteen HTTP checks against the actual production URL passed: authentication, heartbeat, operator role restrictions, request-origin validation, subscribe-only video tokens, idempotent incident ingestion, escalation, acknowledgement, resolution, reports, CSV, and cron protection. The explicitly labeled disposable test incident and delivery records were removed.
- Chrome signed in as a temporary acceptance operator. The real ONN camera played through LiveKit at 640 × 480, video readyState 4, unpaused, with advancing playback time. Capture, inference and backend were online; queue was empty. The camera recovered when plugged in, without worker restart.
- After the test viewer signed out and its lease expired, LiveKit publishing returned to idle while capture and inference continued. Observed inference was approximately 2.9 FPS with two Torch threads and approximately 230–260 ms inference time.
- No port forwarding or public camera HTTP endpoint was configured. The worker's HTTP service remains on loopback. Publishing is outbound and on demand.

## Operating

Keep this PC awake and the ONN webcam connected. The website stays available if the PC is off, but camera video and detection require the station. Start/stop only the cloud camera worker:

```powershell
.\scripts\Start-CloudWorker.ps1
.\scripts\Stop-CloudWorker.ps1
```

Cloud worker configuration is in ignored `../perceptra-ai-service/.env.worker`. Cloud delivery uses a backend-specific SQLite outbox, separate from local pending deliveries. To return to local mode, stop the cloud worker and rename `.env.worker` before using the normal local startup script.

Cloud admin password changes use `scripts/Set-AdminPassword.ps1 -Cloud`; omitting `-Cloud` targets the local account. Cloud connection and credential files are ignored and excluded from deployment source. Never commit these files.

## Limits and remaining validation

This is a free-tier pilot, not unlimited hosting or video. LiveKit publishes while an authenticated page keeps its viewing lease alive. Daily cron cleanup can retain resolved incidents for approximately seven to eight days. Unresolved incidents remain.

Real person-to-loitering detection and two-hour resource stability were verified previously in local mode. This cloud acceptance verified real remote camera video and hosted incident handling separately; it did not repeat the person dwell test or a two-hour cloud soak, and it did not verify playback from a second network or mobile device. No weapon or face recognition was added.

Deployment was uploaded from an allowlisted set of application source files; local runtime data, snapshots, model files, secrets, and logs were excluded. Git source changes have not been committed or pushed. Future deployment must use the current Next.js source, not the old Vite frontend.
