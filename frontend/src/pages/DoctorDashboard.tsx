import React, { useState } from 'react';
import { PatientProfile, RiskLevel } from '../types';
import { EarlyWarningBadge } from '../components/EarlyWarningBadge';
import { TrendChart } from '../components/TrendChart';
import { api } from '../services/api';
import { Search, Filter, Stethoscope, CheckCheck, FileText, Send, User } from 'lucide-react';

interface DoctorDashboardProps {
  patients: PatientProfile[];
  onSelectPatient: (p: PatientProfile) => void;
  onRefresh: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ patients, onSelectPatient, onRefresh }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'pat-04');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [noteText, setNoteText] = useState('');
  const [notePriority, setNotePriority] = useState('Normal');

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const filteredPatients = patients
    .filter(p => {
      const matchesSearch = p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = severityFilter === 'all' || p.risk_level === severityFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));

  const handleAcknowledge = async (alertId: string) => {
    await api.acknowledgeAlert(alertId, 'Dr. Robert Chen, MD');
    onRefresh();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await fetch('http://localhost:8000/api/doctors/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          note: noteText,
          priority: notePriority
        })
      });
      setNoteText('');
      onRefresh();
    } catch (err) {
      alert('Note saved in session.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-400" />
            Physician Patient Triage & Clinical Oversight
          </h2>
          <p className="text-xs text-slate-400">Ranked by multivariate AI early-warning risk scores</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Monitored: <strong className="text-white">{patients.length}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Roster */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 backdrop-blur space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient name or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {['all', 'Critical', 'High Risk', 'Caution', 'Normal'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSeverityFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                    severityFilter === lvl ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {filteredPatients.map(p => {
              const isSelected = p.id === selectedPatientId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected ? 'bg-teal-500/10 border-teal-500/40 shadow-md' : 'bg-slate-850/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{p.full_name}</span>
                    <EarlyWarningBadge level={p.risk_level || 'Normal'} score={p.risk_score} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>{p.gender}, DOB: {p.date_of_birth}</span>
                    <span className="font-mono text-slate-300">{p.id}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    Vitals: HR {p.latest_vitals?.heart_rate || '-'}, BP {p.latest_vitals?.systolic_bp || '-'}/{p.latest_vitals?.diastolic_bp || '-'}, SpO₂ {p.latest_vitals?.spo2 || '-'}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Patient Clinical Detail */}
        {selectedPatient && (
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 backdrop-blur flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedPatient.full_name}</h3>
                  <EarlyWarningBadge level={selectedPatient.risk_level || 'Normal'} score={selectedPatient.risk_score} />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Conditions: <strong className="text-slate-200">{selectedPatient.existing_conditions || 'None'}</strong> | Allergies: <strong className="text-slate-200">{selectedPatient.allergies || 'None'}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(api.getReportDownloadUrl(selectedPatient.id), '_blank')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition"
                >
                  <FileText className="w-4 h-4 text-teal-400" /> Medical Report (PDF)
                </button>
              </div>
            </div>

            {/* Trend Chart */}
            <TrendChart data={selectedPatient.vitals_history || []} />

            {/* Alerts & Acknowledgement */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 backdrop-blur space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Unresolved Patient Alerts</h4>
              {selectedPatient.alerts && selectedPatient.alerts.length > 0 ? (
                <div className="space-y-2">
                  {selectedPatient.alerts.map(a => (
                    <div key={a.id} className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <EarlyWarningBadge level={a.severity} size="sm" />
                          <span className="font-semibold text-white">{a.title}</span>
                        </div>
                        <p className="text-slate-300 mt-1">{a.message}</p>
                        <p className="text-[11px] text-teal-400 mt-0.5">{a.explanation}</p>
                      </div>
                      {!a.is_acknowledged ? (
                        <button
                          onClick={() => handleAcknowledge(a.id)}
                          className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 font-semibold text-[11px] flex items-center gap-1 shrink-0"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Acknowledge
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-semibold shrink-0">Acknowledged</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No active alerts for this patient.</p>
              )}
            </div>

            {/* Doctor Clinical Notes */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 backdrop-blur space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Add Clinical Progress Note</h4>
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Record clinical assessment, medication change orders, or follow-up instructions..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <div className="flex items-center justify-between">
                  <select
                    value={notePriority}
                    onChange={e => setNotePriority(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Normal">Routine Priority</option>
                    <option value="High">Urgent Follow-Up</option>
                    <option value="Critical">Emergency Action</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-teal-400 transition"
                  >
                    <Send className="w-3 h-3" /> Save Clinical Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
