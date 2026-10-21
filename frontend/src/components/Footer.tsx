import React from 'react';
import { Shield, ExternalLink, PhoneCall, AlertTriangle, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-cyber-border bg-[#070a10] text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white text-sm tracking-wider">VoiceShield AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Defensive cybersecurity voice scam risk analyzer designed for the Information and Network Security (INS) Expo.
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-cyan-400/80">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Retention Privacy Default</span>
            </div>
          </div>

          {/* Official Helplines */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">National Cyber Helplines</h4>
            <div className="space-y-2">
              <a
                href="tel:1930"
                className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono font-medium">Dial 1930 (Cyber Fraud Helpline)</span>
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-slate-300 hover:text-cyan-400 transition"
              >
                <span>cybercrime.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://sancharsaathi.gov.in/sfc/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-slate-300 hover:text-cyan-400 transition"
              >
                <span>Chakshu Telecom Fraud Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">Quick Navigation</h4>
            <ul className="space-y-1.5">
              <li><a href="/workspace" className="hover:text-cyan-400 transition">Audio Analysis Workspace</a></li>
              <li><a href="/dashboard" className="hover:text-cyan-400 transition">Cybersecurity Dashboard</a></li>
              <li><a href="/history" className="hover:text-cyan-400 transition">Incident History & Reports</a></li>
              <li><a href="/methodology" className="hover:text-cyan-400 transition">Detection Rules & Accuracy</a></li>
              <li><a href="/settings" className="hover:text-cyan-400 transition">Privacy & Retention Settings</a></li>
            </ul>
          </div>

          {/* Security & Limitations Notice */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Limitations Notice</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              VoiceShield AI provides automated advisory threat detection on conversational speech and acoustic signals. It does not replace authorized law enforcement investigation or provide definitive legal evidence.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>&copy; 2026 VoiceShield AI — Information & Network Security (INS) Project.</p>
          <p className="mt-2 sm:mt-0 font-mono">FastAPI Backend &middot; Whisper Speech Recognition &middot; Acoustic Forensics v1.0</p>
        </div>
      </div>
    </footer>
  );
};
