import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Target,
  Camera,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { statCards, timelineData, incidents } from '../data/mockData';

const iconMap = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  target: Target,
  camera: Camera,
};

function StatCard({ item }) {
  const Icon = iconMap[item.icon] || Activity;
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{item.label}</span>
        <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent-400" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{item.value}</div>
      <div className="flex items-center gap-1 mt-1">
        {item.up ? (
          <TrendingUp className="w-3.5 h-3.5 text-perceptra-low" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-perceptra-high" />
        )}
        <span className={`text-xs font-medium ${item.up ? 'text-perceptra-low' : 'text-perceptra-high'}`}>
          {item.change}
        </span>
        <span className="text-xs text-gray-600">vs last period</span>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }) {
  const styles = {
    Low: 'bg-perceptra-low-bg text-perceptra-low',
    Medium: 'bg-perceptra-medium-bg text-perceptra-medium',
    High: 'bg-perceptra-high-bg text-perceptra-high',
    Critical: 'bg-perceptra-critical-bg text-perceptra-critical',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles[severity] || styles.Low}`}>
      {severity}
    </span>
  );
}

export default function Analytics() {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-sm border-b border-surface-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Analytics & Reports</h1>
            <p className="text-xs text-gray-500 mt-0.5">Detection statistics and incident history</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-1 bg-surface-800 rounded-lg p-1 border border-surface-700">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    range === '7d'
                      ? 'bg-accent-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            {/* Export Button */}
            <button className="flex items-center gap-2 px-3 py-2 bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-lg text-xs font-medium text-gray-300 transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </div>

        {/* Chart Section */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Detection Timeline</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-perceptra-low" />
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-perceptra-critical" />
                <span className="text-xs text-gray-500">Critical</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22252f" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#191b24',
                    border: '1px solid #2c2f3a',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="incidents" fill="#22C55E" radius={[4, 4, 0, 0]} opacity={0.8} maxBarSize={32} />
                <Bar dataKey="critical" fill="#7C3AED" radius={[4, 4, 0, 0]} opacity={0.9} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident History Table */}
        <div className="stat-card !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-700 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Incident History</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search incidents..."
                className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-accent-500/50"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700">
                  <th className="table-header text-left px-5 py-3">Incident ID</th>
                  <th className="table-header text-left px-5 py-3">Timestamp</th>
                  <th className="table-header text-left px-5 py-3">Camera</th>
                  <th className="table-header text-left px-5 py-3">Label</th>
                  <th className="table-header text-left px-5 py-3">Confidence</th>
                  <th className="table-header text-left px-5 py-3">Severity</th>
                  <th className="table-header text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800">
                {incidents.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-surface-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-gray-300">{inc.id}</td>
                    <td className="px-5 py-3 text-gray-400">{inc.timestamp}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-300">{inc.camera}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-300">{inc.label}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-400"
                            style={{ width: `${Math.round(inc.confidence * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round(inc.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <SeverityBadge severity={inc.severity} />
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                          inc.status === 'Resolved'
                            ? 'bg-perceptra-low-bg text-perceptra-low'
                            : inc.status === 'Active'
                              ? 'bg-perceptra-critical-bg text-perceptra-critical'
                              : inc.status === 'Investigating'
                                ? 'bg-perceptra-high-bg text-perceptra-high'
                                : 'bg-perceptra-medium-bg text-perceptra-medium'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inc.status === 'Resolved'
                              ? 'bg-perceptra-low'
                              : inc.status === 'Active'
                                ? 'bg-perceptra-critical animate-pulse'
                                : inc.status === 'Investigating'
                                  ? 'bg-perceptra-high'
                                  : 'bg-perceptra-medium'
                          }`}
                        />
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Table footer with pagination */}
          <div className="px-5 py-3 border-t border-surface-700 flex items-center justify-between">
            <span className="text-xs text-gray-600">Showing 10 of 12,847 incidents</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-surface-700 rounded transition-colors">
                Previous
              </button>
              <button className="px-2.5 py-1 text-xs text-white bg-accent-500 rounded">1</button>
              <button className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-surface-700 rounded transition-colors">
                2
              </button>
              <button className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-surface-700 rounded transition-colors">
                3
              </button>
              <span className="px-1 text-xs text-gray-700">...</span>
              <button className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-surface-700 rounded transition-colors">
                1,285
              </button>
              <button className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-surface-700 rounded transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
