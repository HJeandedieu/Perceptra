// Detections API routes
import express from 'express';
import { broadcastDetection } from '../index.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Mock detections storage
let detections = [];

// Validation helper
const validateDetection = (data) => {
  const errors = [];
  const { timestamp, label, confidence, severity, camera_id } = data;

  if (!timestamp) errors.push('Timestamp is required');
  if (!label) errors.push('Label is required');
  if (confidence === undefined || confidence === null) errors.push('Confidence is required');
  else if (confidence < 0 || confidence > 1) errors.push('Confidence must be between 0 and 1');
  if (!severity) errors.push('Severity is required');
  else if (!['Low', 'Medium', 'High', 'Critical'].includes(severity)) errors.push('Severity must be Low, Medium, High, or Critical');
  if (!camera_id) errors.push('Camera ID is required');

  return errors;
};

// POST /api/detections - Receive detection from AI engine
router.post('/', (req, res) => {
  const errors = validateDetection(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { timestamp, label, confidence, severity, camera_id } = req.body;

  const detection = {
    id: detections.length + 1,
    timestamp,
    label,
    confidence,
    severity,
    camera_id,
    created_at: new Date().toISOString()
  };

  detections.push(detection);

  // Broadcast to connected dashboards via WebSocket
  broadcastDetection(detection);

  res.status(201).json(detection);
});

// GET /api/detections - Get list of detections (protected)
router.get('/', authenticateToken, (req, res) => {
  const { from, to, severity, page = 1, limit = 20 } = req.query;
  
  let filteredDetections = [...detections];
  
  if (severity) {
    filteredDetections = filteredDetections.filter(d => d.severity === severity);
  }

  const startIndex = (page - 1) * limit;
  const paginatedDetections = filteredDetections.slice(startIndex, startIndex + parseInt(limit));

  res.json({
    data: paginatedDetections,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredDetections.length,
      totalPages: Math.ceil(filteredDetections.length / limit)
    }
  });
});

// GET /api/detections/:id - Get single detection (protected)
router.get('/:id', authenticateToken, (req, res) => {
  const detection = detections.find(d => d.id === parseInt(req.params.id));
  if (!detection) {
    return res.status(404).json({ error: 'Detection not found' });
  }
  res.json(detection);
});

// PUT /api/detections/:id - Update detection (protected)
router.put('/:id', authenticateToken, (req, res) => {
  const detectionId = parseInt(req.params.id);
  const detectionIndex = detections.findIndex(d => d.id === detectionId);
  
  if (detectionIndex === -1) {
    return res.status(404).json({ error: 'Detection not found' });
  }

  const errors = validateDetection(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  detections[detectionIndex] = {
    ...detections[detectionIndex],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  res.json(detections[detectionIndex]);
});

// DELETE /api/detections/:id - Delete detection (protected)
router.delete('/:id', authenticateToken, (req, res) => {
  const detectionId = parseInt(req.params.id);
  const detectionIndex = detections.findIndex(d => d.id === detectionId);
  
  if (detectionIndex === -1) {
    return res.status(404).json({ error: 'Detection not found' });
  }

  detections.splice(detectionIndex, 1);
  res.json({ message: 'Detection deleted successfully' });
});

export default router;
