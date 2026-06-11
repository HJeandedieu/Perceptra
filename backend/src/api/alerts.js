// Alerts API routes
import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Mock alerts storage
let alerts = [];

// Validation helper
const validateAlert = (data) => {
  const errors = [];
  const { detection_event_id, severity } = data;

  if (!detection_event_id) errors.push('Detection event ID is required');
  if (!severity) errors.push('Severity is required');
  else if (!['Low', 'Medium', 'High', 'Critical'].includes(severity)) errors.push('Severity must be Low, Medium, High, or Critical');

  return errors;
};

// GET /api/alerts - Get list of alerts (protected)
router.get('/', authenticateToken, (req, res) => {
  const { severity, status } = req.query;
  
  let filteredAlerts = [...alerts];
  
  if (severity) {
    filteredAlerts = filteredAlerts.filter(a => a.severity === severity);
  }
  if (status) {
    filteredAlerts = filteredAlerts.filter(a => a.status === status);
  }

  res.json(filteredAlerts);
});

// GET /api/alerts/:id - Get single alert (protected)
router.get('/:id', authenticateToken, (req, res) => {
  const alert = alerts.find(a => a.id === parseInt(req.params.id));
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json(alert);
});

// POST /api/alerts - Create alert (protected)
router.post('/', authenticateToken, (req, res) => {
  const errors = validateAlert(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { detection_event_id, severity } = req.body;

  const alert = {
    id: alerts.length + 1,
    detection_event_id,
    severity,
    status: 'active',
    dismissed_at: null,
    created_at: new Date().toISOString()
  };

  alerts.push(alert);
  res.status(201).json(alert);
});

// PATCH /api/alerts/:id/dismiss - Dismiss an alert (protected)
router.patch('/:id/dismiss', authenticateToken, (req, res) => {
  const alertId = parseInt(req.params.id);
  const alert = alerts.find(a => a.id === alertId);

  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  alert.status = 'dismissed';
  alert.dismissed_at = new Date().toISOString();

  res.json(alert);
});

// DELETE /api/alerts/:id - Delete alert (protected)
router.delete('/:id', authenticateToken, (req, res) => {
  const alertId = parseInt(req.params.id);
  const alertIndex = alerts.findIndex(a => a.id === alertId);
  
  if (alertIndex === -1) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  alerts.splice(alertIndex, 1);
  res.json({ message: 'Alert deleted successfully' });
});

export default router;
