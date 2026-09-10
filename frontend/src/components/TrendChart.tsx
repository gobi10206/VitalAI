import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { VitalRecord } from '../types';

interface TrendChartProps {
  data: VitalRecord[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [selectedParam, setSelectedParam] = useState<'heart_rate' | 'systolic_bp' | 'spo2' | 'blood_glucose'>('heart_rate');

  const chartConfigs = {
    heart_rate: { title: 'Heart Rate Trend', unit: 'BPM', color: '#f43f5e', normalMin: 60, normalMax: 100 },
    systolic_bp: { title: 'Systolic Blood Pressure Trend', unit: 'mmHg', color: '#6366f1', normalMin: 90, normalMax: 120 },
    spo2: { title: 'Oxygen Saturation (SpO₂) Trend', unit: '%', color: '#06b6d4', normalMin: 95, normalMax: 100 },
    blood_glucose: { title: 'Blood Glucose Trend', unit: 'mg/dL', color: '#a855f7', normalMin: 70, normalMax: 110 },
  };

  const current = chartConfigs[selectedParam];

  const formattedData = (data || []).map((d, idx) => ({
    time: d.recorded_at ? d.recorded_at.substring(5, 16).replace('T', ' ') : `T-${idx}`,
    value: d[selectedParam] || 0
  }));

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 backdrop-blur">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-bold text-white">{current.title}</h3>
          <p className="text-xs text-slate-400">Multi-point temporal progression vs. physiological normal window</p>
        </div>
        <div className="flex flex-wrap gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setSelectedParam('heart_rate')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${selectedParam === 'heart_rate' ? 'bg-rose-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            Pulse
          </button>
          <button
            onClick={() => setSelectedParam('systolic_bp')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${selectedParam === 'systolic_bp' ? 'bg-indigo-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            Blood Pressure
          </button>
          <button
            onClick={() => setSelectedParam('spo2')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${selectedParam === 'spo2' ? 'bg-cyan-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            SpO₂
          </button>
          <button
            onClick={() => setSelectedParam('blood_glucose')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${selectedParam === 'blood_glucose' ? 'bg-purple-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            Glucose
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${selectedParam}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={current.color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={current.color} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(val: any) => [`${val} ${current.unit}`, current.title]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={current.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#grad-${selectedParam})`}
              dot={{ r: 4, fill: current.color, strokeWidth: 1.5, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
        <span>Standard Range: <strong className="text-slate-300">{current.normalMin} - {current.normalMax} {current.unit}</strong></span>
        <span>Latest Value: <strong className="text-white font-mono">{formattedData.slice(-1)[0]?.value} {current.unit}</strong></span>
      </div>
    </div>
  );
};
