# Perceptra acceptance status

Latest review: 9 November 2026. Local Windows / ONN USB single-camera MVP; Next.js + PostgreSQL + Python worker.

| Check | Result |
|---|---|
| Production build / TypeScript | Passed on latest application build |
| Database-backed HTTP integration | 36 checks passed |
| HTTP access-control smoke suite | 24 checks passed |
| Live camera detection | Actual ONN person detection verified |
| Live incident creation and escalation | Same incident created medium, escalated high at 20 seconds; JPEG persisted |
| Operator workflow | Real controlled-test incident acknowledged and resolved through Chrome; explicit QA note retained |
| Desktop browser | Login, overview/live view, settings, themes, saved preferences, logout verified |
| Mobile browser | 390x844 review completed; sign-out fixed and verified |
| Notification policy | Four regression tests passed; acknowledgement no longer alerts, escalation remains eligible, closed banners clear |
| Delivery outage / worker restart | Actual bridge code retried a persisted SQLite delivery with the same ID after a simulated backend failure |
| Retention | Expired closed records/evidence/activity deleted; unresolved and recent resolved records preserved |
| Named camera protection | Unit-tested missing-device refusal and index renumbering; actual ONN absence left capture offline while HP moved to index 0 |
| Reconnect without restart | Passed: reconnected ONN returned fresh capture on the existing worker, without restarting services |
| Short AI resource sample | 30 seconds passed; capture/inference online throughout, queue 0; worker process-tree RSS peak about 420 MB |
| Two-hour AI-enabled soak | Passed: 1,440 healthy samples; actual wall duration 2h 12m 17s; settings restoration verified |
| Audible/desktop alert delivery | Controls and persistence verified; actual sound/OS delivery not yet witnessed |

## Operational safeguards

Windows USB capture uses DirectShow and a configured device name (default `onn 4K Webcam`); it must not silently substitute the integrated camera. Monitoring settings are restored after test runners. The station is loopback-only. Temporary test accounts are removed after verification, preserving incident history.

The physical-test incident remains saved with a resolution note identifying it as a controlled acceptance test. No production-readiness claim is made before the remaining hardware and sustained-run checks.

## CPU issue found during soak startup

The first long-run attempt was stopped early after worker CPU usage reached roughly 60% of the 12-logical-processor machine. Inspection of the installed Ultralytics code showed CPU predictor setup resetting torch.set_num_threads to up to eight threads. That override bypassed the caller's initial two-thread setting.

The detector now reapplies its configured thread limit in the prediction-start callback after backend initialization. OpenCV is limited to one thread; PyTorch inter-op work is limited to one. The worker reports actual capture/inference FPS and effective thread counts.

A corrected 30-second check passed with PyTorch=2, OpenCV=1, achieved capture about 14.8 FPS, inference about 3 FPS, worker RSS around 418 MB, and worker CPU around 11% of machine capacity. A regression test reproduces the eight-thread override and verifies restoration of the configured limit. All six detector tests passed.

A new uninterrupted 7200-second test was started after that fix. The run-status, periodic telemetry, and final result are stored under ignored .runtime. The runner restores the original camera settings on completion and marks failures explicitly. The early interrupted attempt and the 30-second check are not counted as a two-hour pass.

## Final stability result — 9 November 2026

Completed at 09:19:39 SAST. All 1,440 observed samples had capture, inference, and backend connectivity online; no worker errors or queued deliveries were observed. Median achieved rates were 14.79 capture FPS and 2.98 inference FPS. Median worker CPU was 11.8% of machine capacity (peak 18.4%). Worker resident memory peaked at 423.5 MB; web resident memory peaked at 113.9 MB.

The old sampler added measurement overhead after each five-second wait, extending actual wall duration to 2h 12m 17s. This does not shorten the test; future runs use fixed sampling deadlines and have two regression tests for timing drift. The result is a pass for this local single-camera configuration, not a claim that every frame was independently checked or that larger deployments are qualified.

Database and worker settings restoration were both verified: monitoring disabled, 30-second threshold, full-frame zone, worker applied version 16, pending queue 0. The test lock was removed. See SOAK_TEST_REPORT.md for the complete measured summary.
