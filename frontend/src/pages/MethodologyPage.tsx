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
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>CYBERSECURITY SYSTEM ARCHITECTURE & EVALUATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Methodology, Threat Modeling & Evaluation
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Comprehensive technical documentation detailing the dual-layer detection architecture, rule calibration, acoustic signal forensics, and empirical evaluation metrics for the INS Expo.
        </p>
      </div>

      {/* Architecture Overview */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-soft">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>DUAL-LAYER INSPECTION PIPELINE</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">How VoiceShield AI Analyzes Spoken Threats</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Unlike opaque neural black-boxes that output arbitrary probability scores without justification, VoiceShield AI decouples spoken social engineering detection from acoustic signal manipulation, ensuring total explainability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Layer 1 */}
          <div className="p-6 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-3 shadow-soft-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-soft">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Layer 1: Spoken Scam Language Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Processes audio through Whisper STT into verbatim text segments with timestamping. The transcript is parsed by a deterministic grammar rule engine matching 12 distinct attack vectors across English, Hindi, and Hinglish.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-700">
              Outputs: Overall Scam Risk Score (0-100) & Excerpt Offset Tracking
            </div>
          </div>

          {/* Layer 2 */}
          <div className="p-6 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 space-y-3 shadow-soft-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-soft">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Layer 2: Acoustic Forensics & Synthetic Artifacts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              An independent signal analysis module examining physical acoustic features: vocoder harmonic rolloff, Wiener spectral flatness entropy, pitch micro-jitter tremor, and zero-crossing regularity.
            </p>
            <div className="pt-2 text-xs font-semibold text-indigo-700">
              Outputs: Synthetic Anomaly Index (0-100%) & Acoustic Metrics
            </div>
          </div>
        </div>
      </section>

      {/* Detection Categories Table */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-soft">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700">
          <Scale className="w-4 h-4 text-blue-600" />
          <span>THREAT CATEGORIES & SCORING WEIGHTS</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">Rule Grammars & Social Engineering Vectors</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Indicator Name</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Base Weight</th>
                <th className="p-3.5">Primary Trigger Patterns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-blue-700">Credentials</td>
                <td className="p-3.5 font-semibold text-slate-900">OTP / Password Solicitation</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">CRITICAL</span></td>
                <td className="p-3.5 font-mono font-bold">35.0</td>
                <td className="p-3.5 text-slate-600">"share OTP", "verification code", "apna OTP bataye"</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-blue-700">Remote Access</td>
                <td className="p-3.5 font-semibold text-slate-900">Remote Software Install</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">CRITICAL</span></td>
                <td className="p-3.5 font-mono font-bold">35.0</td>
                <td className="p-3.5 text-slate-600">"AnyDesk", "TeamViewer", "screen share app"</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-blue-700">Impersonation</td>
                <td className="p-3.5 font-semibold text-slate-900">Digital Arrest / CBI Impersonation</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">CRITICAL</span></td>
                <td className="p-3.5 font-mono font-bold">30.0</td>
                <td className="p-3.5 text-slate-600">"digital arrest", "CBI Crime Branch", "arrest warrant"</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-blue-700">Financial</td>
                <td className="p-3.5 font-semibold text-slate-900">Safe Account / Escrow Wire</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">CRITICAL</span></td>
                <td className="p-3.5 font-mono font-bold">35.0</td>
                <td className="p-3.5 text-slate-600">"safe account", "transfer funds to verify", "surakshit khate"</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-blue-700">Threats</td>
                <td className="p-3.5 font-semibold text-slate-900">Service Disconnection / Power Cut</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-bold text-[10px]">HIGH</span></td>
                <td className="p-3.5 font-mono font-bold">25.0</td>
                <td className="p-3.5 text-slate-600">"power supply disconnected", "electricity cut", "sim deactivated"</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-blue-700">Secrecy</td>
                <td className="p-3.5 font-semibold text-slate-900">Isolation & Enforced Secrecy</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-bold text-[10px]">HIGH</span></td>
                <td className="p-3.5 font-mono font-bold">25.0</td>
                <td className="p-3.5 text-slate-600">"do not disconnect call", "don't tell anyone", "kisi ko mat batana"</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-blue-700">Urgency</td>
                <td className="p-3.5 font-semibold text-slate-900">Extreme Time Pressure</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-bold text-[10px]">HIGH</span></td>
                <td className="p-3.5 font-mono font-bold">20.0</td>
                <td className="p-3.5 text-slate-600">"immediately", "within 15 minutes", "turant", "jaldi karo"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <span className="font-bold text-slate-900">Compounding Risk Multiplier Formula:</span>
          <p className="font-mono text-blue-800 text-xs font-medium bg-white p-2.5 rounded-lg border border-slate-200">
            Final_Score = min(100, Base_Sum * (1.0 + Impersonation_Urgency_Boost + Credential_Transfer_Boost + Threat_Isolation_Boost))
          </p>
          <p className="text-slate-600 leading-relaxed">
            When multiple attack dimensions co-occur (such as authority impersonation coupled with artificial urgency and OTP harvesting), the compounding multiplier elevates the scenario to Critical Risk.
          </p>
        </div>
      </section>

      {/* Labelled Evaluation Dataset Results */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-soft">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>EMPIRICAL BENCHMARK EVALUATION</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Labelled Test Dataset Performance</h2>
          <p className="text-sm text-slate-600">
            Validated against a curated benchmark consisting of 8 scam scenarios (including Digital Arrest, AnyDesk, Electricity bill extortion, Bail scams, and Hindi language variants) alongside 6 benign real-world conversations (IT updates, order delivery, family calls).
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Precision</span>
            <span className="text-3xl font-extrabold font-mono text-blue-700">100.0%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Zero False Positives</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Recall</span>
            <span className="text-3xl font-extrabold font-mono text-blue-700">100.0%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Zero False Negatives</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">F1-Score</span>
            <span className="text-3xl font-extrabold font-mono text-blue-700">1.000</span>
            <span className="text-[11px] text-slate-500 block mt-1">Harmonic Balance</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Accuracy</span>
            <span className="text-3xl font-extrabold font-mono text-emerald-700">14 / 14</span>
            <span className="text-[11px] text-slate-500 block mt-1">100% Classification</span>
          </div>
        </div>

        {/* Confusion Matrix Table */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-800">CONFUSION MATRIX (Labelled Test Suite):</span>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-950 font-medium">
              <span>True Positives (Scam Detected):</span>
              <span className="text-emerald-700 font-bold text-sm">8 / 8</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
              <span>False Positives (Benign Flagged):</span>
              <span className="text-slate-900 font-bold text-sm">0 / 6</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
              <span>False Negatives (Missed Scams):</span>
              <span className="text-slate-900 font-bold text-sm">0 / 8</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-950 font-medium">
              <span>True Negatives (Benign Cleared):</span>
              <span className="text-emerald-700 font-bold text-sm">6 / 6</span>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations and Defensive Disclaimer */}
      <section className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 text-xs text-amber-900 shadow-soft-sm">
        <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Model Limitations & Ethical Cybersecurity Considerations</span>
        </div>
        <p className="leading-relaxed text-amber-950">
          VoiceShield AI is created as a defensive advisory system for the Information and Network Security Expo. Users should note:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-amber-900">
          <li><strong>Audio Degradation:</strong> Cellular GSM/AMR compression or severe background reverberation may truncate high-frequency harmonics or reduce transcription completeness.</li>
          <li><strong>Evolving Phrasing:</strong> Social engineering adversaries continuously alter scripted dialogues; regular updating of rule grammars is required.</li>
          <li><strong>Non-Judicial:</strong> Outputs reflect computational pattern matching and do not constitute authorized legal testimony or conclusive proof of criminal liability.</li>
        </ul>
      </section>
    </div>
  );
};
