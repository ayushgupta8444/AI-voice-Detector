import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert, ShieldCheck, Download, Copy, Check, ArrowLeft,
  FileText, Activity, AlertTriangle, Layers, PhoneCall, ExternalLink,
  Info, Cpu, Clock, HardDrive
} from 'lucide-react';
import { api } from '../services/api';
import { AnalysisResponse } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { TranscriptViewer } from '../components/TranscriptViewer';
import { CybercrimeHelpline } from '../components/CybercrimeHelpline';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(location.state?.result || null);
  const [loading, setLoading] = useState<boolean>(!analysis);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (!analysis && id) {
      async function fetchAnalysis() {
        try {
          const res = await api.getAnalysis(id!);
          setAnalysis(res);
        } catch (err: any) {
          setError(err.message || 'Failed to load analysis report.');
        } finally {
          setLoading(false);
        }
      }
      fetchAnalysis();
    }
  }, [id, analysis]);

  const handleCopyJson = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!analysis) return;
    setDownloadingPdf(true);
    try {
      await api.downloadPdfReport(analysis.id, `VoiceShield_Report_${analysis.id.slice(0, 8)}.pdf`);
    } catch (err: any) {
      alert(`PDF download failed: ${err.message}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono text-slate-400">Loading incident forensics record...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Report Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'The requested forensic analysis does not exist.'}</p>
        <Link
          to="/workspace"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workspace</span>
        </Link>
      </div>
    );
  }

  const score = analysis.scam_risk_score;
  const isHighRisk = score >= 60;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/workspace')}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Incident Forensics Report</h1>
              <span className="text-xs font-mono text-slate-400">#{analysis.id.slice(0, 8)}</span>
            </div>
            <p className="text-xs text-slate-400">
              Analyzed on {new Date(analysis.created_at).toLocaleString()} &middot; {analysis.original_filename}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyJson}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition flex items-center space-x-1.5 shadow-cyber-glow disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Exporting PDF...' : 'Download Incident PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Score & Risk Overview Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Risk Badge */}
        <div className={`cyber-card p-6 flex flex-col justify-between space-y-4 ${
          score >= 85 ? 'border-rose-700/80' : score >= 60 ? 'border-orange-700/80' : score >= 30 ? 'border-amber-700/80' : 'border-emerald-700/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Overall Scam Threat</span>
            <RiskBadge category={analysis.scam_risk_category} size="md" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className={`text-5xl font-extrabold font-mono tracking-tight ${
              score >= 85 ? 'text-rose-400' : score >= 60 ? 'text-orange-400' : score >= 30 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {score.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-500">/ 100</span>
          </div>

          <div className="space-y-1 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Threat Category:</span>
              <span className="text-slate-200 font-medium">{analysis.scam_risk_category}</span>
            </div>
            <div className="flex justify-between">
              <span>Warning Signs Detected:</span>
              <span className="text-slate-200 font-medium">{analysis.detected_indicators.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Source Type:</span>
              <span className="text-slate-200 font-mono capitalize">{analysis.transcript_source.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Audio / Session Metadata */}
        <div className="cyber-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Activity className="w-4 h-4" />
            <span>RECORDING METADATA</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">Duration</span>
              <span className="font-mono text-slate-200 font-semibold">
                {analysis.audio_duration_seconds ? `${analysis.audio_duration_seconds.toFixed(1)}s` : 'Text Only'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">Language</span>
              <span className="font-mono text-slate-200 font-semibold uppercase">
                {analysis.detected_language}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">STT Provider</span>
              <span className="font-mono text-slate-200 text-[11px] truncate block">
                {analysis.transcription_model}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">Rule Engine</span>
              <span className="font-mono text-slate-200 text-[11px] truncate block">
                {analysis.detection_method_version}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Audio Retention:</span>
            <span className="font-mono text-emerald-400">Scrubbed (Zero Retention)</span>
          </div>
        </div>

        {/* Quick Actions Guidance */}
        <div className="cyber-card p-6 flex flex-col justify-between space-y-4 bg-slate-900/60">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <ShieldAlert className="w-4 h-4" />
            <span>IMMEDIATE DEFENSIVE ACTION</span>
          </div>

          <div className="space-y-2">
            {isHighRisk ? (
              <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-lg text-xs text-rose-200 space-y-1">
                <span className="font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>SUSPECTED HIGH-RISK SCAM CALL</span>
                </span>
                <p>Do NOT share OTPs, do NOT transfer money, and do NOT install AnyDesk/TeamViewer.</p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-lg text-xs text-emerald-200 space-y-1">
                <span className="font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LOW THREAT PROFILE DETECTED</span>
                </span>
                <p>No acute extortion or credential harvesting patterns identified in this excerpt.</p>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400">
            Emergency helpline: <a href="tel:1930" className="text-cyan-400 font-mono font-bold hover:underline">Call 1930</a> (24x7)
          </div>
        </div>
      </div>

      {/* Transcript with Evidence Highlighting */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Spoken Transcript & Highlighted Evidence</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click any highlighted phrase to view threat rationale
          </span>
        </div>

        <TranscriptViewer
          transcript={analysis.transcript}
          indicators={analysis.detected_indicators}
        />
      </div>

      {/* Detected Scam Indicators Details */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Detected Scam Indicators ({analysis.detected_indicators.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Documented Rule Grammars
          </span>
        </div>

        {analysis.detected_indicators.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm italic">
            No known scam or social engineering indicators were detected in this transcript.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.detected_indicators.map((ind, i) => (
              <div
                key={ind.id + i}
                className={`p-4 rounded-lg bg-slate-900/80 border space-y-2.5 transition ${
                  ind.severity === 'critical'
                    ? 'border-rose-900/70 hover:border-rose-600'
                    : ind.severity === 'high'
                    ? 'border-orange-900/70 hover:border-orange-600'
                    : 'border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-100">{ind.name}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                    ind.severity === 'critical'
                      ? 'bg-rose-950 text-rose-400 border-rose-800'
                      : ind.severity === 'high'
                      ? 'bg-orange-950 text-orange-400 border-orange-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    {ind.severity}
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-cyan-300">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Matched Excerpt:</span>
                  "{ind.excerpt}"
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {ind.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experimental Acoustic Forensics (Separate Module according to Section 2.D) */}
      <div className="cyber-card p-6 space-y-4 border-indigo-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Voice Authenticity & Acoustic Forensics</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
              EXPERIMENTAL
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Signal Processing Forensics
          </span>
        </div>

        {analysis.authenticity ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-xs block">Acoustic Model</span>
                <span className="text-xs font-mono text-slate-200 font-semibold block">
                  {analysis.authenticity.model_name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">v{analysis.authenticity.model_version}</span>
              </div>

              <div className="p-3.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-xs block">Synthetic Anomaly Index</span>
                <span className="text-lg font-mono text-indigo-300 font-bold block">
                  {analysis.authenticity.estimated_risk_score !== null && analysis.authenticity.estimated_risk_score !== undefined
                    ? `${analysis.authenticity.estimated_risk_score.toFixed(1)}%`
                    : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-400">Experimental signal estimate</span>
              </div>

              <div className="p-3.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-xs block">High-Freq Rolloff Boundary</span>
                <span className="text-sm font-mono text-slate-200 font-semibold block">
                  {analysis.authenticity.acoustic_metrics?.spectral_rolloff_hz
                    ? `${analysis.authenticity.acoustic_metrics.spectral_rolloff_hz} Hz`
                    : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-400">Vocoder harmonic cutoff analysis</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1 text-xs">
              <span className="text-slate-300 font-medium block">Signal Forensics Assessment:</span>
              <p className="text-slate-400 leading-relaxed">{analysis.authenticity.result_summary}</p>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-900/60 rounded-lg flex items-start space-x-2 text-[11px] text-amber-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Methodology Disclaimer:</strong> {analysis.authenticity.limitations}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-5 text-center text-slate-400 text-xs italic bg-slate-900/40 rounded-lg border border-slate-800">
            Acoustic signal forensics is unavailable for text-only inputs or when audio decoding is unsupported. Scam-risk assessment remains active based on spoken language analysis.
          </div>
        )}
      </div>

      {/* Recommended Safe Actions */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Recommended Safe Actions</h2>
        </div>

        <div className="space-y-2">
          {analysis.recommended_actions.map((act, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{act}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Cybercrime Helpline Banner */}
      <CybercrimeHelpline />
    </div>
  );
};
