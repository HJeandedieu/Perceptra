# Perceptra local operator guide

## Start and sign in
Run `./scripts/Start-Perceptra.ps1` from perceptra-web. Open http://127.0.0.1:5000/login in Chrome. Use your administrator-provided account. Do not run legacy main.py alongside worker.py. Local monitoring requires this PC to remain awake and the USB camera to remain attached.

## Camera setup
Open Station settings. Select the camera index, enter its name/location, and draw a monitored rectangle or enter coordinates. Keep the area inside the visible scene. Set the loiter threshold between 10 and 600 seconds. Enable monitoring, save, and wait for worker confirmation. Configuration changes reset dwell tracking.

Live monitoring reports capture, inference, backend connection, queued deliveries, and applied configuration version separately. Video appearing alone does not prove inference is running. Inference should read online when monitoring is enabled and fresh frames are processed. Camera offline hides stale video.

## Review incidents
A person remaining inside the monitored area reaches medium severity at the configured threshold and high at twice that duration. Registered-face matching and weapon detection are not enabled. These are operator-review alerts, not proof of wrongdoing. Simple tracking may lose identity during occlusion or when people cross.

Open an incident to view the snapshot and reason. Acknowledge to take responsibility. Resolve with an outcome and note; choose False alarm for an incorrect alert. Resolution is recorded in the activity history. If the worker is offline, pending deliveries persist locally and retry when the backend returns.

## Notifications
Save your account-specific preferences in Station settings. In-app banners work while the workspace is open. For desktop notifications, click Browser alerts and grant browser permission, then enable browser notifications in preferences. For sound, click Enable audio in this browser session and enable alert sound in preferences. Browser/OS policy can still suppress notifications or audio. External SMS/email is deferred.

## Reports and retention
Analytics uses saved incidents. Choose UTC dates and export CSV; each report supports up to 10,000 incidents and a 366-day range. Resolved/false-alarm incidents older than seven days are automatically removed at server startup and hourly while running, including snapshots and activity. Unresolved incidents are retained. Export records you need before expiry.

## Accounts and shutdown
Administrators manage operators in Team & access. Share initial passwords privately. Removing an operator permanently removes access while preserving incident history. Administrator accounts are protected from removal in that interface.

Run `./scripts/Stop-Perceptra.ps1` to stop the station. PostgreSQL can remain running; `npm run db:stop` stops only the isolated project cluster. Logs and test telemetry are under ignored .runtime; pending deliveries are in the Python service data directory.

## Acceptance walkthrough
1. Check capture and inference are online.
2. Stand in the monitored area beyond the threshold, then confirm the snapshot and medium incident.
3. Continue to twice the threshold and confirm escalation of the same incident.
4. Acknowledge and resolve with a note; inspect reports and CSV.
5. Unplug/reconnect the webcam and confirm stale video is hidden and capture recovers.
6. Complete a two-hour AI-enabled run and review resource/freshness/queue measurements. A brief smoke test is not equivalent to this test.
