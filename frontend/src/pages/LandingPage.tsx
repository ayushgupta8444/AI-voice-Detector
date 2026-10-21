import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu, ArrowRight, PhoneOff, UserX, CheckCircle2
} from 'lucide-react';
import { CybercrimeHelpline } from '../components/CybercrimeHelpline';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-xs text-cyan-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Information & Network Security (INS) Expo 2026 Showcase</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Voice Impersonation & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Spoken Cyber Scams in Real Time
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            VoiceShield AI analyzes suspicious phone calls and voice recordings to uncover social engineering tactics, digital arrest threats, OTP harvesting, and acoustic manipulation indicators.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/workspace"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-all shadow-cyber-glow flex items-center justify-center space-x-2"
          >
            <span>Analyze Suspicious Audio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/methodology"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm transition flex items-center justify-center space-x-2"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Forensics & Methodology</span>
          </Link>
        </div>

        {/* Live Threat Vector Pills */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Digital Arrest Detection</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            <span>OTP & PIN Harvesting</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Remote Access Hijacks</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Acoustic Synthetic Forensics</span>
          </span>
        </div>
      </section>

      {/* Anatomy of Modern Spoken Scams */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">The Anatomy of Voice-Based Attacks</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Cyber syndicates weaponize psychological coercion and synthesized voice clones to bypass traditional perimeter security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <PhoneOff className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-slate-100">Fabricated Legal Coercion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Callers pose as CBI, Police, or Customs officers alleging illegal packages or arrest warrants. They mandate "Digital Arrest" and order victims into locked rooms to prevent external counsel.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-slate-100">Remote Screen Takeovers</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Scammers manipulate users into installing AnyDesk or TeamViewer under the guise of "banking KYC updates" or "anti-virus fixes," gaining direct access to banking apps and OTP messages.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-slate-100">Synthetic Voice Cloning</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Few-shot neural text-to-speech models can clone a family member or CEO's voice with 3 seconds of reference audio, fabricating emergency ransom or urgent wire requests.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cyber-card p-8 sm:p-12 border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-mono font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Transparent & Explainable AI
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                No Black-Box Guesswork. <br />
                Clear Evidence for Every Detected Sign.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                VoiceShield AI never makes unsubstantiated claims or invents probabilities. It evaluates spoken transcripts through transparent cybersecurity rule grammars while maintaining a separate acoustic forensic layer.
              </p>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Whisper Speech Recognition:</strong> Offline-capable multilingual STT supporting English and Hindi dialects.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Exact Excerpt Highlighting:</strong> Every scam score is traceable back to word-for-word spoken transcript excerpts.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Acoustic Forensics Engine:</strong> Experimental signal analysis assessing high-frequency vocoder cutoffs, Wiener entropy, and pitch jitter micro-tremor.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Persistent Audio:</strong> Audio is scrubbed from disk immediately after processing unless explicitly opted into retention.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/workspace"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition"
                >
                  <span>Launch Audio Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Simulated Analysis Card Preview */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-6 space-y-4 font-mono shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                <span className="text-slate-400">INCIDENT_FORENSICS_PREVIEW</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">CRITICAL RISK</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-400">Detected Attack Vectors:</div>
                <div className="space-y-1.5">
                  <div className="p-2 rounded bg-slate-900 border border-rose-900/60 text-rose-300">
                    [CRITICAL] Authority Impersonation (Digital Arrest)
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5 font-normal">
                      "You are currently placed under digital arrest by CBI Delhi Crime Branch..."
                    </p>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-orange-900/60 text-orange-300">
                    [HIGH] Enforced Secrecy & Call Retention
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5 font-normal">
                      "Do not disconnect this call, stay inside your room..."
                    </p>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-rose-900/60 text-rose-300">
                    [CRITICAL] Unverified Safe Account Fund Transfer Demand
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Overall Scam Risk Score:</span>
                <span className="text-rose-400 font-bold text-sm">96.0 / 100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cybercrime Helpline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CybercrimeHelpline />
      </section>
    </div>
  );
};
