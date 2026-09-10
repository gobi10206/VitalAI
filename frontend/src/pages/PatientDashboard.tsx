import React, { useState } from 'react';
import { PatientProfile, VitalRecord } from '../types';
import { VitalCard } from '../components/VitalCard';
import { EarlyWarningBadge } from '../components/EarlyWarningBadge';
import { ExplainabilityPanel } from '../components/ExplainabilityPanel';
import { TrendChart } from '../components/TrendChart';
import { RecordVitalsModal } from '../components/RecordVitalsModal';
import { api } from '../services/api';
import { PlusCircle, FileText, UserCheck, AlertTriangle } from 'lucide-react';

interface PatientDashboardProps {
  patient: PatientProfile;
  onRefresh: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const vitals = patient.latest_vitals || {
    heart_rate: 72, systolic_bp: 120, diastolic_bp: 80, spo2: 98, blood_glucose: 95, body_temperature: 36.6, respiratory_rate: 16
  };

  const assessment = patient.ai_assessment || {
    risk_score: 5.0, risk_level: 'Normal', confidence_score: 0.95,
    recommendation: 'Parameters within normal baseline.',
    is_anomalous: false, anomaly_index: 0, anomaly_details: [],
    trends: {}, worsening_count: 0, overall_trajectory: 'Stable',
    contributing_factors: [], detected_factors: ['Normal readings.'],
    clinical_summary: 'Normal baseline.', disclaimer: 'VitalAI decision support.', alert_needed: false
  };

  const downloadReport = () => {
    window.open(api.getReportDownloadUrl(patient.id), '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Patient Header Banner */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xl">
            {patient.full_name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white">{patient.full_name}</h2>
              <EarlyWarningBadge level={assessment.risk_level} score={assessment.risk_score} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ID: <span className="font-mono text-slate-300">{patient.id}</span> • {patient.gender}, DOB: {patient.date_of_birth} • Blood Group: {patient.blood_group}
            </p>
            <div className="text-[11px] text-slate-400 mt-1">
              Conditions: <strong className="text-slate-300">{patient.existing_conditions || 'None'}</strong> • Medications: <strong className="text-slate-300">{patient.medications || 'None'}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <PlusCircle className="w-4 h-4" /> Record Vitals
          </button>
          <button
            onClick={downloadReport}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <FileText className="w-4 h-4 text-teal-400" /> Export PDF
          </button>
        </div>
      </div>

      {/* 6 Vital Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <VitalCard
          title="Heart Rate"
          value={vitals.heart_rate || '-'}
          unit="BPM"
          baseline="72"
          trend={(vitals.heart_rate || 72) > 85 ? 'up' : (vitals.heart_rate || 72) < 60 ? 'down' : 'stable'}
          status={(vitals.heart_rate || 72) > 110 ? 'critical' : (vitals.heart_rate || 72) > 90 ? 'caution' : 'normal'}
          iconType="heart"
          subtitle="Resting pulse"
        />
        <VitalCard
          title="Blood Pressure"
          value={`${vitals.systolic_bp || '-'}/${vitals.diastolic_bp || '-'}`}
          unit="mmHg"
          baseline="120/80"
          trend={(vitals.systolic_bp || 120) > 135 ? 'up' : 'stable'}
          status={(vitals.systolic_bp || 120) >= 160 ? 'critical' : (vitals.systolic_bp || 120) >= 135 ? 'caution' : 'normal'}
          iconType="bp"
          subtitle="Systolic / Diastolic"
        />
        <VitalCard
          title="Oxygen Saturation"
          value={vitals.spo2 || '-'}
          unit="%"
          baseline="98"
          trend={(vitals.spo2 || 98) < 95 ? 'down' : 'stable'}
          status={(vitals.spo2 || 98) < 90 ? 'critical' : (vitals.spo2 || 98) < 95 ? 'caution' : 'normal'}
          iconType="spo2"
          subtitle="Pulse oximetry"
        />
        <VitalCard
          title="Blood Glucose"
          value={vitals.blood_glucose || '-'}
          unit="mg/dL"
          baseline="95"
          trend={(vitals.blood_glucose || 95) > 140 ? 'up' : 'stable'}
          status={(vitals.blood_glucose || 95) > 200 ? 'critical' : (vitals.blood_glucose || 95) > 140 ? 'caution' : 'normal'}
          iconType="glucose"
          subtitle="Fasting / random"
        />
        <VitalCard
          title="Resp. Rate"
          value={vitals.respiratory_rate || '-'}
          unit="/min"
          baseline="16"
          trend={(vitals.respiratory_rate || 16) > 20 ? 'up' : 'stable'}
          status={(vitals.respiratory_rate || 16) >= 26 ? 'critical' : (vitals.respiratory_rate || 16) >= 20 ? 'caution' : 'normal'}
          iconType="respiratory"
          subtitle="Breath cadence"
        />
        <VitalCard
          title="Body Temp"
          value={vitals.body_temperature || '-'}
          unit="°C"
          baseline="36.6"
          trend={(vitals.body_temperature || 36.6) > 37.5 ? 'up' : 'stable'}
          status={(vitals.body_temperature || 36.6) >= 38.5 ? 'critical' : (vitals.body_temperature || 36.6) >= 37.5 ? 'caution' : 'normal'}
          iconType="temp"
          subtitle="Core biometric"
        />
      </div>

      {/* Middle section: Explainability & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExplainabilityPanel assessment={assessment} />
        <TrendChart data={patient.vitals_history || []} />
      </div>

      {/* Recent Alerts List */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 backdrop-blur">
        <h3 className="text-sm font-bold text-white mb-3">Recent Health Alerts & Notifications</h3>
        {patient.alerts && patient.alerts.length > 0 ? (
          <div className="space-y-2">
            {patient.alerts.map(a => (
              <div key={a.id} className="p-3 rounded-xl bg-slate-850/70 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <EarlyWarningBadge level={a.severity} size="sm" />
                    <span className="font-semibold text-white">{a.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{a.created_at.substring(0, 16).replace('T', ' ')}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{a.message}</p>
                  <p className="text-[11px] text-teal-400 mt-0.5">Clinical Note: {a.explanation}</p>
                </div>
                <div>
                  {a.is_acknowledged ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold">
                      Acknowledged
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-semibold">
                      Unacknowledged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No active alerts recorded for this profile.</p>
        )}
      </div>

      <RecordVitalsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        patientId={patient.id}
        onSuccess={onRefresh}
      />
    </div>
  );
};
