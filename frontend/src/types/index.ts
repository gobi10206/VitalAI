export type RiskLevel = 'Normal' | 'Caution' | 'High Risk' | 'Critical';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface VitalRecord {
  id: string;
  patient_id: string;
  recorded_at: string;
  heart_rate: number;
  systolic_bp: number;
  diastolic_bp: number;
  blood_glucose?: number;
  spo2: number;
  body_temperature?: number;
  respiratory_rate?: number;
  bmi?: number;
  activity_level?: string;
  sleep_hours?: number;
  stress_level?: number;
  symptoms?: string;
  notes?: string;
}

export interface ContributingFactor {
  feature: string;
  importance_pct: number;
  effect: 'increases_risk' | 'decreases_risk';
  detail: string;
}

export interface AIAssessment {
  risk_score: number;
  risk_level: RiskLevel;
  confidence_score: number;
  recommendation: string;
  is_anomalous: boolean;
  anomaly_index: number;
  anomaly_details: Array<{ parameter: string; value: number; direction: string; deviation_score: number; description: string }>;
  trends: Record<string, { trajectory: string; slope: number; delta_absolute: number; is_deteriorating: boolean; description: string }>;
  worsening_count: number;
  overall_trajectory: string;
  contributing_factors: ContributingFactor[];
  detected_factors: string[];
  clinical_summary: string;
  disclaimer: string;
  alert_needed: boolean;
}

export interface PatientProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  height_cm: number;
  weight_kg: number;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  existing_conditions: string;
  allergies: string;
  medications: string;
  risk_score?: number;
  risk_level?: RiskLevel;
  latest_vitals?: VitalRecord;
  vitals_history?: VitalRecord[];
  ai_assessment?: AIAssessment;
  alerts?: Alert[];
  clinical_notes?: ClinicalNote[];
}

export interface Alert {
  id: string;
  patient_id: string;
  patient_name?: string;
  severity: RiskLevel;
  title: string;
  parameter?: string;
  message: string;
  explanation: string;
  is_acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  created_at: string;
}

export interface ClinicalNote {
  id: string;
  patient_id: string;
  doctor_name: string;
  note: string;
  priority: string;
  created_at: string;
}
