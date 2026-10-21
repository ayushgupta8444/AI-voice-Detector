import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';
import { RiskCategory } from '../types';

interface RiskBadgeProps {
  category: RiskCategory | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ category, size = 'md', showIcon = true }) => {
  let colorClasses = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80';
  let Icon = ShieldCheck;

  if (category === 'Critical Risk') {
    colorClasses = 'bg-rose-950/60 text-rose-400 border-rose-700/80 shadow-danger-glow';
    Icon = ShieldAlert;
  } else if (category === 'High Risk') {
    colorClasses = 'bg-orange-950/60 text-orange-400 border-orange-700/80';
    Icon = AlertTriangle;
  } else if (category === 'Medium Risk') {
    colorClasses = 'bg-amber-950/60 text-amber-400 border-amber-700/80';
    Icon = AlertCircle;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${colorClasses} ${sizeClasses}`}>
      {showIcon && <Icon className={iconSizes} />}
      <span>{category}</span>
    </span>
  );
};
