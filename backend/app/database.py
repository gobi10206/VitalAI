import os
import sqlite3
import json
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional

def get_db():
    db_path = os.getenv("SQLITE_DB_PATH", "/tmp/vitalai.db")
    if os.path.isabs(db_path):
        conn = sqlite3.connect(f"file:{db_path}?nolock=1", uri=True)
    else:
        conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS patient_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        date_of_birth TEXT,
        gender TEXT,
        blood_group TEXT,
        height_cm REAL,
        weight_kg REAL,
        emergency_contact_name TEXT,
        emergency_contact_phone TEXT,
        medical_history TEXT,
        allergies TEXT,
        medications TEXT,
        existing_conditions TEXT,
        baseline_heart_rate REAL DEFAULT 72.0,
        baseline_systolic_bp REAL DEFAULT 120.0,
        baseline_diastolic_bp REAL DEFAULT 80.0,
        baseline_spo2 REAL DEFAULT 98.0,
        baseline_glucose REAL DEFAULT 95.0,
        created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS vital_records (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        recorded_at TEXT,
        heart_rate REAL,
        systolic_bp REAL,
        diastolic_bp REAL,
        blood_glucose REAL,
        spo2 REAL,
        body_temperature REAL,
        respiratory_rate REAL,
        bmi REAL,
        activity_level TEXT,
        sleep_hours REAL,
        stress_level INTEGER,
        symptoms TEXT,
        notes TEXT
    );

    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        assessment_id TEXT,
        severity TEXT,
        title TEXT,
        parameter TEXT,
        message TEXT,
        explanation TEXT,
        is_acknowledged INTEGER DEFAULT 0,
        acknowledged_by TEXT,
        acknowledged_at TEXT,
        created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS clinical_notes (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        doctor_id TEXT,
        doctor_name TEXT,
        note TEXT,
        priority TEXT DEFAULT 'Normal',
        created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT,
        resource TEXT,
        resource_id TEXT,
        ip_address TEXT,
        details TEXT,
        created_at TEXT
    );
    """)
    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        seed_data(conn)
    conn.close()

def seed_data(conn):
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    
    users = [
        ('usr-admin-01', 'admin@vitalai.health', 'pbkdf2:sha256:vitalai_secure_pass', 'Dr. Sarah Lin (Medical Director)', 'admin', now_iso),
        ('usr-doc-01', 'doctor@vitalai.health', 'pbkdf2:sha256:vitalai_secure_pass', 'Dr. Robert Chen, MD (Cardiologist)', 'doctor', now_iso),
        ('usr-pat-01', 'alex.norman@example.com', 'pbkdf2:sha256:vitalai_secure_pass', 'Alex Norman (Patient 1 - Normal)', 'patient', now_iso),
        ('usr-pat-02', 'beth.warner@example.com', 'pbkdf2:sha256:vitalai_secure_pass', 'Beth Warner (Patient 2 - Caution)', 'patient', now_iso),
        ('usr-pat-03', 'carlos.mendez@example.com', 'pbkdf2:sha256:vitalai_secure_pass', 'Carlos Mendez (Patient 3 - High Risk)', 'patient', now_iso),
        ('usr-pat-04', 'diana.ross@example.com', 'pbkdf2:sha256:vitalai_secure_pass', 'Diana Ross (Patient 4 - Critical)', 'patient', now_iso)
    ]
    cursor.executemany("INSERT INTO users VALUES (?, ?, ?, ?, ?, 1, ?)", users)

    profiles = [
        ('pat-01', 'usr-pat-01', '1992-05-14', 'Male', 'O+', 178.0, 72.5, 'Rachel Norman', '+1-555-0101', 'No chronic illnesses', 'Penicillin', 'Multivitamin daily', 'None', 70.0, 118.0, 78.0, 99.0, 92.0, now_iso),
        ('pat-02', 'usr-pat-02', '1984-11-23', 'Female', 'A+', 165.0, 68.0, 'Mark Warner', '+1-555-0102', 'Monitored pre-hypertension', 'Sulfa drugs', 'Hydrochlorothiazide 12.5mg', 'Mild Hypertension', 72.0, 126.0, 82.0, 98.0, 102.0, now_iso),
        ('pat-03', 'usr-pat-03', '1968-03-30', 'Male', 'B-', 172.0, 86.4, 'Sofia Mendez', '+1-555-0103', 'Type 2 Diabetes, Coronary Artery Stent (2022)', 'Latex', 'Metformin 850mg, Atorvastatin 20mg, Aspirin 81mg', 'Type 2 Diabetes, CAD', 75.0, 134.0, 86.0, 97.0, 135.0, now_iso),
        ('pat-04', 'usr-pat-04', '1955-08-19', 'Female', 'AB+', 160.0, 79.0, 'David Ross', '+1-555-0104', 'COPD Stage 2, Congestive Heart Failure', 'Codeine, NSAIDs', 'Carvedilol 25mg, Furosemide 40mg, Fluticasone', 'CHF, COPD, Stage 3 CKD', 78.0, 142.0, 90.0, 95.0, 110.0, now_iso)
    ]
    cursor.executemany("INSERT INTO patient_profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", profiles)

    vitals = [
        # Patient 1: Normal
        ('rec-p1-01', 'pat-01', '2026-09-05T08:00:00Z', 68.0, 116.0, 76.0, 90.0, 99.0, 36.6, 15.0, 22.9, 'Moderate', 7.5, 3, 'None reported', 'Baseline reading'),
        ('rec-p1-02', 'pat-01', '2026-09-06T08:00:00Z', 71.0, 118.0, 78.0, 93.0, 98.5, 36.7, 16.0, 22.9, 'Moderate', 8.0, 2, 'None reported', 'Routine check'),
        ('rec-p1-03', 'pat-01', '2026-09-07T08:00:00Z', 70.0, 117.0, 77.0, 91.0, 99.0, 36.6, 15.0, 22.9, 'Active', 7.0, 3, 'None reported', 'Post-jog rest'),
        ('rec-p1-04', 'pat-01', '2026-09-08T08:00:00Z', 72.0, 119.0, 79.0, 94.0, 98.8, 36.8, 16.0, 22.9, 'Moderate', 7.5, 3, 'None reported', 'Routine check'),
        ('rec-p1-05', 'pat-01', '2026-09-09T08:00:00Z', 69.0, 118.0, 78.0, 92.0, 99.0, 36.6, 15.0, 22.9, 'Moderate', 8.0, 2, 'None reported', 'Morning vitals'),

        # Patient 2: Caution (Rising BP and HR)
        ('rec-p2-01', 'pat-02', '2026-09-05T08:00:00Z', 72.0, 126.0, 82.0, 102.0, 98.0, 36.7, 16.0, 25.0, 'Light', 6.5, 5, 'Mild afternoon fatigue', 'Regular monitor'),
        ('rec-p2-02', 'pat-02', '2026-09-06T08:00:00Z', 76.0, 131.0, 84.0, 106.0, 98.0, 36.8, 16.0, 25.0, 'Sedentary', 6.0, 6, 'Occasional light headache', 'Work stress'),
        ('rec-p2-03', 'pat-02', '2026-09-07T08:00:00Z', 80.0, 136.0, 87.0, 109.0, 97.5, 36.9, 17.0, 25.0, 'Sedentary', 5.5, 7, 'Throbbing headache', 'High stress'),
        ('rec-p2-04', 'pat-02', '2026-09-08T08:00:00Z', 85.0, 140.0, 89.0, 112.0, 97.0, 37.0, 18.0, 25.0, 'Sedentary', 5.0, 8, 'Tension headache, palpitations', 'Increasing BP'),
        ('rec-p2-05', 'pat-02', '2026-09-09T08:00:00Z', 89.0, 144.0, 92.0, 115.0, 97.0, 37.1, 18.0, 25.0, 'Sedentary', 5.0, 8, 'Restlessness, palpitations', 'Morning escalation'),

        # Patient 3: High Risk (BP 162/100, Glucose 215, SpO2 dropping)
        ('rec-p3-01', 'pat-03', '2026-09-05T08:00:00Z', 78.0, 138.0, 88.0, 145.0, 96.5, 36.8, 17.0, 29.2, 'Light', 6.0, 6, 'Increased thirst', 'Post breakfast'),
        ('rec-p3-02', 'pat-03', '2026-09-06T08:00:00Z', 84.0, 144.0, 91.0, 162.0, 96.0, 37.0, 18.0, 29.2, 'Sedentary', 5.5, 7, 'Blurred vision, fatigue', 'Glucose spiking'),
        ('rec-p3-03', 'pat-03', '2026-09-07T08:00:00Z', 88.0, 150.0, 94.0, 180.0, 95.0, 37.2, 20.0, 29.2, 'Sedentary', 4.5, 8, 'Shortness of breath on exertion', 'Fatigue worsening'),
        ('rec-p3-04', 'pat-03', '2026-09-08T08:00:00Z', 94.0, 156.0, 97.0, 198.0, 94.0, 37.3, 21.0, 29.2, 'Sedentary', 4.0, 9, 'Chest tightness upon walking', 'Chest symptoms'),
        ('rec-p3-05', 'pat-03', '2026-09-09T08:00:00Z', 98.0, 162.0, 100.0, 215.0, 93.5, 37.5, 22.0, 29.2, 'Sedentary', 3.5, 9, 'Dizziness, severe dry mouth, dyspnea', 'Multiple abnormalities'),

        # Patient 4: Critical (HR 118, BP 186/112, SpO2 87%, severe dyspnea)
        ('rec-p4-01', 'pat-04', '2026-09-05T08:00:00Z', 82.0, 146.0, 92.0, 115.0, 94.0, 37.0, 19.0, 30.8, 'Sedentary', 5.5, 7, 'Mild ankle edema', 'CHF follow-up'),
        ('rec-p4-02', 'pat-04', '2026-09-06T08:00:00Z', 89.0, 155.0, 96.0, 120.0, 93.0, 37.2, 21.0, 30.8, 'Sedentary', 5.0, 8, 'Orthopnea, nocturnal cough', 'Coughing spells'),
        ('rec-p4-03', 'pat-04', '2026-09-07T08:00:00Z', 98.0, 168.0, 102.0, 128.0, 91.5, 37.5, 24.0, 30.8, 'Bed rest', 4.0, 9, 'Significant breathlessness', 'Rest dyspnea'),
        ('rec-p4-04', 'pat-04', '2026-09-08T08:00:00Z', 110.0, 178.0, 108.0, 134.0, 89.0, 37.8, 27.0, 30.8, 'Bed rest', 3.0, 10, 'Severe dyspnea, confusion', 'Oxygen falling'),
        ('rec-p4-05', 'pat-04', '2026-09-09T08:00:00Z', 118.0, 186.0, 112.0, 140.0, 87.0, 38.1, 30.0, 30.8, 'Bed rest', 2.0, 10, 'Cyanosis, gasping for breath, acute distress', 'CRITICAL CRISIS')
    ]
    cursor.executemany("INSERT INTO vital_records VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", vitals)

    alerts = [
        ('alt-p2-01', 'pat-02', None, 'Caution', 'Persistent Blood Pressure Rise', 'Blood Pressure', 'Systolic BP escalated over 4 consecutive days to 144 mmHg.', 'Stage 1 Hypertension detected with upward trend.', 0, None, None, '2026-09-09T08:15:00Z'),
        ('alt-p3-01', 'pat-03', None, 'High Risk', 'Multivariate Hyperglycemic & Cardiopulmonary Warning', 'Blood Glucose / SpO₂', 'Blood glucose rose to 215 mg/dL accompanied by SpO₂ drop to 93.5%.', 'Multiple abnormal indicators detected in patient with Type 2 Diabetes and CAD.', 0, None, None, '2026-09-09T08:20:00Z'),
        ('alt-p4-01', 'pat-04', None, 'Critical', 'Emergency: Acute Hypoxia and Hypertensive Emergency', 'Multiple Vitals', 'SpO₂ critically depressed at 87% with BP 186/112 mmHg and severe dyspnea.', 'Immediate emergency medical intervention required. Acute cardiopulmonary decompensation.', 0, None, None, '2026-09-09T08:25:00Z')
    ]
    cursor.executemany("INSERT INTO alerts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", alerts)

    notes = [
        ('note-01', 'pat-03', 'usr-doc-01', 'Dr. Robert Chen, MD', 'Reviewed increasing glucose and BP trend. Scheduled urgent telemedicine consultation for medication titration.', 'High', '2026-09-08T14:30:00Z'),
        ('note-02', 'pat-04', 'usr-doc-01', 'Dr. Robert Chen, MD', 'Emergency dispatch advised. Patient is in acute decompensated heart failure exacerbation.', 'Critical', '2026-09-09T08:30:00Z')
    ]
    cursor.executemany("INSERT INTO clinical_notes VALUES (?, ?, ?, ?, ?, ?, ?)", notes)

    audit = [
        ('aud-01', 'usr-doc-01', 'VIEW_PATIENT_CHART', 'PatientProfile', 'pat-03', '127.0.0.1', json.dumps({'action': 'clinical_review'}), '2026-09-08T14:28:00Z'),
        ('aud-02', 'usr-doc-01', 'ACKNOWLEDGE_ALERT', 'Alert', 'alt-p3-01', '127.0.0.1', json.dumps({'alert_title': 'Multivariate Warning'}), '2026-09-08T14:29:00Z')
    ]
    cursor.executemany("INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?, ?, ?, ?)", audit)

    conn.commit()
