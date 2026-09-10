-- VitalAI PostgreSQL Database Schema
-- HIPAA/GDPR Compliant Health Monitoring & Early Warning Platform

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patient_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    medical_history TEXT,
    allergies TEXT,
    medications TEXT,
    existing_conditions TEXT,
    baseline_heart_rate NUMERIC(5, 1) DEFAULT 72.0,
    baseline_systolic_bp NUMERIC(5, 1) DEFAULT 120.0,
    baseline_diastolic_bp NUMERIC(5, 1) DEFAULT 80.0,
    baseline_spo2 NUMERIC(5, 1) DEFAULT 98.0,
    baseline_glucose NUMERIC(5, 1) DEFAULT 95.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vital_records (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    heart_rate NUMERIC(5, 1),
    systolic_bp NUMERIC(5, 1),
    diastolic_bp NUMERIC(5, 1),
    blood_glucose NUMERIC(5, 1),
    spo2 NUMERIC(5, 1),
    body_temperature NUMERIC(4, 1),
    respiratory_rate NUMERIC(4, 1),
    bmi NUMERIC(5, 2),
    activity_level VARCHAR(50),
    sleep_hours NUMERIC(4, 1),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    symptoms TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS ai_risk_assessments (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    vital_record_id VARCHAR(36) REFERENCES vital_records(id) ON DELETE SET NULL,
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    risk_score NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Normal', 'Caution', 'High Risk', 'Critical')),
    confidence_score NUMERIC(4, 3) NOT NULL,
    anomaly_detected BOOLEAN DEFAULT FALSE,
    anomaly_score NUMERIC(5, 3),
    detected_factors JSONB NOT NULL,
    contributing_factors JSONB NOT NULL,
    recommendation TEXT NOT NULL,
    clinical_summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    assessment_id VARCHAR(36) REFERENCES ai_risk_assessments(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Normal', 'Caution', 'High Risk', 'Critical')),
    title VARCHAR(255) NOT NULL,
    parameter VARCHAR(100),
    message TEXT NOT NULL,
    explanation TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(36) REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_notes (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    doctor_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vital_records_patient ON vital_records(patient_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_patient ON alerts(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_patient ON ai_risk_assessments(patient_id, assessed_at DESC);
