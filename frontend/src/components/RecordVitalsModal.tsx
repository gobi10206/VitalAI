import React, { useState } from 'react';
import { X, Heart, Activity, Wind, Thermometer, Droplets, Gauge } from 'lucide-react';
import { api } from '../services/api';

interface RecordVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSuccess: () => void;
}

export const RecordVitalsModal: React.FC<RecordVitalsModalProps> = ({ isOpen, onClose, patientId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    heart_rate: 72,
    systolic_bp: 120,
    diastolic_bp: 80,
    spo2: 98,
    blood_glucose: 95,
    body_temperature: 36.6,
    respiratory_rate: 16,
    symptoms: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.recordVital({
        patient_id: patientId,
        ...formData
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error recording vitals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Record New Vital Signs</h3>
        <p className="text-xs text-slate-400 mb-5">Inputs are immediately ingested by the AI Risk Analysis Engine.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Heart Rate (BPM)</label>
              <input
                type="number"
                value={formData.heart_rate}
                onChange={e => setFormData({ ...formData, heart_rate: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">SpO₂ Oxygen (%)</label>
              <input
                type="number"
                value={formData.spo2}
                onChange={e => setFormData({ ...formData, spo2: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={formData.systolic_bp}
                onChange={e => setFormData({ ...formData, systolic_bp: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={formData.diastolic_bp}
                onChange={e => setFormData({ ...formData, diastolic_bp: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Blood Glucose (mg/dL)</label>
              <input
                type="number"
                value={formData.blood_glucose}
                onChange={e => setFormData({ ...formData, blood_glucose: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Respiratory Rate (/min)</label>
              <input
                type="number"
                value={formData.respiratory_rate}
                onChange={e => setFormData({ ...formData, respiratory_rate: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Reported Symptoms</label>
            <input
              type="text"
              placeholder="e.g. Mild palpitations, headache, shortness of breath"
              value={formData.symptoms}
              onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 hover:opacity-90 transition font-bold"
            >
              {loading ? 'Evaluating AI...' : 'Submit & Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
