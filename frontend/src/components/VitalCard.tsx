import React from 'react';
import { Heart, Activity, Droplets, Thermometer, Wind, Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  baseline: string | number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'caution' | 'critical';
  iconType: 'heart' | 'bp' | 'spo2' | 'temp' | 'glucose' | 'respiratory';
  subtitle?: string;
}

export const VitalCard: React.FC<VitalCardProps> = ({
  title, value, unit, baseline, trend, status, iconType, subtitle
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'heart': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'bp': return <Activity className="w-5 h-5 text-indigo-400" />;
      case 'spo2': return <Wind className="w-5 h-5 text-cyan-400" />;
      case 'temp': return <Thermometer className="w-5 h-5 text-amber-400" />;
      case 'glucose': return <Droplets className="w-5 h-5 text-purple-400" />;
      case 'respiratory': return <Gauge className="w-5 h-5 text-teal-400" />;
    }
  };

  const getStatusBorder = () => {
    switch (status) {
      case 'critical': return 'border-rose-500/50 bg-rose-500/5';
      case 'caution': return 'border-amber-500/40 bg-amber-500/5';
      case 'normal': return 'border-slate-800 bg-slate-900/60';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-rose-400" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur transition-all duration-200 hover:border-slate-700 ${getStatusBorder()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            {getIcon()}
          </div>
          <span className="text-xs font-semibold text-slate-300">{title}</span>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/40 text-[11px] font-medium text-slate-300">
          {getTrendIcon()}
          <span className="capitalize text-[10px]">{trend}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
        <span className="text-xs font-medium text-slate-400">{unit}</span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/70">
        <span>Baseline: <strong className="text-slate-200">{baseline}</strong></span>
        {subtitle && <span className="text-slate-500 truncate max-w-[110px]">{subtitle}</span>}
      </div>
    </div>
  );
};
