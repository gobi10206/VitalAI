-- VitalAI Database Seed Data
-- 4 Simulated Demo Patients: Normal, Caution, High Risk, Critical

-- Users: Admin, Doctor, Patients
INSERT INTO users (id, email, hashed_password, full_name, role) VALUES
('usr-admin-01', 'admin@vitalai.health', 'pbkdf2:sha256:vitalai_secure_pass', 'Dr. Sarah Lin (Chief Medical Admin)', 'admin'),
('usr-doc-01', 'doctor@vitalai.health', 'pbkdf2:sha256:vitalai_secure_pass', 'Dr. Robert Chen, MD (Cardiologist)', 'doctor'),
('usr-pat-01', 'alex.norman@example.com', 'pbkdf2:sha256:vitalai_secure_pass', 'Alex Norman (Patient 1 - Stable)', 'patient'),
('usr-pat-02', 'beth.warner@example.com', 'pbkdf2:sha256:vitalai_secure_pass', 'Beth Warner (Patient 2 - Caution)', 'patient'),
('usr-pat-03', 'carlos.mendez@example.com', 'pbkdf2:sha256:vitalai_secure_pass', 'Carlos Mendez (Patient 3 - High Risk)', 'patient'),
('usr-pat-04', 'diana.ross@example.com', 'pbkdf2:sha256:vitalai_secure_pass', 'Diana Ross (Patient 4 - Critical)', 'patient')
ON CONFLICT (id) DO NOTHING;

-- Patient Profiles
INSERT INTO patient_profiles (id, user_id, date_of_birth, gender, blood_group, height_cm, weight_kg, emergency_contact_name, emergency_contact_phone, medical_history, allergies, medications, existing_conditions, baseline_heart_rate, baseline_systolic_bp, baseline_diastolic_bp, baseline_spo2, baseline_glucose) VALUES
('pat-01', 'usr-pat-01', '1992-05-14', 'Male', 'O+', 178, 72.5, 'Rachel Norman', '+1-555-0101', 'No chronic illnesses, occasional seasonal allergies', 'Penicillin', 'Multivitamin daily', 'None', 70.0, 118.0, 78.0, 99.0, 92.0),
('pat-02', 'usr-pat-02', '1984-11-23', 'Female', 'A+', 165, 68.0, 'Mark Warner', '+1-555-0102', 'Pre-hypertension monitored since 2024', 'Sulfa drugs', 'Hydrochlorothiazide 12.5mg', 'Mild Hypertension', 72.0, 126.0, 82.0, 98.0, 102.0),
('pat-03', 'usr-pat-03', '1968-03-30', 'Male', 'B-', 172, 86.4, 'Sofia Mendez', '+1-555-0103', 'Type 2 Diabetes (6 yrs), Coronary artery disease stent (2022)', 'Latex', 'Metformin 850mg, Atorvastatin 20mg, Aspirin 81mg', 'Type 2 Diabetes, CAD', 75.0, 134.0, 86.0, 97.0, 135.0),
('pat-04', 'usr-pat-04', '1955-08-19', 'Female', 'AB+', 160, 79.0, 'David Ross', '+1-555-0104', 'COPD Stage 2, Congestive Heart Failure, Hypertension', 'Codeine, NSAIDs', 'Carvedilol 25mg, Furosemide 40mg, Fluticasone Inhaler', 'CHF, COPD, Chronic Kidney Disease Stage 3', 78.0, 142.0, 90.0, 95.0, 110.0)
ON CONFLICT (id) DO NOTHING;

-- Historical Vitals for Patient 1 (Normal: stable vitals)
INSERT INTO vital_records (id, patient_id, recorded_at, heart_rate, systolic_bp, diastolic_bp, blood_glucose, spo2, body_temperature, respiratory_rate, bmi, activity_level, sleep_hours, stress_level, symptoms) VALUES
('rec-p1-01', 'pat-01', CURRENT_TIMESTAMP - INTERVAL '4 days', 68.0, 116.0, 76.0, 90.0, 99.0, 36.6, 15.0, 22.9, 'Moderate', 7.5, 3, 'None reported'),
('rec-p1-02', 'pat-01', CURRENT_TIMESTAMP - INTERVAL '3 days', 71.0, 118.0, 78.0, 93.0, 98.5, 36.7, 16.0, 22.9, 'Moderate', 8.0, 2, 'None reported'),
('rec-p1-03', 'pat-01', CURRENT_TIMESTAMP - INTERVAL '2 days', 70.0, 117.0, 77.0, 91.0, 99.0, 36.6, 15.0, 22.9, 'Active', 7.0, 3, 'None reported'),
('rec-p1-04', 'pat-01', CURRENT_TIMESTAMP - INTERVAL '1 day',  72.0, 119.0, 79.0, 94.0, 98.8, 36.8, 16.0, 22.9, 'Moderate', 7.5, 3, 'None reported'),
('rec-p1-05', 'pat-01', CURRENT_TIMESTAMP,                   69.0, 118.0, 78.0, 92.0, 99.0, 36.6, 15.0, 22.9, 'Moderate', 8.0, 2, 'None reported');

