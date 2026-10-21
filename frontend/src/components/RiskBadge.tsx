import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';
import { RiskCategory } from '../types';

interface RiskBadgeProps {
  category: RiskCategory | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ category, size = 'md', showIcon = true }) => {
  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let Icon = ShieldCheck;

  if (category === 'Critical Risk') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = ShieldAlert;
  } else if (category === 'High Risk') {
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
    Icon = AlertTriangle;
  } else if (category === 'Medium Risk') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = AlertCircle;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border shadow-soft-sm ${colorClasses} ${sizeClasses}`}>
      {showIcon && <Icon className={iconSizes} />}
      <span>{category}</span>
    </span>
  );
};
