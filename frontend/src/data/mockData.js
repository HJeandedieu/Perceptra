export const severityColors = {
  Low: { badge: 'severity-badge-low', label: 'Low' },
  Medium: { badge: 'severity-badge-medium', label: 'Medium' },
  High: { badge: 'severity-badge-high', label: 'High' },
  Critical: { badge: 'severity-badge-critical', label: 'Critical' },
};

export const statCards = [
  {
    id: 'total',
    label: 'Total Detections',
    value: '12,847',
    change: '+12.5%',
    up: true,
    icon: 'activity',
  },
  {
    id: 'critical',
    label: 'Critical Alerts',
    value: '47',
    change: '-3.2%',
    up: false,
    icon: 'alert-triangle',
  },
  {
    id: 'confidence',
    label: 'Avg. Confidence',
    value: '94.3%',
    change: '+2.1%',
    up: true,
    icon: 'target',
  },
  {
    id: 'cameras',
    label: 'Active Cameras',
    value: '16',
    change: '0%',
    up: true,
    icon: 'camera',
  },
];

export const timelineData = [
  { date: 'Jun 01', incidents: 42, critical: 3 },
  { date: 'Jun 02', incidents: 38, critical: 2 },
  { date: 'Jun 03', incidents: 55, critical: 5 },
  { date: 'Jun 04', incidents: 48, critical: 4 },
  { date: 'Jun 05', incidents: 61, critical: 7 },
  { date: 'Jun 06', incidents: 44, critical: 3 },
  { date: 'Jun 07', incidents: 37, critical: 1 },
  { date: 'Jun 08', incidents: 52, critical: 6 },
  { date: 'Jun 09', incidents: 29, critical: 2 },
];

export const incidents = [
  { id: 'INC-2026-1842', timestamp: '2026-06-09 14:23:12', camera: 'CAM-07', label: 'Person', confidence: 0.97, severity: 'Low', status: 'Resolved' },
  { id: 'INC-2026-1841', timestamp: '2026-06-09 14:21:05', camera: 'CAM-12', label: 'Weapon', confidence: 0.94, severity: 'Critical', status: 'Active' },
  { id: 'INC-2026-1840', timestamp: '2026-06-09 14:18:44', camera: 'CAM-04', label: 'Aggressive Behavior', confidence: 0.88, severity: 'High', status: 'Investigating' },
  { id: 'INC-2026-1839', timestamp: '2026-06-09 14:15:30', camera: 'CAM-09', label: 'Loitering', confidence: 0.76, severity: 'Medium', status: 'Monitoring' },
  { id: 'INC-2026-1838', timestamp: '2026-06-09 14:12:18', camera: 'CAM-02', label: 'Person', confidence: 0.99, severity: 'Low', status: 'Resolved' },
  { id: 'INC-2026-1837', timestamp: '2026-06-09 14:08:55', camera: 'CAM-15', label: 'Restricted Area', confidence: 0.92, severity: 'High', status: 'Active' },
  { id: 'INC-2026-1836', timestamp: '2026-06-09 14:05:22', camera: 'CAM-01', label: 'Person', confidence: 0.95, severity: 'Low', status: 'Resolved' },
  { id: 'INC-2026-1835', timestamp: '2026-06-09 14:01:09', camera: 'CAM-08', label: 'Unusual Activity', confidence: 0.71, severity: 'Medium', status: 'Monitoring' },
  { id: 'INC-2026-1834', timestamp: '2026-06-09 13:58:33', camera: 'CAM-06', label: 'Weapon', confidence: 0.96, severity: 'Critical', status: 'Active' },
  { id: 'INC-2026-1833', timestamp: '2026-06-09 13:54:47', camera: 'CAM-11', label: 'Aggressive Behavior', confidence: 0.85, severity: 'High', status: 'Investigating' },
];

export const severityFilter = (severity) => {
  const map = {
    Low: 'severity-badge-low',
    Medium: 'severity-badge-medium',
    High: 'severity-badge-high',
    Critical: 'severity-badge-critical',
  };
  return map[severity] || 'severity-badge-low';
};
