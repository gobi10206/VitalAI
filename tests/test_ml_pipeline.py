from ml.prediction.inference_engine import VitalAIInferenceEngine

def test_inference_normal_patient():
    engine = VitalAIInferenceEngine()
    result = engine.evaluate(
        current_vitals={'heart_rate': 70, 'systolic_bp': 118, 'diastolic_bp': 78, 'spo2': 99, 'blood_glucose': 92},
        historical_vitals=[
            {'heart_rate': 68, 'systolic_bp': 116, 'diastolic_bp': 76, 'spo2': 99},
            {'heart_rate': 71, 'systolic_bp': 118, 'diastolic_bp': 78, 'spo2': 98.5}
        ]
    )
    assert result['risk_level'] == 'Normal'
    assert result['risk_score'] < 25.0
    assert not result['alert_needed']

def test_inference_critical_patient():
    engine = VitalAIInferenceEngine()
    result = engine.evaluate(
        current_vitals={
            'heart_rate': 120, 'systolic_bp': 188, 'diastolic_bp': 114, 
            'spo2': 86, 'blood_glucose': 145, 'respiratory_rate': 32,
            'symptoms': 'severe dyspnea, cyanosis'
        },
        historical_vitals=[
            {'heart_rate': 82, 'systolic_bp': 146, 'diastolic_bp': 92, 'spo2': 94},
            {'heart_rate': 95, 'systolic_bp': 160, 'diastolic_bp': 98, 'spo2': 92},
            {'heart_rate': 110, 'systolic_bp': 175, 'diastolic_bp': 106, 'spo2': 89}
        ],
        patient_profile={'existing_conditions': 'Congestive Heart Failure, COPD'}
    )
    assert result['risk_level'] == 'Critical'
    assert result['risk_score'] >= 75.0
    assert result['alert_needed']
    assert any('Oxygen' in c['feature'] or 'Blood Pressure' in c['feature'] for c in result['contributing_factors'])
