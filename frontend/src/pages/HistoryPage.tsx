import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History as HistoryIcon, Search, Trash2, Download,
  AlertTriangle, ArrowRight, ChevronLeft, ChevronRight,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { AnalysisResponse, RiskCategory } from '../types';
import { RiskBadge } from '../components/RiskBadge';

export const HistoryPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | ''>('');
  const [error, setError] = useState<string | null>(null);

  // Clear all confirmation modal
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAnalyses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAnalyses(
        page,
        10,
        selectedCategory || undefined,
        search || undefined
      );
      setAnalyses(data.items);
      setTotalPages(data.total_pages);
      setTotalCount(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAnalyses();
  };

  const handleDeleteOne = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
    setDeletingId(id);
    try {
      await api.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.deleteAllAnalyses();
      setAnalyses([]);
      setTotalCount(0);
      setTotalPages(1);
      setShowClearModal(false);
    } catch (err: any) {
      alert(`Failed to clear history: ${err.message}`);
    }
  };

  const handleDownloadPdf = async (id: string, filename: string) => {
    try {
      await api.downloadPdfReport(id, `VoiceShield_Report_${filename}.pdf`);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-1">
            <HistoryIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>INCIDENT ARCHIVES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Analysis History & Logs</h1>
          <p className="text-xs text-slate-500">Search, filter, and inspect past audio and transcript forensics reports</p>
        </div>

        {totalCount > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition flex items-center space-x-2 shadow-soft-sm"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Purge All History</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-soft">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by filename or spoken keywords (e.g. 'CBI', 'OTP', 'AnyDesk')..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value as RiskCategory | '');
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="">All Risk Categories</option>
                <option value="Critical Risk">Critical Risk</option>
                <option value="High Risk">High Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="Low Risk">Low Risk</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-soft-sm"
            >
              Filter
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-medium">
          <span>Found {totalCount} total logged report(s)</span>
          <span>Page {page} of {totalPages}</span>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500">Loading incident records...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-soft">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-900">No Analysis Reports Found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || selectedCategory
              ? 'No reports match your current search query or risk filter.'
              : 'You have not performed any voice scam analyses yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-soft-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <RiskBadge category={a.scam_risk_category} size="sm" />
                  <span className="text-sm font-bold text-slate-900 truncate max-w-md">
                    {a.original_filename}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">#{a.id.slice(0, 8)}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 italic font-sans max-w-2xl">
                  "{a.transcript}"
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>Score: <strong className="text-slate-800">{a.scam_risk_score.toFixed(1)}/100</strong></span>
                  <span>Signs: <strong className="text-slate-800">{a.detected_indicators.length}</strong></span>
                  <span>Duration: {a.audio_duration_seconds ? `${a.audio_duration_seconds.toFixed(1)}s` : 'Text Only'}</span>
                  <span>Lang: {a.detected_language.toUpperCase()}</span>
                  <span>Date: {new Date(a.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleDownloadPdf(a.id, a.original_filename)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition shadow-soft-sm"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteOne(a.id)}
                  disabled={deletingId === a.id}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition disabled:opacity-50"
                  title="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  to={`/analyses/${a.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center space-x-1 shadow-soft hover:shadow-soft-md"
                >
                  <span>Open Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 disabled:opacity-40 flex items-center space-x-1 shadow-soft-sm hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-medium text-slate-600">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 disabled:opacity-40 flex items-center space-x-1 shadow-soft-sm hover:bg-slate-50"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-soft-lg">
            <div className="flex items-center space-x-2 text-rose-600 font-bold">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Confirm Forensic History Purge</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete all {totalCount} analysis reports? This action cannot be undone and will remove all associated telemetry records.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-soft"
              >
                Yes, Purge All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
