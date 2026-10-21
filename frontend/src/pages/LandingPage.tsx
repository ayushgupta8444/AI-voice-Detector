import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu, ArrowRight, PhoneOff, UserX, CheckCircle2, ShieldCheck, Activity, Lock, ArrowUpRight
} from 'lucide-react';
import { CybercrimeHelpline } from '../components/CybercrimeHelpline';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 py-10">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 shadow-soft-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Information & Network Security (INS) Expo 2026 Showcase</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Stop Voice Impersonation & <br />
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
              Spoken Cyber Scams in Real Time
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            VoiceShield AI analyzes suspicious calls and voice recordings to detect psychological manipulation, digital arrest coercion, OTP theft, and acoustic synthetic cloning artifacts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/workspace"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-soft hover:shadow-soft-md flex items-center justify-center space-x-2 group"
          >
            <span>Analyze Suspicious Audio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/methodology"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm transition flex items-center justify-center space-x-2 shadow-soft-sm"
          >
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>Forensics & Methodology</span>
          </Link>
        </div>

        {/* Live Threat Vector Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-600">
          <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-soft-sm flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Digital Arrest Detection</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-soft-sm flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>OTP & PIN Harvesting</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-soft-sm flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Remote Screen Hijacks</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-soft-sm flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Acoustic Synthetic Forensics</span>
          </span>
        </div>
      </section>

      {/* Anatomy of Modern Spoken Scams */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">The Anatomy of Voice-Based Attacks</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Cyber syndicates weaponize psychological coercion and synthesized voice clones to bypass traditional security perimeters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4 shadow-soft hover:shadow-soft-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <PhoneOff className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Fabricated Legal Coercion</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Callers pose as CBI, Police, or Customs officers alleging illegal packages or arrest warrants. They mandate "Digital Arrest" and order victims into locked rooms to prevent external counsel.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4 shadow-soft hover:shadow-soft-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Remote Screen Takeovers</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Scammers manipulate users into installing AnyDesk or TeamViewer under the guise of "banking KYC updates" or "anti-virus fixes," gaining direct access to banking apps and OTP messages.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4 shadow-soft hover:shadow-soft-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Synthetic Voice Cloning</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Few-shot neural text-to-speech models can clone a family member or CEO's voice with 3 seconds of reference audio, fabricating emergency ransom or urgent wire requests.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Capabilities & Inspection Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-soft-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Transparent & Explainable AI
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                No Black-Box Guesswork. <br />
                Clear Evidence for Every Detected Sign.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                VoiceShield AI never makes unsubstantiated claims or invents probabilities. It evaluates spoken transcripts through transparent cybersecurity rule grammars while maintaining a separate acoustic forensic layer.
              </p>

              <div className="space-y-3.5 text-sm text-slate-700">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Whisper Speech Recognition:</strong> Multilingual STT supporting English and Hindi dialects.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Exact Excerpt Highlighting:</strong> Every scam score is traceable back to word-for-word spoken transcript excerpts.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Acoustic Forensics Engine:</strong> Signal analysis assessing high-frequency vocoder cutoffs, spectral entropy, and pitch jitter.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Persistent Audio:</strong> Audio is scrubbed from disk immediately after processing unless explicitly opted into retention.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/workspace"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-soft"
                >
                  <span>Launch Audio Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Simulated Analysis Card Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-soft">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
                <span className="font-semibold text-slate-700">INCIDENT FORENSICS RECORD</span>
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs">
                  CRITICAL RISK
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Detected Threat Vectors:</div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white border border-rose-200 text-rose-900 shadow-soft-sm">
                    <div className="font-bold text-xs text-rose-800">[CRITICAL] Authority Impersonation (Digital Arrest)</div>
                    <p className="text-xs text-slate-600 font-normal mt-1 italic">
                      "You are currently placed under digital arrest by CBI Delhi Crime Branch..."
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-orange-200 text-orange-900 shadow-soft-sm">
                    <div className="font-bold text-xs text-orange-800">[HIGH] Enforced Secrecy & Call Retention</div>
                    <p className="text-xs text-slate-600 font-normal mt-1 italic">
                      "Do not disconnect this call, stay inside your room..."
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-rose-200 text-rose-900 shadow-soft-sm">
                    <div className="font-bold text-xs text-rose-800">[CRITICAL] Unverified Safe Account Fund Transfer Demand</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Overall Scam Risk Score:</span>
                <span className="text-rose-700 font-bold text-base">96.0 / 100</span>
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
