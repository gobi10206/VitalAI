import React from 'react';
import { AIAssessment } from '../types';
import { BrainCircuit, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

interface ExplainabilityPanelProps {
  assessment: AIAssessment;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ assessment }) => {
  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 backdrop-blur">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Explainable AI (SHAP) Attribution
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                {Math.round(assessment.confidence_score * 100)}% Confidence
              </span>
            </h3>
            <p className="text-xs text-slate-400">Clinical feature importance and physiological delta reasoning</p>
          </div>
        </div>
      </div>

      {/* Clinical Recommendation Banner */}
      <div className={`mt-4 p-3.5 rounded-xl border flex items-start gap-3 ${
        assessment.risk_level === 'Critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' :
        assessment.risk_level === 'High Risk' ? 'bg-orange-500/10 border-orange-500/30 text-orange-200' :
        assessment.risk_level === 'Caution' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' :
        'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
      }`}>
        <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="block font-semibold mb-0.5">Clinical Decision Support Recommendation:</strong>
          {assessment.recommendation}
        </div>
      </div>

      {/* Factor list */}
      <div className="mt-4 space-y-2.5">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Identified Biometric Findings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {assessment.detected_factors.map((factor, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-850/80 border border-slate-800 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contributing Factors Relative Importance */}
      {assessment.contributing_factors && assessment.contributing_factors.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Risk Factor Weighting (SHAP Normalized Importance)
          </h4>
          <div className="space-y-2">
            {assessment.contributing_factors.map((cf, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cf.feature}</span>
                  <span className="text-teal-400 font-mono font-semibold">{cf.importance_pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                    style={{ width: `${cf.importance_pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">{cf.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-500">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>{assessment.disclaimer}</span>
      </div>
    </div>
  );
};