-- Historical Vitals for Patient 2 (Caution: gradually increasing BP and HR trend)
INSERT INTO vital_records (id, patient_id, recorded_at, heart_rate, systolic_bp, diastolic_bp, blood_glucose, spo2, body_temperature, respiratory_rate, bmi, activity_level, sleep_hours, stress_level, symptoms) VALUES
('rec-p2-01', 'pat-02', CURRENT_TIMESTAMP - INTERVAL '4 days', 72.0, 126.0, 82.0, 102.0, 98.0, 36.7, 16.0, 25.0, 'Light', 6.5, 5, 'Mild afternoon fatigue'),
('rec-p2-02', 'pat-02', CURRENT_TIMESTAMP - INTERVAL '3 days', 76.0, 131.0, 84.0, 106.0, 98.0, 36.8, 16.0, 25.0, 'Sedentary', 6.0, 6, 'Occasional light headache'),
('rec-p2-03', 'pat-02', CURRENT_TIMESTAMP - INTERVAL '2 days', 80.0, 136.0, 87.0, 109.0, 97.5, 36.9, 17.0, 25.0, 'Sedentary', 5.5, 7, 'Throbbing headache'),
('rec-p2-04', 'pat-02', CURRENT_TIMESTAMP - INTERVAL '1 day',  85.0, 140.0, 89.0, 112.0, 97.0, 37.0, 18.0, 25.0, 'Sedentary', 5.0, 8, 'Tension headache, palpitations'),
('rec-p2-05', 'pat-02', CURRENT_TIMESTAMP,                   89.0, 144.0, 92.0, 115.0, 97.0, 37.1, 18.0, 25.0, 'Sedentary', 5.0, 8, 'Restlessness, palpitations');

-- Historical Vitals for Patient 3 (High Risk: multiple abnormal indicators)
INSERT INTO vital_records (id, patient_id, recorded_at, heart_rate, systolic_bp, diastolic_bp, blood_glucose, spo2, body_temperature, respiratory_rate, bmi, activity_level, sleep_hours, stress_level, symptoms) VALUES
('rec-p3-01', 'pat-03', CURRENT_TIMESTAMP - INTERVAL '4 days', 78.0, 138.0, 88.0, 145.0, 96.5, 36.8, 17.0, 29.2, 'Light', 6.0, 6, 'Increased thirst'),
('rec-p3-02', 'pat-03', CURRENT_TIMESTAMP - INTERVAL '3 days', 84.0, 144.0, 91.0, 162.0, 96.0, 37.0, 18.0, 29.2, 'Sedentary', 5.5, 7, 'Blurred vision, fatigue'),
('rec-p3-03', 'pat-03', CURRENT_TIMESTAMP - INTERVAL '2 days', 88.0, 150.0, 94.0, 180.0, 95.0, 37.2, 20.0, 29.2, 'Sedentary', 4.5, 8, 'Shortness of breath on exertion'),
('rec-p3-04', 'pat-03', CURRENT_TIMESTAMP - INTERVAL '1 day',  94.0, 156.0, 97.0, 198.0, 94.0, 37.3, 21.0, 29.2, 'Sedentary', 4.0, 9, 'Chest tightness upon walking'),
('rec-p3-05', 'pat-03', CURRENT_TIMESTAMP,                   98.0, 162.0, 100.0, 215.0, 93.5, 37.5, 22.0, 29.2, 'Sedentary', 3.5, 9, 'Dizziness, severe dry mouth, dyspnea');

-- Historical Vitals for Patient 4 (Critical: severe worsening)
INSERT INTO vital_records (id, patient_id, recorded_at, heart_rate, systolic_bp, diastolic_bp, blood_glucose, spo2, body_temperature, respiratory_rate, bmi, activity_level, sleep_hours, stress_level, symptoms) VALUES
('rec-p4-01', 'pat-04', CURRENT_TIMESTAMP - INTERVAL '4 days', 82.0, 146.0, 92.0, 115.0, 94.0, 37.0, 19.0, 30.8, 'Sedentary', 5.5, 7, 'Mild ankle edema'),
('rec-p4-02', 'pat-04', CURRENT_TIMESTAMP - INTERVAL '3 days', 89.0, 155.0, 96.0, 120.0, 93.0, 37.2, 21.0, 30.8, 'Sedentary', 5.0, 8, 'Orthopnea, cough at night'),
('rec-p4-03', 'pat-04', CURRENT_TIMESTAMP - INTERVAL '2 days', 98.0, 168.0, 102.0, 128.0, 91.5, 37.5, 24.0, 30.8, 'Bed rest', 4.0, 9, 'Significant breathlessness'),
('rec-p4-04', 'pat-04', CURRENT_TIMESTAMP - INTERVAL '1 day', 110.0, 178.0, 108.0, 134.0, 89.0, 37.8, 27.0, 30.8, 'Bed rest', 3.0, 10, 'Severe dyspnea, confusion'),
('rec-p4-05', 'pat-04', CURRENT_TIMESTAMP,                  118.0, 186.0, 112.0, 140.0, 87.0, 38.1, 30.0, 30.8, 'Bed rest', 2.0, 10, 'Cyanosis, gasping for breath, acute distress');
