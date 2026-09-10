import { PatientProfile, VitalRecord, Alert, AIAssessment } from '../types';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  async getPatients(): Promise<PatientProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/patients`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using simulated demo roster');
      return getFallbackPatients();
    }
  },

  async getPatient(id: string): Promise<PatientProfile> {
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (err) {
      const all = getFallbackPatients();
      return all.find(p => p.id === id) || all[0];
    }
  },

  async recordVital(data: Partial<VitalRecord>): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/vitals/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      return { status: 'simulated_success', record_id: 'rec-local-demo' };
    }
  },

  async getAlerts(patientId?: string): Promise<Alert[]> {
    try {
      const url = patientId ? `${API_BASE}/alerts?patient_id=${patientId}` : `${API_BASE}/alerts`;
      const res = await fetch(url);
      return await res.json();
    } catch (err) {
      return getFallbackAlerts();
    }
  },

  async acknowledgeAlert(alertId: string, doctorName: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged_by: doctorName })
      });
      return await res.json();
    } catch (err) {
      return { status: 'success' };
    }
  },

  async getSimulationTick(patientKey: string, step: number): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/simulation/tick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_key: patientKey, step })
      });
      return await res.json();
    } catch (err) {
      return getFallbackSimulation(patientKey, step);
    }
  },

  getReportDownloadUrl(patientId: string): string {
    return `${API_BASE}/reports/generate/${patientId}`;
  }
};

function getFallbackPatients(): PatientProfile[] {
  return [
    {
      id: 'pat-01',
      user_id: 'usr-pat-01',
      full_name: 'Alex Norman',
      email: 'alex.norman@example.com',
      date_of_birth: '1992-05-14',
      gender: 'Male',
      blood_group: 'O+',
      height_cm: 178,
      weight_kg: 72.5,
      emergency_contact_name: 'Rachel Norman',
      emergency_contact_phone: '+1-555-0101',
      existing_conditions: 'None',
      allergies: 'Penicillin',
      medications: 'Multivitamin',
      risk_score: 5.0,
      risk_level: 'Normal',
      latest_vitals: {
        id: 'rec-1', patient_id: 'pat-01', recorded_at: '2026-09-09T08:00:00Z',
        heart_rate: 69, systolic_bp: 118, diastolic_bp: 78, spo2: 99, blood_glucose: 92,
        body_temperature: 36.6, respiratory_rate: 15, symptoms: 'Normal'
      },
      vitals_history: [
        { id: 'rec-1a', patient_id: 'pat-01', recorded_at: '2026-09-06T08:00:00Z', heart_rate: 68, systolic_bp: 116, diastolic_bp: 76, spo2: 99, blood_glucose: 90 },
        { id: 'rec-1b', patient_id: 'pat-01', recorded_at: '2026-09-07T08:00:00Z', heart_rate: 71, systolic_bp: 118, diastolic_bp: 78, spo2: 98.5, blood_glucose: 93 },
        { id: 'rec-1c', patient_id: 'pat-01', recorded_at: '2026-09-08T08:00:00Z', heart_rate: 70, systolic_bp: 117, diastolic_bp: 77, spo2: 99, blood_glucose: 91 },
        { id: 'rec-1d', patient_id: 'pat-01', recorded_at: '2026-09-09T08:00:00Z', heart_rate: 69, systolic_bp: 118, diastolic_bp: 78, spo2: 99, blood_glucose: 92 }
      ],
      ai_assessment: {
        risk_score: 5.0, risk_level: 'Normal', confidence_score: 0.95,
        recommendation: 'Health parameters and vital sign trajectories are within normal baseline.',
        is_anomalous: false, anomaly_index: 0.2, anomaly_details: [],
        trends: {}, worsening_count: 0, overall_trajectory: 'Stable',
        contributing_factors: [{ feature: 'Cardiovascular Stability', importance_pct: 100, effect: 'decreases_risk', detail: 'All biometrics optimal.' }],
        detected_factors: ['Vital signs remain consistent with personal physiological baseline.'],
        clinical_summary: 'Normal baseline vitals recorded.', disclaimer: 'VitalAI decision support.', alert_needed: false
      }
    },
    {
      id: 'pat-02',
      user_id: 'usr-pat-02',
      full_name: 'Beth Warner',
      email: 'beth.warner@example.com',
      date_of_birth: '1984-11-23',
      gender: 'Female',
      blood_group: 'A+',
      height_cm: 165,
      weight_kg: 68.0,
      emergency_contact_name: 'Mark Warner',
      emergency_contact_phone: '+1-555-0102',
      existing_conditions: 'Mild Hypertension',
      allergies: 'Sulfa',
      medications: 'Hydrochlorothiazide 12.5mg',
      risk_score: 26.9,
      risk_level: 'Caution',
      latest_vitals: {
        id: 'rec-2', patient_id: 'pat-02', recorded_at: '2026-09-09T08:00:00Z',
        heart_rate: 89, systolic_bp: 144, diastolic_bp: 92, spo2: 97, blood_glucose: 115,
        body_temperature: 37.1, respiratory_rate: 18, symptoms: 'Palpitations, headache'
      },
      vitals_history: [
        { id: 'rec-2a', patient_id: 'pat-02', recorded_at: '2026-09-06T08:00:00Z', heart_rate: 72, systolic_bp: 126, diastolic_bp: 82, spo2: 98, blood_glucose: 102 },
        { id: 'rec-2b', patient_id: 'pat-02', recorded_at: '2026-09-07T08:00:00Z', heart_rate: 76, systolic_bp: 131, diastolic_bp: 84, spo2: 98, blood_glucose: 106 },
        { id: 'rec-2c', patient_id: 'pat-02', recorded_at: '2026-09-08T08:00:00Z', heart_rate: 82, systolic_bp: 137, diastolic_bp: 88, spo2: 97.5, blood_glucose: 110 },
        { id: 'rec-2d', patient_id: 'pat-02', recorded_at: '2026-09-09T08:00:00Z', heart_rate: 89, systolic_bp: 144, diastolic_bp: 92, spo2: 97, blood_glucose: 115 }
      ],
      ai_assessment: {
        risk_score: 26.9, risk_level: 'Caution', confidence_score: 0.92,
        recommendation: 'Blood pressure and heart rate exhibit a rising trend. Active monitoring recommended.',
        is_anomalous: true, anomaly_index: 1.4, anomaly_details: [],
        trends: {}, worsening_count: 1, overall_trajectory: 'Moderate Deterioration',
        contributing_factors: [{ feature: 'Blood Pressure', importance_pct: 65, effect: 'increases_risk', detail: 'Systolic BP escalated to 144 mmHg.' }],
        detected_factors: ['Blood pressure elevated to 144/92 mmHg.'],
        clinical_summary: 'Caution: upward trend in systolic blood pressure and resting pulse.', disclaimer: 'VitalAI decision support.', alert_needed: true
      }
    },
    {
      id: 'pat-03',
      user_id: 'usr-pat-03',
      full_name: 'Carlos Mendez',
      email: 'carlos.mendez@example.com',
      date_of_birth: '1968-03-30',
      gender: 'Male',
      blood_group: 'B-',
      height_cm: 172,
      weight_kg: 86.4,
      emergency_contact_name: 'Sofia Mendez',
      emergency_contact_phone: '+1-555-0103',
      existing_conditions: 'Type 2 Diabetes, CAD',
      allergies: 'Latex',
      medications: 'Metformin 850mg, Atorvastatin 20mg',
      risk_score: 74.3,
      risk_level: 'High Risk',
      latest_vitals: {
        id: 'rec-3', patient_id: 'pat-03', recorded_at: '2026-09-09T08:00:00Z',
        heart_rate: 98, systolic_bp: 162, diastolic_bp: 100, spo2: 93.5, blood_glucose: 215,
        body_temperature: 37.5, respiratory_rate: 22, symptoms: 'Dyspnea, dizziness'
      },
      vitals_history: [
        { id: 'rec-3a', patient_id: 'pat-03', recorded_at: '2026-09-06T08:00:00Z', heart_rate: 78, systolic_bp: 138, diastolic_bp: 88, spo2: 96.5, blood_glucose: 145 },
        { id: 'rec-3b', patient_id: 'pat-03', recorded_at: '2026-09-07T08:00:00Z', heart_rate: 84, systolic_bp: 145, diastolic_bp: 92, spo2: 96.0, blood_glucose: 165 },
        { id: 'rec-3c', patient_id: 'pat-03', recorded_at: '2026-09-08T08:00:00Z', heart_rate: 91, systolic_bp: 154, diastolic_bp: 96, spo2: 94.5, blood_glucose: 190 },
        { id: 'rec-3d', patient_id: 'pat-03', recorded_at: '2026-09-09T08:00:00Z', heart_rate: 98, systolic_bp: 162, diastolic_bp: 100, spo2: 93.5, blood_glucose: 215 }
      ],
      ai_assessment: {
        risk_score: 74.3, risk_level: 'High Risk', confidence_score: 0.95,
        recommendation: 'Multiple abnormal parameters detected (glucose spike + oxygen drop). Prompt physician evaluation required.',
        is_anomalous: true, anomaly_index: 2.8, anomaly_details: [],
        trends: {}, worsening_count: 2, overall_trajectory: 'Moderate Deterioration',
        contributing_factors: [
          { feature: 'Blood Glucose', importance_pct: 45, effect: 'increases_risk', detail: 'Glucose acute spike to 215 mg/dL.' },
          { feature: 'Oxygen Saturation', importance_pct: 35, effect: 'increases_risk', detail: 'SpO2 declined to 93.5%.' }
        ],
        detected_factors: ['Blood glucose at 215 mg/dL', 'Reduced SpO2 (93.5%)', 'Systolic BP elevated to 162 mmHg'],
        clinical_summary: 'High risk: Cardiopulmonary and metabolic deterioration detected.', disclaimer: 'VitalAI decision support.', alert_needed: true
      }
    },
    {
      id: 'pat-04',
      user_id: 'usr-pat-04',
      full_name: 'Diana Ross',
      email: 'diana.ross@example.com',
      date_of_birth: '1955-08-19',
      gender: 'Female',
      blood_group: 'AB+',
      height_cm: 160,
      weight_kg: 79.0,
      emergency_contact_name: 'David Ross',
      emergency_contact_phone: '+1-555-0104',
      existing_conditions: 'Congestive Heart Failure, COPD',
      allergies: 'Codeine',
      medications: 'Carvedilol, Furosemide, Fluticasone',
      risk_score: 97.0,
      risk_level: 'Critical',
      latest_vitals: {
        id: 'rec-4', patient_id: 'pat-04', recorded_at: '2026-09-09T08:00:00Z',
        heart_rate: 118, systolic_bp: 186, diastolic_bp: 112, spo2: 87, blood_glucose: 140,
        body_temperature: 38.1, respiratory_rate: 30, symptoms: 'Cyanosis, severe distress, gasping'
      },
      vitals_history: [
        { id: 'rec-4a', patient_id: 'pat-04', recorded_at: '2026-09-06T08:00:00Z', heart_rate: 82, systolic_bp: 146, diastolic_bp: 92, spo2: 94, blood_glucose: 115 },
        { id: 'rec-4b', patient_id: 'pat-04', recorded_at: '2026-09-07T08:00:00Z', heart_rate: 92, systolic_bp: 158, diastolic_bp: 98, spo2: 92.5, blood_glucose: 122 },
        { id: 'rec-4c', patient_id: 'pat-04', recorded_at: '2026-09-08T08:00:00Z', heart_rate: 105, systolic_bp: 172, diastolic_bp: 105, spo2: 89.5, blood_glucose: 130 },
        { id: 'rec-4d', patient_id: 'pat-04', recorded_at: '2026-09-09T08:00:00Z', heart_rate: 118, systolic_bp: 186, diastolic_bp: 112, spo2: 87, blood_glucose: 140 }
      ],
      ai_assessment: {
        risk_score: 97.0, risk_level: 'Critical', confidence_score: 0.98,
        recommendation: 'CRITICAL EMERGENCY: Severe cardiopulmonary decompensation and hypoxia detected. Seek immediate emergency medical services.',
        is_anomalous: true, anomaly_index: 4.6, anomaly_details: [],
        trends: {}, worsening_count: 4, overall_trajectory: 'Critical Deterioration',
        contributing_factors: [
          { feature: 'Oxygen Saturation', importance_pct: 48, effect: 'increases_risk', detail: 'Critical hypoxia (SpO2 87%).' },
          { feature: 'Blood Pressure', importance_pct: 32, effect: 'increases_risk', detail: 'Hypertensive crisis (186/112 mmHg).' }
        ],
        detected_factors: ['Critical hypoxia (SpO2: 87%)', 'Hypertensive crisis (186/112 mmHg)', 'Tachycardia (118 BPM)', 'Severe tachypnea (30/min)'],
        clinical_summary: 'CRITICAL: Acute exacerbation with dangerous multi-organ decompensation.', disclaimer: 'VitalAI decision support.', alert_needed: true
      }
    }
  ];
}

function getFallbackAlerts(): Alert[] {
  return [
    {
      id: 'alt-1',
      patient_id: 'pat-04',
      patient_name: 'Diana Ross',
      severity: 'Critical',
      title: 'Emergency: Acute Hypoxia and Hypertensive Emergency',
      parameter: 'Multiple Vitals',
      message: 'SpO₂ critically depressed at 87% with BP 186/112 mmHg and acute dyspnea.',
      explanation: 'Immediate emergency medical intervention required. Acute cardiopulmonary decompensation.',
      is_acknowledged: false,
      created_at: '2026-09-09T08:25:00Z'
    },
    {
      id: 'alt-2',
      patient_id: 'pat-03',
      patient_name: 'Carlos Mendez',
      severity: 'High Risk',
      title: 'Multivariate Hyperglycemic & Cardiopulmonary Warning',
      parameter: 'Blood Glucose / SpO₂',
      message: 'Blood glucose rose to 215 mg/dL accompanied by SpO₂ drop to 93.5%.',
      explanation: 'Multiple abnormal indicators detected in patient with Type 2 Diabetes and CAD.',
      is_acknowledged: false,
      created_at: '2026-09-09T08:20:00Z'
    },
    {
      id: 'alt-3',
      patient_id: 'pat-02',
      patient_name: 'Beth Warner',
      severity: 'Caution',
      title: 'Persistent Blood Pressure Rise',
      parameter: 'Blood Pressure',
      message: 'Systolic BP escalated over 4 consecutive days to 144 mmHg.',
      explanation: 'Stage 1 Hypertension detected with upward trend.',
      is_acknowledged: true,
      acknowledged_by: 'Dr. Robert Chen, MD',
      created_at: '2026-09-09T08:15:00Z'
    }
  ];
}

function getFallbackSimulation(key: string, step: number) {
  const steps = [
    { heart_rate: 72, systolic_bp: 120, diastolic_bp: 80, spo2: 98, blood_glucose: 95 },
    { heart_rate: 85, systolic_bp: 138, diastolic_bp: 88, spo2: 96, blood_glucose: 125 },
    { heart_rate: 98, systolic_bp: 156, diastolic_bp: 96, spo2: 93, blood_glucose: 175 },
    { heart_rate: 118, systolic_bp: 186, diastolic_bp: 112, spo2: 87, blood_glucose: 210 }
  ];
  const s = steps[Math.min(step, 3)];
  return {
    patient_name: 'Simulated Patient',
    step,
    total_steps: 4,
    current_vitals: s,
    ai_assessment: {
      risk_score: step === 0 ? 5.0 : step === 1 ? 32.0 : step === 2 ? 74.0 : 97.0,
      risk_level: step === 0 ? 'Normal' : step === 1 ? 'Caution' : step === 2 ? 'High Risk' : 'Critical',
      recommendation: step >= 3 ? 'Seek immediate emergency medical care.' : 'Monitor vital trends.',
      detected_factors: step >= 2 ? ['Elevated Heart Rate', 'Rising Blood Pressure', 'Decreased Oxygen'] : ['Baseline physiological readings.']
    }
  };
}
