import React from 'react';
import { Shield, ExternalLink, PhoneCall, AlertTriangle, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-soft-sm">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">VoiceShield<span className="text-blue-600">.AI</span></span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              Defensive cybersecurity voice scam risk analyzer and forensics platform built for the Information and Network Security (INS) Expo.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Zero-Retention Privacy Default</span>
            </div>
          </div>

          {/* Official Helplines */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">National Cyber Helplines</h4>
            <div className="space-y-2">
              <a
                href="tel:1930"
                className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition font-medium"
              >
                <div className="w-5 h-5 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PhoneCall className="w-3 h-3" />
                </div>
                <span>Dial 1930 (Cyber Fraud Helpline)</span>
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-slate-600 hover:text-blue-600 transition"
              >
                <span>cybercrime.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://sancharsaathi.gov.in/sfc/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-slate-600 hover:text-blue-600 transition"
              >
                <span>Chakshu Telecom Fraud Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li><a href="/workspace" className="hover:text-blue-600 transition">Audio Analysis Workspace</a></li>
              <li><a href="/dashboard" className="hover:text-blue-600 transition">Cybersecurity Dashboard</a></li>
              <li><a href="/history" className="hover:text-blue-600 transition">Incident History & Reports</a></li>
              <li><a href="/methodology" className="hover:text-blue-600 transition">Detection Rules & Accuracy</a></li>
              <li><a href="/settings" className="hover:text-blue-600 transition">Privacy & Retention Settings</a></li>
            </ul>
          </div>

          {/* Security & Limitations Notice */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Limitations Notice</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
              VoiceShield AI provides automated advisory threat detection on conversational speech and acoustic signals. It does not replace authorized law enforcement investigation or provide definitive legal evidence.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>&copy; 2026 VoiceShield AI — Information & Network Security (INS) Project.</p>
          <p className="mt-2 sm:mt-0 font-mono text-slate-400">FastAPI Backend &middot; Whisper Speech Recognition &middot; Acoustic Forensics v1.0</p>
        </div>
      </div>
    </footer>
  );
};
