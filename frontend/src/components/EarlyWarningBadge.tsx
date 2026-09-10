import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Flame } from 'lucide-react';
import { RiskLevel } from '../types';

interface EarlyWarningBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const EarlyWarningBadge: React.FC<EarlyWarningBadgeProps> = ({ level, score, size = 'md' }) => {
  const configs = {
    Normal: {
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle,
      dotColor: 'bg-emerald-400',
      label: 'Normal'
    },
    Caution: {
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      dotColor: 'bg-amber-400',
      label: 'Caution'
    },
    'High Risk': {
      color: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      icon: AlertCircle,
      dotColor: 'bg-orange-400',
      label: 'High Risk'
    },
    Critical: {
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
      icon: Flame,
      dotColor: 'bg-rose-500',
      label: 'Critical Warning'
    }
  };

  const current = configs[level] || configs.Normal;
  const Icon = current.icon;

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-base font-bold' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${current.color} ${sizeClass}`}>
      <span className={`w-2 h-2 rounded-full ${current.dotColor} ${level === 'Critical' ? 'animate-ping' : ''}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
      {score !== undefined && <span className="opacity-75 font-mono">({score}%)</span>}
    </div>
  );
};
