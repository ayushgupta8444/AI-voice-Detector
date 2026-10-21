import React, { useState } from 'react';
import { IndicatorDetail } from '../types';
import { AlertCircle, Info } from 'lucide-react';

interface TranscriptViewerProps {
  transcript: string;
  indicators: IndicatorDetail[];
  onSelectIndicator?: (indicator: IndicatorDetail) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  indicators,
  onSelectIndicator
}) => {
  const [activeIndicator, setActiveIndicator] = useState<IndicatorDetail | null>(null);

  if (!transcript) {
    return <p className="text-slate-500 italic text-sm">No transcript available.</p>;
  }

  // Sort indicators by character start position
  const sorted = [...indicators].sort((a, b) => a.char_start - b.char_start);

  // Build segmented highlighted text
  const segments: React.ReactNode[] = [];
  let currentIndex = 0;

  sorted.forEach((ind, i) => {
    // If overlap or out-of-bounds, clamp
    const start = Math.max(currentIndex, Math.min(ind.char_start, transcript.length));
    const end = Math.max(start, Math.min(ind.char_end, transcript.length));

    // Normal text before this indicator
    if (start > currentIndex) {
      segments.push(
        <span key={`text-${currentIndex}`}>
          {transcript.slice(currentIndex, start)}
        </span>
      );
    }

    // Highlighted scam text
    if (end > start) {
      let highlightClass = 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500';
      if (ind.severity === 'critical') {
        highlightClass = 'bg-rose-500/25 text-rose-200 border-b-2 border-rose-500 font-medium';
      } else if (ind.severity === 'high') {
        highlightClass = 'bg-orange-500/25 text-orange-200 border-b-2 border-orange-500 font-medium';
      }

      segments.push(
        <span
          key={`highlight-${ind.id}-${i}`}
          onClick={() => {
            setActiveIndicator(ind);
            if (onSelectIndicator) onSelectIndicator(ind);
          }}
          className={`cursor-pointer px-1 py-0.5 rounded transition hover:opacity-80 relative group ${highlightClass}`}
          title={`${ind.name} (${ind.severity.toUpperCase()}) - Click to inspect`}
        >
          {transcript.slice(start, end)}
          <span className="inline-block ml-1 text-[10px] font-mono px-1 rounded bg-black/50 text-slate-300">
            {ind.severity[0].toUpperCase()}
          </span>
        </span>
      );
    }

    currentIndex = Math.max(currentIndex, end);
  });

  // Remaining text
  if (currentIndex < transcript.length) {
    segments.push(
      <span key={`text-end`}>
        {transcript.slice(currentIndex)}
      </span>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-5 font-sans text-sm leading-relaxed text-slate-200 whitespace-pre-wrap selection:bg-cyan-500 selection:text-black">
        {segments}
      </div>

      {activeIndicator && (
        <div className="p-3.5 bg-slate-900 border border-cyan-500/40 rounded-lg flex items-start space-x-3 text-xs shadow-cyber-glow">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-200">{activeIndicator.name}</span>
              <span className="uppercase text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                {activeIndicator.category}
              </span>
            </div>
            <p className="text-slate-400">{activeIndicator.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
