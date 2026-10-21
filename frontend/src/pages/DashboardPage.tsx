import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ShieldAlert, CheckCircle2, Clock, AlertTriangle,
  ArrowRight, FileText, BarChart2, PieChart as PieChartIcon,
  Plus, RefreshCw
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { api } from '../services/api';
import { DashboardStatsResponse } from '../types';
import { RiskBadge } from '../components/RiskBadge';

const CATEGORY_COLORS: Record<string, string> = {
  'Critical Risk': '#e11d48', // rose-600
  'High Risk': '#ea580c',     // orange-600
  'Medium Risk': '#d97706',   // amber-600
  'Low Risk': '#16a34a'       // emerald-600
};

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-medium text-slate-500">Loading security analytics...</p>
      </div>
    );
  }

  const pieData = stats
    ? Object.entries(stats.category_counts)
        .filter(([_, count]) => count > 0)
        .map(([category, count]) => ({
          name: category,
          value: count,
          color: CATEGORY_COLORS[category] || '#2563eb'
        }))
    : [];

  const hasData = stats && stats.total_analyses > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-1">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>OPERATIONAL METRICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Cybersecurity Dashboard</h1>
          <p className="text-xs text-slate-500">Telemetry and social engineering trends across analyzed voice recordings</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 transition shadow-soft-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/workspace"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center space-x-2 shadow-soft hover:shadow-soft-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Audio Analysis</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Total Analyzed</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900">
            {stats?.total_analyses || 0}
          </div>
          <div className="text-xs text-slate-500">
            Success: {stats?.success_count || 0} &middot; Failures: {stats?.failure_count || 0}
          </div>
        </div>

        <div className="bg-white border border-rose-200 rounded-2xl p-6 space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-xs text-rose-600 font-semibold uppercase tracking-wider">
            <span>Critical Threat Calls</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-rose-600">
            {stats?.category_counts['Critical Risk'] || 0}
          </div>
          <div className="text-xs text-slate-500">
            Digital Arrest / OTP extortion
          </div>
        </div>

        <div className="bg-white border border-orange-200 rounded-2xl p-6 space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-xs text-orange-600 font-semibold uppercase tracking-wider">
            <span>High Risk Attempts</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-orange-600">
            {stats?.category_counts['High Risk'] || 0}
          </div>
          <div className="text-xs text-slate-500">
            AnyDesk / Impersonation / Threats
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-6 space-y-2 shadow-soft">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold uppercase tracking-wider">
            <span>Benign Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-700">
            {stats?.category_counts['Low Risk'] || 0}
          </div>
          <div className="text-xs text-slate-500">
            Zero threat indicators detected
          </div>
        </div>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
            <Activity className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Analysis Telemetry Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't performed any audio analyses yet. Launch the workspace to record or upload a voice recording.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/workspace"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-soft transition"
            >
              <span>Analyze Your First Audio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Category Distribution (Donut Chart) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <PieChartIcon className="w-4 h-4 text-blue-600" />
                  <span>RISK CATEGORY DISTRIBUTION</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">{stats?.total_analyses} Total Cases</span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        fontSize: '12px',
                        color: '#0f172a'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
                {Object.entries(stats?.category_counts || {}).map(([cat, count]) => (
                  <div key={cat} className="flex items-center space-x-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                    ></span>
                    <span className="text-slate-500 truncate">{cat}:</span>
                    <span className="text-slate-900 font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Attack Vectors (Bar Chart) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  <span>COMMONLY DETECTED SCAM VECTORS</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Frequency Count</span>
              </div>

              <div className="h-64">
                {stats?.top_indicators && stats.top_indicators.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.top_indicators}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={10}
                        width={130}
                        tickFormatter={(val) => val.length > 18 ? val.slice(0, 18) + '...' : val}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#e2e8f0',
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                          fontSize: '12px',
                          color: '#0f172a'
                        }}
                      />
                      <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                    No scam indicators logged in active database records.
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 border-t border-slate-100 pt-2 font-medium">
                Identified through deterministic rule grammars and acoustic feature extraction.
              </p>
            </div>
          </div>

          {/* Timeline Chart */}
          {stats?.timeline && stats.timeline.length > 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>SCAM RISK SCORE TIMELINE</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Recent Incident Flow</span>
              </div>

              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.timeline}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        fontSize: '12px',
                        color: '#0f172a'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#scoreGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent Analysis Activity Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Recent Analyses</h2>
              <Link to="/history" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3">Recording / Source</th>
                    <th className="pb-3">Severity</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Indicators</th>
                    <th className="pb-3">Analyzed</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {stats?.recent_analyses.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-medium text-slate-900 truncate max-w-xs">
                        {a.original_filename}
                      </td>
                      <td className="py-3">
                        <RiskBadge category={a.scam_risk_category} size="sm" />
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-900">
                        {a.scam_risk_score.toFixed(1)}/100
                      </td>
                      <td className="py-3 font-medium text-slate-600">
                        {a.detected_indicators.length} signs
                      </td>
                      <td className="py-3 text-slate-500">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/analyses/${a.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition text-xs font-semibold"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
