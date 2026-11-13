# Perceptra stability test — PASS

Run: `116b1eba-052b-4c80-8359-9e0a96dc8ae4`.
Hardware: ONN 4K USB webcam, Intel i7-1355U, 32 GB RAM. Local Next.js/PostgreSQL/Python deployment.

- Started: **9 November 2026, 07:07:22 SAST**.
- Completed: **9 November 2026, 09:19:39 SAST**.
- Actual wall duration: **2 hours, 12 minutes, 17 seconds**.
- Samples: **1,440**.

| Measurement | Result |
|---|---:|
| Observed capture failures | 0 |
| Observed inference failures | 0 |
| Observed backend disconnections | 0 |
| Worker/health errors | 0 |
| Maximum queued deliveries | 0 |
| Median achieved capture FPS | 14.79 |
| Median achieved inference FPS | 2.98 |
| Median worker CPU, normalized over 12 logical processors | 11.8% |
| 95th-percentile worker CPU | 17.9% |
| Maximum worker CPU | 18.4% |
| 95th-percentile inference time | 423 ms |
| Peak worker process-tree resident memory | 423.5 MB |
| Worker resident memory, first / last sample | 416.6 / 149.2 MB |
| Peak web process-tree resident memory | 113.9 MB |
| PyTorch two-thread limit | Maintained throughout |

## Configuration and restoration

The test temporarily enabled monitoring with a 600-second loiter threshold. After completion, both PostgreSQL and worker health confirmed the original configuration: monitoring off, threshold 30 seconds, full-frame monitored area. The delivery queue was empty and the test lock was removed.

## Interpretation and limitations

The configured test targeted 7,200 seconds of five-second waits. Measurement overhead extended its wall duration; it did not reduce coverage below two hours. The sampler has since been corrected to use fixed deadlines, with regression tests preventing cumulative drift. This timing fix did not change the already-running test.

All observed freshness and connectivity checks passed. These are sampled health observations, not a guarantee that every video frame was delivered. Resident-memory values are Windows working-set measurements; a lower final reading alone is not proof that no allocation leak exists. This is a local single-camera stability result, not a multi-camera or public-deployment load test.

The earlier high-CPU attempt was stopped, corrected, and excluded. The passing run uses the verified two-thread PyTorch / one-thread OpenCV configuration.

## Raw evidence

Generated evidence is kept locally under ignored `perceptra-web/.runtime/`: `soak-result.json`, `soak-analysis.json`, `soak-status.json`, and `resource-sample.json`. No passwords or camera images are included in this summary.
