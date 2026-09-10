from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get('/')
    assert response.status_code == 200
    data = response.json()
    assert data['platform'] == 'VitalAI'
    assert 'medical_disclaimer' in data

def test_list_patients():
    response = client.get('/api/patients')
    assert response.status_code == 200
    patients = response.json()
    assert len(patients) >= 4

def test_record_vitals_and_alert():
    payload = {
        'patient_id': 'pat-01',
        'heart_rate': 72.0,
        'systolic_bp': 120.0,
        'diastolic_bp': 80.0,
        'blood_glucose': 95.0,
        'spo2': 98.5,
        'body_temperature': 36.6,
        'respiratory_rate': 16.0
    }
    response = client.post('/api/vitals/record', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'success'
    assert 'ai_assessment' in data

def test_simulation_tick():
    response = client.post('/api/simulation/tick', json={'patient_key': 'patient_2', 'step': 3})
    assert response.status_code == 200
    data = response.json()
    assert data['patient_name'] != ''
    assert 'ai_assessment' in data

def test_pdf_report_generation():
    response = client.get('/api/reports/generate/pat-01')
    assert response.status_code == 200
    assert response.headers['content-type'] == 'application/pdf'
    assert len(response.content) > 1000
