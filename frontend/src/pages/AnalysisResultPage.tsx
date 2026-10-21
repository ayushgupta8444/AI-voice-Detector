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
        <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500">Loading incident forensics record...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The requested forensic analysis does not exist.'}</p>
        <Link
          to="/workspace"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-soft"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/workspace')}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-300 transition shadow-soft-sm"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">Incident Forensics Report</h1>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                #{analysis.id.slice(0, 8)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyzed on {new Date(analysis.created_at).toLocaleString()} &middot; {analysis.original_filename}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopyJson}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5 shadow-soft-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-soft hover:shadow-soft-md disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Exporting PDF...' : 'Download Incident PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Score & Risk Overview Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Risk Badge */}
        <div className={`bg-white rounded-2xl p-6 border flex flex-col justify-between space-y-4 shadow-soft ${
          score >= 85 ? 'border-rose-300 ring-1 ring-rose-500/10' : score >= 60 ? 'border-orange-300 ring-1 ring-orange-500/10' : score >= 30 ? 'border-amber-300 ring-1 ring-amber-500/10' : 'border-emerald-300 ring-1 ring-emerald-500/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Overall Scam Threat</span>
            <RiskBadge category={analysis.scam_risk_category} size="md" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className={`text-5xl font-extrabold font-mono tracking-tight ${
              score >= 85 ? 'text-rose-600' : score >= 60 ? 'text-orange-600' : score >= 30 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {score.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400 font-medium">/ 100</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span>Threat Category:</span>
              <span className="text-slate-900 font-semibold">{analysis.scam_risk_category}</span>
            </div>
            <div className="flex justify-between">
              <span>Warning Signs Detected:</span>
              <span className="text-slate-900 font-semibold">{analysis.detected_indicators.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Source Type:</span>
              <span className="text-slate-900 font-medium capitalize">{analysis.transcript_source.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Audio / Session Metadata */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-soft">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>RECORDING METADATA</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1 text-[11px]">Duration</span>
              <span className="font-mono text-slate-900 font-bold">
                {analysis.audio_duration_seconds ? `${analysis.audio_duration_seconds.toFixed(1)}s` : 'Text Only'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1 text-[11px]">Language</span>
              <span className="font-mono text-slate-900 font-bold uppercase">
                {analysis.detected_language}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1 text-[11px]">STT Engine</span>
              <span className="font-mono text-slate-900 text-xs truncate block font-medium">
                {analysis.transcription_model}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1 text-[11px]">Rule Grammar</span>
              <span className="font-mono text-slate-900 text-xs truncate block font-medium">
                {analysis.detection_method_version}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Audio Retention:</span>
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
              Scrubbed (Zero Retention)
            </span>
          </div>
        </div>

        {/* Quick Actions Guidance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-soft">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>IMMEDIATE DEFENSIVE ACTION</span>
          </div>

          <div className="space-y-2">
            {isHighRisk ? (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                <span className="font-bold flex items-center space-x-1.5 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>SUSPECTED HIGH-RISK SCAM CALL</span>
                </span>
                <p className="leading-relaxed">Do NOT share OTPs, do NOT transfer money, and do NOT install AnyDesk/TeamViewer.</p>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                <span className="font-bold flex items-center space-x-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>LOW THREAT PROFILE DETECTED</span>
                </span>
                <p className="leading-relaxed">No acute extortion or credential harvesting patterns identified in this excerpt.</p>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500">
            Emergency helpline: <a href="tel:1930" className="text-blue-700 font-bold hover:underline">Dial 1930</a> (24x7 Free)
          </div>
        </div>
      </div>

      {/* Transcript with Evidence Highlighting */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Spoken Transcript & Highlighted Evidence</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Click any highlighted phrase to view threat rationale
          </span>
        </div>

        <TranscriptViewer
          transcript={analysis.transcript}
          indicators={analysis.detected_indicators}
        />
      </div>

      {/* Detected Scam Indicators Details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Detected Scam Indicators ({analysis.detected_indicators.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Documented Rule Grammars
          </span>
        </div>

        {analysis.detected_indicators.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm italic bg-slate-50 rounded-xl border border-slate-200">
            No known scam or social engineering indicators were detected in this transcript.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.detected_indicators.map((ind, i) => (
              <div
                key={ind.id + i}
                className={`p-4 rounded-xl border space-y-2.5 transition-all shadow-soft-sm ${
                  ind.severity === 'critical'
                    ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                    : ind.severity === 'high'
                    ? 'bg-orange-50/40 border-orange-200 hover:border-orange-300'
                    : 'bg-slate-50/70 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{ind.name}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                    ind.severity === 'critical'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : ind.severity === 'high'
                      ? 'bg-orange-100 text-orange-800 border-orange-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {ind.severity}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-blue-800 font-medium">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold mb-0.5">Matched Excerpt:</span>
                  "{ind.excerpt}"
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ind.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experimental Acoustic Forensics */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-700">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Voice Authenticity & Acoustic Forensics</h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              EXPERIMENTAL
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Signal Processing Forensics
          </span>
        </div>

        {analysis.authenticity ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-xs block font-medium">Acoustic Model</span>
                <span className="text-xs font-mono text-slate-900 font-bold block">
                  {analysis.authenticity.model_name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v{analysis.authenticity.model_version}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-xs block font-medium">Synthetic Anomaly Index</span>
                <span className="text-lg font-mono text-indigo-700 font-bold block">
                  {analysis.authenticity.estimated_risk_score !== null && analysis.authenticity.estimated_risk_score !== undefined
                    ? `${analysis.authenticity.estimated_risk_score.toFixed(1)}%`
                    : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-500">Experimental signal estimate</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-xs block font-medium">High-Freq Rolloff Boundary</span>
                <span className="text-sm font-mono text-slate-900 font-bold block">
                  {analysis.authenticity.acoustic_metrics?.spectral_rolloff_hz
                    ? `${analysis.authenticity.acoustic_metrics.spectral_rolloff_hz} Hz`
                    : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-500">Vocoder harmonic cutoff analysis</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <span className="text-slate-800 font-semibold block">Signal Forensics Assessment:</span>
              <p className="text-slate-600 leading-relaxed">{analysis.authenticity.result_summary}</p>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-xs text-amber-800">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Methodology Disclaimer:</strong> {analysis.authenticity.limitations}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-5 text-center text-slate-500 text-xs italic bg-slate-50 rounded-xl border border-slate-200">
            Acoustic signal forensics is unavailable for text-only inputs or when audio decoding is unsupported. Scam-risk assessment remains active based on spoken language analysis.
          </div>
        )}
      </div>

      {/* Recommended Safe Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-soft">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Recommended Safe Actions</h2>
        </div>

        <div className="space-y-2.5">
          {analysis.recommended_actions.map((act, i) => (
            <div key={i} className="flex items-start space-x-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
