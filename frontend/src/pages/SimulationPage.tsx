import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EarlyWarningBadge } from '../components/EarlyWarningBadge';
import { Activity, Play, RotateCcw, FastForward, CheckCircle, AlertTriangle, Flame, ArrowUp, ArrowDown } from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('patient_4');
  const [step, setStep] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simData, setSimData] = useState<any>(null);

  const fetchStepData = async (k: string, s: number) => {
    const res = await api.getSimulationTick(k, s);
    setSimData(res);
  };

  useEffect(() => {
    fetchStepData(selectedKey, step);
  }, [selectedKey, step]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep(prev => {
          if (prev >= 3) {
            setIsPlaying(false);
            return 3;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const vitals = simData?.current_vitals || { heart_rate: 118, systolic_bp: 186, diastolic_bp: 112, spo2: 87, body_temperature: 38.1 };
  const ai = simData?.ai_assessment || { risk_score: 97.0, risk_level: 'Critical', recommendation: 'Seek emergency care immediately.' };

  return (
    <div className="space-y-6 pb-12">
      {/* Simulation Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 backdrop-blur">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Early Warning Simulation Engine
            </div>
            <h2 className="text-2xl font-bold text-white">AI Health Deterioration Simulator</h2>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrates how VitalAI detects abnormal patterns and rising risk scores across temporal steps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isPlaying ? 'Pause Simulation' : 'Auto Play Simulation'}
            </button>
            <button
              onClick={() => setStep(0)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Patient Archetype Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-6">
          {[
            { key: 'patient_1', label: 'Patient 1 – Normal', desc: 'Stable vitals, 5% low risk', color: 'border-emerald-500/40 text-emerald-400' },
            { key: 'patient_2', label: 'Patient 2 – Warning', desc: 'Gradually increasing BP & HR', color: 'border-amber-500/40 text-amber-400' },
            { key: 'patient_3', label: 'Patient 3 – High Risk', desc: 'Multi-indicator worsening trend', color: 'border-orange-500/40 text-orange-400' },
            { key: 'patient_4', label: 'Patient 4 – Critical', desc: 'Acute hypoxia & BP crisis', color: 'border-rose-500/40 text-rose-400' }
          ].map(p => (
            <button
              key={p.key}
              onClick={() => { setSelectedKey(p.key); setStep(3); }}
              className={`p-3 rounded-xl border text-left transition ${
                selectedKey === p.key ? 'bg-slate-800/90 shadow-md border-teal-500' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`text-xs font-bold ${p.color}`}>{p.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Step Progress Timeline */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            Temporal Progression: <strong className="text-white">Step {step + 1} of 4</strong>
          </span>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map(s => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition ${
                  step === s ? 'bg-teal-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Monitoring Screen (Matching User Spec: "Section 19. AI Early Warning Simulation") */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Patient Monitor Board */}
        <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 backdrop-blur space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">{simData?.patient_name || 'Patient Monitoring'}</h3>
              <p className="text-xs text-slate-400">Live telemetry feed with trend acceleration sensors</p>
            </div>
            <EarlyWarningBadge level={ai.risk_level || 'Normal'} score={ai.risk_score} size="lg" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Heart Rate</span>
              <div className="text-2xl font-bold font-mono text-white flex items-center gap-1.5">
                {vitals.heart_rate} <span className="text-xs text-slate-400 font-normal">BPM</span>
                {vitals.heart_rate > 90 && <ArrowUp className="w-4 h-4 text-rose-400" />}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Blood Pressure</span>
              <div className="text-2xl font-bold font-mono text-white flex items-center gap-1.5">
                {vitals.systolic_bp}/{vitals.diastolic_bp}
                {vitals.systolic_bp > 135 && <ArrowUp className="w-4 h-4 text-rose-400" />}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">SpO₂</span>
              <div className="text-2xl font-bold font-mono text-white flex items-center gap-1.5">
                {vitals.spo2}%
                {vitals.spo2 < 95 && <ArrowDown className="w-4 h-4 text-cyan-400" />}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Temperature</span>
              <div className="text-2xl font-bold font-mono text-white">
                {vitals.body_temperature || 36.6}°C
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          <div className={`p-4 rounded-xl border ${
            ai.risk_level === 'Critical' ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' :
            ai.risk_level === 'High Risk' ? 'bg-orange-500/15 border-orange-500/40 text-orange-300' :
            ai.risk_level === 'Caution' ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' :
            'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="font-bold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {ai.risk_level === 'Critical' ? '⚠ CRITICAL PATTERN DETECTED' :
               ai.risk_level === 'High Risk' ? '⚠ HIGH-RISK PATTERN DETECTED' :
               ai.risk_level === 'Caution' ? '⚠ CAUTION: ABNORMAL PATTERN EMERGING' :
               '✓ NO IMMEDIATE RISK DETECTED'}
            </div>
            <p className="text-xs mt-1 text-slate-200">
              {ai.recommendation}
            </p>
          </div>

          {/* Contributing Factors */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Contributing Factors:</h4>
            <div className="space-y-1.5">
              {(ai.detected_factors || ['Normal baseline']).map((factor: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: AI Risk Gauge & Medical Guidance */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 backdrop-blur flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-center">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">AI Risk Score</h3>
            
            <div className="relative inline-flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-4 border-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-white font-mono">{ai.risk_score}%</div>
                  <div className="text-[11px] text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                    {ai.risk_level}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Model Confidence: <strong className="text-teal-400 font-mono">96.4%</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-2">
            <strong className="text-white block font-semibold">Recommended Next Step:</strong>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {ai.recommendation}
            </p>
          </div>

          <div className="text-[10px] text-slate-500 text-center">
            Decision support simulation for evaluation purposes.
          </div>
        </div>
      </div>
    </div>
  );
};
