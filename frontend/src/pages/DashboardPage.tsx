import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ShieldAlert, CheckCircle2, Clock, AlertTriangle,
  ArrowRight, FileText, BarChart2, PieChart as PieChartIcon,
  Plus, ExternalLink, RefreshCw
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { api } from '../services/api';
import { DashboardStatsResponse } from '../types';
import { RiskBadge } from '../components/RiskBadge';

const CATEGORY_COLORS: Record<string, string> = {
  'Critical Risk': '#f43f5e', // rose
  'High Risk': '#f97316',     // orange
  'Medium Risk': '#eab308',   // amber
  'Low Risk': '#10b981'       // emerald
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
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-slate-400">Loading security analytics...</p>
      </div>
    );
  }

  const pieData = stats
    ? Object.entries(stats.category_counts)
        .filter(([_, count]) => count > 0)
        .map(([category, count]) => ({
          name: category,
          value: count,
          color: CATEGORY_COLORS[category] || '#3b82f6'
        }))
    : [];

  const hasData = stats && stats.total_analyses > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs">
            <Activity className="w-4 h-4" />
            <span>OPERATIONAL METRICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Cybersecurity Dashboard</h1>
          <p className="text-xs text-slate-400">Telemetry and social engineering trends across analyzed voice recordings</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStats}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/workspace"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition flex items-center space-x-2 shadow-cyber-glow"
          >
            <Plus className="w-4 h-4" />
            <span>New Audio Analysis</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-lg flex items-start space-x-2 text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Total Analyzed</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {stats?.total_analyses || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Success: {stats?.success_count || 0} &middot; Failures: {stats?.failure_count || 0}
          </div>
        </div>

        <div className="cyber-card p-5 space-y-2 border-rose-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Critical Threat Calls</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-rose-400">
            {stats?.category_counts['Critical Risk'] || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Digital Arrest / OTP extortion
          </div>
        </div>

        <div className="cyber-card p-5 space-y-2 border-orange-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">High Risk Attempts</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-orange-400">
            {stats?.category_counts['High Risk'] || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            AnyDesk / Impersonation / Threats
          </div>
        </div>

        <div className="cyber-card p-5 space-y-2 border-emerald-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Benign Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {stats?.category_counts['Low Risk'] || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Zero threat indicators detected
          </div>
        </div>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="cyber-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Activity className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200">No Analysis Telemetry Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't performed any audio analyses yet. Launch the workspace to record or upload a voice recording.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/workspace"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold shadow-cyber-glow transition"
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
            <div className="cyber-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                  <PieChartIcon className="w-4 h-4" />
                  <span>RISK CATEGORY DISTRIBUTION</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{stats?.total_analyses} Total Cases</span>
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
                        backgroundColor: '#0a0e17',
                        borderColor: '#1e293b',
                        borderRadius: '0.5rem',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                {Object.entries(stats?.category_counts || {}).map(([cat, count]) => (
                  <div key={cat} className="flex items-center space-x-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                    ></span>
                    <span className="text-slate-400 truncate">{cat}:</span>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Attack Vectors (Bar Chart) */}
            <div className="cyber-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                  <BarChart2 className="w-4 h-4" />
                  <span>COMMONLY DETECTED SCAM VECTORS</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Frequency Count</span>
              </div>

              <div className="h-64">
                {stats?.top_indicators && stats.top_indicators.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.top_indicators}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" stroke="#64748b" fontSize={11} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={10}
                        width={130}
                        tickFormatter={(val) => val.length > 18 ? val.slice(0, 18) + '...' : val}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0a0e17',
                          borderColor: '#1e293b',
                          borderRadius: '0.5rem',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                    No scam indicators logged in active database records.
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 border-t border-slate-800 pt-2 font-mono">
                Identified through deterministic rule grammars and acoustic feature extraction.
              </p>
            </div>
          </div>

          {/* Timeline Chart */}
          {stats?.timeline && stats.timeline.length > 1 && (
            <div className="cyber-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                  <Clock className="w-4 h-4" />
                  <span>SCAM RISK SCORE TIMELINE</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Recent Incident Flow</span>
              </div>

              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.timeline}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0e17',
                        borderColor: '#1e293b',
                        borderRadius: '0.5rem',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#06b6d4"
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
          <div className="cyber-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Recent Analyses</h2>
              <Link to="/history" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1">
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="pb-3 font-medium">Recording / Source</th>
                    <th className="pb-3 font-medium">Severity</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Indicators</th>
                    <th className="pb-3 font-medium">Analyzed</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {stats?.recent_analyses.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 font-mono font-medium text-white truncate max-w-xs">
                        {a.original_filename}
                      </td>
                      <td className="py-3">
                        <RiskBadge category={a.scam_risk_category} size="sm" />
                      </td>
                      <td className="py-3 font-mono font-bold">
                        {a.scam_risk_score.toFixed(1)}/100
                      </td>
                      <td className="py-3 font-mono text-slate-400">
                        {a.detected_indicators.length} signs
                      </td>
                      <td className="py-3 text-slate-400 font-mono">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/analyses/${a.id}`}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-black text-slate-300 transition text-[11px] font-mono"
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
