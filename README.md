# VitalAI – AI-Enhanced Health Monitoring and Early Warning System

**VitalAI** is a modern, intelligent, software-only healthcare platform that uses Artificial Intelligence, Machine Learning, and temporal trend analytics to monitor patient biometrics and provide early warnings for potential physiological risks.

> **Clinical Decision Support Notice:**
> VitalAI is designed as an AI-assisted decision-support and early-warning platform. It does not provide definitive medical diagnoses and is not a replacement for qualified doctors or professional medical judgment.

---

## 🌟 Key Capabilities

1. **Multivariate Biometric Monitoring:** Continuously tracks Heart Rate, Blood Pressure (Systolic/Diastolic), Blood Glucose, SpO₂, Body Temperature, and Respiratory Rate alongside contextual factors (BMI, age, conditions, symptoms).
2. **Dynamic Temporal Trend Detection:** Identifies worsening trajectories across sequential intervals (e.g. `72 → 78 → 84 → 91 → 95 BPM`) before hard thresholds are crossed.
3. **Calibrated Ensemble Risk Engine:** Combines boundary threshold penalties (40%), statistical anomaly indexing (20%), temporal progression acceleration (25%), and clinical comorbidities (15%) to yield a calibrated 0–100 risk score and 4 early warning levels:
   - 🟢 **Normal** (Score < 25%): Biometrics within baseline.
   - 🟡 **Caution** (Score 25–49%): Single parameter or emergent trend requires active monitoring.
   - 🟠 **High Risk** (Score 50–74%): Multiple abnormal parameters and deteriorating trends.
   - 🔴 **Critical** (Score ≥ 75% or severe hypoxia/BP crisis): Acute crisis requiring emergency intervention.
4. **Explainable AI (SHAP Attribution):** Decomposes every risk assessment into transparent percentage contributions and human-understandable clinical explanations.
5. **Role-Based Portals:**
   - **Patient Dashboard:** Vital sign summaries, risk gauge, interactive multi-vital trend charts, and PDF health report generation.
   - **Doctor Dashboard:** Triage roster ranked by AI risk scores, alert acknowledgment, and progress note logging.
   - **Admin Dashboard:** System telemetry, API latency, AI model validation metrics (AUC-ROC: 0.962), and HIPAA/GDPR audit trails.
6. **Live Early Warning Simulation Engine:** Built-in demo mode featuring 4 archetype patients (Normal, Caution, High Risk, Critical) with live step-through simulation.
7. **Automated Medical PDF Report Generation:** Built-in report generator delivering comprehensive, clinical-grade reports with demographic summaries, AI assessments, trend tables, and disclaimers.

---

## 📁 Repository Structure

```
vitalai/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI REST endpoints
│   │   ├── auth/            # JWT authentication & RBAC roles
│   │   ├── models/          # Database ORM models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── services/        # PDF generation, alert engine, audit
│   │   ├── database.py      # SQLite & PostgreSQL hybrid adapter
│   │   └── main.py          # FastAPI application entrypoint
│   └── requirements.txt     # Backend Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, VitalCards, TrendChart, Explainability
│   │   ├── pages/           # LandingPage, Patient, Doctor, Admin, Simulation
│   │   ├── services/        # API client with offline fallback support
│   │   ├── types/           # TypeScript data interfaces
│   │   ├── App.tsx          # Main tabbed application
│   │   └── main.tsx         # React root
│   ├── package.json         # Node.js dependencies
│   ├── tailwind.config.js   # Medical-tech Tailwind styling
│   └── vite.config.ts       # Vite build configuration
│
├── ml/
│   ├── preprocessing/       # Feature extraction, delta baselines, slopes
│   ├── models/              # Anomaly detector, Time-series trend analyzer, Risk ensemble
│   ├── explainability/      # SHAP-inspired feature attribution & clinical summaries
│   └── prediction/          # Unified inference engine
│
├── database/
│   ├── schema.sql           # Complete PostgreSQL DDL
│   └── seed.sql             # 4 Demo patients with time-series historical vitals
│
├── tests/
│   ├── test_ml_pipeline.py  # Unit tests for ML inference & categorization
│   └── test_api.py          # FastAPI test client integration tests
│
├── docker-compose.yml       # Production multi-container orchestration
├── Dockerfile.backend       # FastAPI container
├── Dockerfile.frontend      # React/Vite container
├── start.sh                 # One-click execution script
└── README.md
```

---

## 🚀 Quick Start Guide

### Option A: 1-Click Launch with Docker (Recommended)

Ensure Docker and Docker Compose are installed:
```bash
docker-compose up --build
```
Access the application:
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Local Execution (Without Docker)

#### 1. Start Backend
```bash
cd vitalai
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
export PYTHONPATH=$(pwd)
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Start Frontend
In a new terminal window:
```bash
cd vitalai/frontend
npm install
npm run dev -- --port 3000
```
Open your browser at `http://localhost:3000`.

---

## 🧪 Running Automated Tests

Run the test suite:
```bash
cd vitalai
python3 -c "
import importlib.util, sys
sys.path.insert(0, '.')
def run(mod_name, path):
    spec = importlib.util.spec_from_file_location(mod_name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

ml = run('test_ml', 'tests/test_ml_pipeline.py')
api = run('test_api', 'tests/test_api.py')

ml.test_inference_normal_patient()
ml.test_inference_critical_patient()
api.test_root_endpoint()
api.test_list_patients()
api.test_record_vitals_and_alert()
api.test_simulation_tick()
api.test_pdf_report_generation()
print('All 7 Core Verification Tests Passed!')
"
```

---

## 👥 Demo Patient Profiles

The platform includes 4 pre-configured patient archetypes:

1. **Patient 1 – Normal (Alex Norman, 34M):**
   - Vitals: HR 69 BPM, BP 118/78 mmHg, SpO₂ 99%, Glucose 92 mg/dL.
   - Status: **🟢 Normal (5.0%)** – Consistent baseline biometrics.
2. **Patient 2 – Warning (Beth Warner, 41F):**
   - Vitals: HR 89 BPM (rising), BP 144/92 mmHg, SpO₂ 97%, Glucose 115 mg/dL.
   - Status: **🟡 Caution (26.9%)** – Stage 1 Hypertension with continuous upward escalation.
3. **Patient 3 – High Risk (Carlos Mendez, 58M):**
   - Vitals: HR 98 BPM, BP 162/100 mmHg, SpO₂ 93.5%, Glucose 215 mg/dL.
   - Comorbidities: Type 2 Diabetes, CAD.
   - Status: **🟠 High Risk (74.3%)** – Acute metabolic and cardiopulmonary decompensation.
4. **Patient 4 – Critical (Diana Ross, 71F):**
   - Vitals: HR 118 BPM, BP 186/112 mmHg, SpO₂ 87%, Respiratory Rate 30/min.
   - Comorbidities: Congestive Heart Failure, COPD.
   - Status: **🔴 Critical (97.0%)** – Severe hypoxia and hypertensive emergency.

---

## 🔒 Security & Medical Compliance

- **HIPAA/GDPR Compliance:** Immutable audit logging for every clinical view, alert acknowledgment, and biometric modification.
- **Role-Based Access Control (RBAC):** Distinct roles for Patients, Attending Doctors, and System Administrators.
- **Data Encryption & Isolation:** SHA-256 password salting, JWT stateless authorization, and parameterized query validation.
