import React from 'react';
import { PhoneCall, ShieldAlert, ExternalLink, AlertOctagon } from 'lucide-react';

export const CybercrimeHelpline: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-cyan-950/20 border border-cyan-800/40 rounded-xl p-5 space-y-4">
      <div className="flex items-center space-x-2 text-cyan-400">
        <ShieldAlert className="w-5 h-5 text-cyan-400" />
        <h3 className="font-semibold text-sm tracking-wide text-white">Official Cybercrime Response Resources</h3>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        If you or someone you know has been targeted by a financial voice scam, take immediate defensive action. Timely reporting within the initial "Golden Hours" enables law enforcement and nodal bank authorities to freeze fraudulent account transfers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* National Helpline 1930 */}
        <a
          href="tel:1930"
          className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 transition flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[10px] uppercase">Citizen Helpline</span>
            <PhoneCall className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-cyan-300">Dial 1930</div>
            <p className="text-[11px] text-slate-400">National Cyber Crime Reporting Helpline (24x7 Free)</p>
          </div>
        </a>

        {/* Cybercrime Portal */}
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 transition flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[10px] uppercase">Official Portal</span>
            <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">cybercrime.gov.in</div>
            <p className="text-[11px] text-slate-400">File official FIR / complaint with Indian Cyber Crime Cell</p>
          </div>
        </a>

        {/* Chakshu Portal */}
        <a
          href="https://sancharsaathi.gov.in/sfc/"
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 transition flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[10px] uppercase">DoT Telecom Shield</span>
            <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">Chakshu Portal</div>
            <p className="text-[11px] text-slate-400">Report fraudulent WhatsApp/voice calls and SMS numbers</p>
          </div>
        </a>
      </div>

      <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-md border border-slate-800">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Notice: VoiceShield AI connects you to verified Indian government portals. Analyzing audio on this tool does NOT automatically register a police complaint.
        </span>
      </div>
    </div>
  );
};
