// Reports API routes (for Analytics page)
import express from 'express';

const router = express.Router();

// GET /api/reports - Get aggregated stats
router.get('/', (req, res) => {
  const { range = '7d' } = req.query;

  // Mock aggregated stats
  res.json({
    total_detections: 142,
    severity_breakdown: {
      Low: 85,
      Medium: 42,
      High: 12,
      Critical: 3
    },
    detections_over_time: [
      { date: '2026-06-04', count: 18 },
      { date: '2026-06-05', count: 24 },
      { date: '2026-06-06', count: 31 },
      { date: '2026-06-07', count: 27 },
      { date: '2026-06-08', count: 19 },
      { date: '2026-06-09', count: 14 },
      { date: '2026-06-10', count: 9 }
    ],
    top_labels: ['person', 'car', 'truck', 'dog', 'bicycle']
  });
});

export default router;
