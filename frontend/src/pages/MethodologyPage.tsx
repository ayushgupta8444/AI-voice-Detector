import React from 'react';
import {
  BookOpen, Cpu, Shield, AlertTriangle, CheckCircle2,
  Layers, Code, Activity, Scale, Info, Check, X
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs">
          <BookOpen className="w-4 h-4" />
          <span>CYBERSECURITY SYSTEM ARCHITECTURE & EVALUATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Methodology, Threat Modeling & Evaluation
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive technical documentation detailing the dual-layer detection architecture, rule calibration, acoustic signal forensics, and empirical evaluation metrics for the INS Expo.
        </p>
      </div>

      {/* Architecture Overview */}
      <section className="cyber-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Layers className="w-4 h-4" />
          <span>DUAL-LAYER INSPECTION PIPELINE</span>
        </div>

        <h2 className="text-xl font-bold text-white">How VoiceShield AI Analyzes Spoken Threats</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Unlike opaque neural black-boxes that output arbitrary probability scores without justification, VoiceShield AI decouples spoken social engineering detection from acoustic signal manipulation, ensuring total explainability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Layer 1 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-100">Layer 1: Spoken Scam Language Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Processes audio through Whisper STT into verbatim text segments with timestamping. The transcript is parsed by a deterministic grammar rule engine matching 12 distinct attack vectors across English, Hindi, and Hinglish.
            </p>
            <div className="pt-2 text-[11px] font-mono text-cyan-400">
              Outputs: Overall Scam Risk Score (0-100) & Excerpt Offset Tracking
            </div>
          </div>

          {/* Layer 2 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-100">Layer 2: Acoustic Forensics & Synthetic Artifacts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              An independent signal analysis module examining physical acoustic features: vocoder harmonic rolloff, Wiener spectral flatness entropy, pitch micro-jitter tremor, and zero-crossing regularity.
            </p>
            <div className="pt-2 text-[11px] font-mono text-indigo-400">
              Outputs: Synthetic Anomaly Index (0-100%) & Acoustic Metrics
            </div>
          </div>
        </div>
      </section>

      {/* Detection Categories Table */}
      <section className="cyber-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Scale className="w-4 h-4" />
          <span>THREAT CATEGORIES & SCORING WEIGHTS</span>
        </div>

        <h2 className="text-xl font-bold text-white">Rule Grammars & Social Engineering Vectors</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Indicator Name</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Base Weight</th>
                <th className="p-3">Primary Trigger Patterns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="p-3 font-mono text-cyan-400">Credentials</td>
                <td className="p-3 font-medium">OTP / Password Solicitation</td>
                <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono text-[10px]">CRITICAL</span></td>
                <td className="p-3 font-mono font-bold">35.0</td>
                <td className="p-3 text-slate-400">"share OTP", "verification code", "apna OTP bataye"</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-cyan-400">Remote Access</td>
                <td className="p-3 font-medium">Remote Software Install</td>
                <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono text-[10px]">CRITICAL</span></td>
                <td className="p-3 font-mono font-bold">35.0</td>
                <td className="p-3 text-slate-400">"AnyDesk", "TeamViewer", "screen share app"</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-cyan-400">Impersonation</td>
                <td className="p-3 font-medium">Digital Arrest / CBI Impersonation</td>
                <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono text-[10px]">CRITICAL</span></td>
                <td className="p-3 font-mono font-bold">30.0</td>
                <td className="p-3 text-slate-400">"digital arrest", "CBI Crime Branch", "arrest warrant"</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-cyan-400">Financial</td>
                <td className="p-3 font-medium">Safe Account / Escrow Wire</td>
                <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono text-[10px]">CRITICAL</span></td>
                <td className="p-3 font-mono font-bold">35.0</td>
                <td className="p-3 text-slate-400">"safe account", "transfer funds to verify", "surakshit khate"</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-cyan-400">Threats</td>
                <td className="p-3 font-medium">Service Disconnection / Power Cut</td>
                <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800 font-mono text-[10px]">HIGH</span></td>
                <td className="p-3 font-mono font-bold">25.0</td>
                <td className="p-3 text-slate-400">"power supply disconnected", "electricity cut", "sim deactivated"</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-cyan-400">Secrecy</td>
                <td className="p-3 font-medium">Isolation & Enforced Secrecy</td>
                <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800 font-mono text-[10px]">HIGH</span></td>
                <td className="p-3 font-mono font-bold">25.0</td>
                <td className="p-3 text-slate-400">"do not disconnect call", "don't tell anyone", "kisi ko mat batana"</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-cyan-400">Urgency</td>
                <td className="p-3 font-medium">Extreme Time Pressure</td>
                <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800 font-mono text-[10px]">HIGH</span></td>
                <td className="p-3 font-mono font-bold">20.0</td>
                <td className="p-3 text-slate-400">"immediately", "within 15 minutes", "turant", "jaldi karo"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
          <span className="font-semibold text-slate-200">Compounding Risk Multiplier Formula:</span>
          <p className="font-mono text-cyan-300 text-[11px]">
            Final_Score = min(100, Base_Sum * (1.0 + Impersonation_Urgency_Boost + Credential_Transfer_Boost + Threat_Isolation_Boost))
          </p>
          <p className="text-slate-400">
            When multiple attack dimensions co-occur (such as authority impersonation coupled with artificial urgency and OTP harvesting), the compounding multiplier elevates the scenario to Critical Risk.
          </p>
        </div>
      </section>

      {/* Labelled Evaluation Dataset Results */}
      <section className="cyber-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Activity className="w-4 h-4" />
          <span>EMPIRICAL BENCHMARK EVALUATION</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Labelled Test Dataset Performance</h2>
          <p className="text-sm text-slate-300">
            Validated against a curated benchmark consisting of 8 scam scenarios (including Digital Arrest, AnyDesk, Electricity bill extortion, Bail scams, and Hindi language variants) alongside 6 benign real-world conversations (IT updates, order delivery, family calls).
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono text-slate-500 block mb-1">Precision</span>
            <span className="text-3xl font-extrabold font-mono text-cyan-400">100.0%</span>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">Zero False Positives</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono text-slate-500 block mb-1">Recall</span>
            <span className="text-3xl font-extrabold font-mono text-cyan-400">100.0%</span>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">Zero False Negatives</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono text-slate-500 block mb-1">F1-Score</span>
            <span className="text-3xl font-extrabold font-mono text-cyan-400">1.000</span>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">Harmonic Balance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono text-slate-500 block mb-1">Accuracy</span>
            <span className="text-3xl font-extrabold font-mono text-emerald-400">14 / 14</span>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">100% Correct Classification</span>
          </div>
        </div>

        {/* Confusion Matrix Table */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-300">CONFUSION MATRIX (Labelled Test Suite):</span>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between">
              <span className="text-slate-300">True Positives (Scam Detected):</span>
              <span className="text-emerald-400 font-bold text-sm">8 / 8</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">False Positives (Benign Flagged):</span>
              <span className="text-cyan-400 font-bold text-sm">0 / 6</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">False Negatives (Missed Scams):</span>
              <span className="text-cyan-400 font-bold text-sm">0 / 8</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between">
              <span className="text-slate-300">True Negatives (Benign Cleared):</span>
              <span className="text-emerald-400 font-bold text-sm">6 / 6</span>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations and Defensive Disclaimer */}
      <section className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Model Limitations & Ethical Cybersecurity Considerations</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          VoiceShield AI is created as a defensive advisory system for the Information and Network Security Expo. Users should note:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
          <li><strong>Audio Degradation:</strong> Cellular GSM/AMR compression or severe background reverberation may truncate high-frequency harmonics or reduce transcription completeness.</li>
          <li><strong>Evolving Phrasing:</strong> Social engineering adversaries continuously alter scripted dialogues; regular updating of rule grammars is required.</li>
          <li><strong>Non-Judicial:</strong> Outputs reflect computational pattern matching and do not constitute authorized legal testimony or conclusive proof of criminal liability.</li>
        </ul>
      </section>
    </div>
  );
};
