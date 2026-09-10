import React from 'react';
import { Activity, ShieldCheck, Cpu, LineChart, Stethoscope, ArrowRight, Play, CheckCircle2, HeartPulse } from 'lucide-react';

interface LandingPageProps {
  onExploreDemo: () => void;
  onGoToPatient: () => void;
  onGoToDoctor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExploreDemo, onGoToPatient, onGoToDoctor }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <HeartPulse className="w-3.5 h-3.5" /> Next-Generation Healthcare Decision Support
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Vital<span className="text-teal-400">AI</span> — Intelligent Health Monitoring & Early Warning System
        </h1>
        <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
          Turn health data into early insights. Monitor trends, detect abnormal patterns, and receive intelligent warnings before risks escalate.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onExploreDemo}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25 hover:opacity-95 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Explore Live Simulation
          </button>
          <button
            onClick={onGoToPatient}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-white font-semibold text-sm transition"
          >
            Patient Dashboard
          </button>
          <button
            onClick={onGoToDoctor}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-white font-semibold text-sm transition"
          >
            Doctor Portal
          </button>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">How VitalAI Operates</h2>
          <p className="text-sm text-slate-400 mt-1">From raw biometrics to timely physician collaboration</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { step: '01', title: 'Health Data', desc: 'Real-time vitals, history, labs & lifestyle biometrics' },
            { step: '02', title: 'AI Analysis', desc: 'Multivariate normalization & baseline delta filtering' },
            { step: '03', title: 'Pattern Detection', desc: 'Multi-point temporal slope & acceleration trajectory' },
            { step: '04', title: 'Risk Assessment', desc: 'Calibrated ensemble classification (0-100 score)' },
            { step: '05', title: 'Early Warning', desc: '🟢 Normal, 🟡 Caution, 🟠 High Risk, 🔴 Critical tiers' },
            { step: '06', title: 'Clinical Action', desc: 'Explainable SHAP rationale & physician triage' }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center relative flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold text-teal-400 mb-1">{item.step}</span>
              <h3 className="text-xs font-bold text-white mb-1">{item.title}</h3>
              <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Trend Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Moves beyond static threshold checks to analyze rate-of-change across sequences (e.g. 72 → 78 → 84 → 91 → 95 BPM), identifying subtle deterioration early.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Explainable AI (XAI)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every critical warning is paired with natural-language clinical rationales and SHAP-based feature importance scores, transparently justifying risk scores.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Physician Decision Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides doctors with automated patient triage rankings, clinical note logging, alert acknowledgement, and downloadable formal PDF medical reports.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
          <strong className="text-slate-200 block mb-1">Important Safety Notice</strong>
          VitalAI provides AI-assisted decision support and early-warning insights. It does not replace qualified healthcare professionals or provide medical diagnosis. Always consult a physician for clinical assessment.
        </div>
      </section>
    </div>
  );
};
