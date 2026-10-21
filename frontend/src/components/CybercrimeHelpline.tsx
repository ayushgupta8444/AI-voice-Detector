import React from 'react';
import { PhoneCall, ShieldAlert, ExternalLink, AlertOctagon } from 'lucide-react';

export const CybercrimeHelpline: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-soft space-y-5">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-slate-900">Official Cybercrime Response Resources</h3>
          <p className="text-xs text-slate-500">Government of India cyber defense portals & immediate action helplines</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        If you or someone you know has been targeted by a financial voice scam, take immediate defensive action. Timely reporting within the initial "Golden Hours" enables law enforcement and nodal bank authorities to freeze fraudulent account transfers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* National Helpline 1930 */}
        <a
          href="tel:1930"
          className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between space-y-2.5 group shadow-soft-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Citizen Helpline</span>
            <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-700">Dial 1930</div>
            <p className="text-xs text-slate-500 mt-0.5">National Cyber Crime Reporting Helpline (24x7 Free)</p>
          </div>
        </a>

        {/* Cybercrime Portal */}
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between space-y-2.5 group shadow-soft-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Official Portal</span>
            <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">cybercrime.gov.in</div>
            <p className="text-xs text-slate-500 mt-0.5">File official FIR / complaint with Indian Cyber Crime Cell</p>
          </div>
        </a>

        {/* Chakshu Portal */}
        <a
          href="https://sancharsaathi.gov.in/sfc/"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between space-y-2.5 group shadow-soft-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">DoT Telecom Shield</span>
            <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Chakshu Portal</div>
            <p className="text-xs text-slate-500 mt-0.5">Report fraudulent WhatsApp/voice calls and SMS numbers</p>
          </div>
        </a>
      </div>

      <div className="flex items-start space-x-2 text-xs text-slate-600 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
        <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Advisory Notice:</strong> VoiceShield AI connects you to verified Indian government portals. Analyzing audio on this tool does NOT automatically register a police complaint.
        </span>
      </div>
    </div>
  );
};
