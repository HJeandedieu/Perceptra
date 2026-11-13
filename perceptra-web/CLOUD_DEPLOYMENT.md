# Cloud pilot

Status: deployed to https://perceptra-phi.vercel.app on 9 November 2026. Real remote video and hosted incident handling were verified; see [cloud acceptance](CLOUD_ACCEPTANCE.md) for evidence and remaining checks.

The Next.js app runs on Vercel; the USB webcam and detector remain on the PC. The worker makes outbound HTTPS requests and publishes video through LiveKit only while a signed-in viewer has an active viewing lease. Keep the PC awake and the worker running for monitoring. Free allowances are finite.

Use a fresh PostgreSQL database. Never copy `.env.local`, `.runtime`, local database files, accounts, incident snapshots, or the local worker outbox into a deployment. The deployment root is `perceptra-web`.

## Hosting configuration

Vercel environment variables (production only initially):

- `DATABASE_URL`: fresh hosted PostgreSQL connection; `DATABASE_URL_POOLED` may supply the application's pooled connection.
- `SESSION_SECRET`, `SERVICE_TOKEN`, `CRON_SECRET`: three independent random secrets, each at least 32 characters. Do not reuse local secrets.
- `APP_ORIGIN`: exact production HTTPS origin.
- `COOKIE_SECURE=true`
- `WORKER_CONNECTION=outbound`
- `STREAM_TRANSPORT=livekit`
- `LIVEKIT_URL`: project WSS endpoint.
- `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`: server-only LiveKit credentials.
- `LIVEKIT_ROOM`: unique production room name; never share it with previews.

Apply `npm run db:migrate:deploy` against the fresh database before opening the app. Build command is `npm run build:vercel`. Bootstrap a new administrator using the existing local setup command against the cloud database with a privately entered password. Local accounts are not migrated.

The daily Vercel cron removes resolved incidents older than seven days, so actual cleanup may take approximately seven to eight days. Unresolved incidents remain. The local hourly retention task remains unchanged.

## Camera station

Copy the worker's `.env.worker.example` to ignored `.env.worker`, insert the production URL and matching new cloud `SERVICE_TOKEN`, then run the worker with its virtual environment. The worker uses a separate backend-specific SQLite outbox; it does not deliver old local pending records to the fresh cloud database. Remove `.env.worker` to return to the normal local configuration.

No LiveKit API secret is needed on the station: its publisher token comes from the authenticated application. Browser tokens can subscribe only; the station can publish only camera video. Viewer leases refresh every 20 seconds and expire after 45 seconds. The worker stops publishing when demand expires or fresh capture stops.

## Acceptance still required

Verify cloud sign-in, admin setup, remote video from another network, person-to-incident evidence, acknowledgement/resolution, worker disconnect/reconnect, backend outage/outbox recovery, revoked operator access, daily cron authentication, and free-tier usage limits. Do not describe the cloud pilot as completed until these pass.
