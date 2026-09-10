# VitalAI Calibrated Risk Classification & Scoring Ensemble
from typing import Dict, List, Any

class RiskClassifierEnsemble:
    @classmethod
    def compute_risk(
        cls,
        features: Dict[str, Any],
        anomaly_result: Dict[str, Any],
        trend_result: Dict[str, Any],
        patient_profile: Dict[str, Any],
        current_vitals: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        vital_score = 0.0
        hr = current_vitals.get('heart_rate', 72) or 72
        sbp = current_vitals.get('systolic_bp', 120) or 120
        dbp = current_vitals.get('diastolic_bp', 80) or 80
        spo2 = current_vitals.get('spo2', 98) or 98
        glu = current_vitals.get('blood_glucose', 95) or 95
        temp = current_vitals.get('body_temperature', 36.6) or 36.6
        rr = current_vitals.get('respiratory_rate', 16) or 16

        # SpO2
        if spo2 < 88: vital_score += 45
        elif spo2 < 92: vital_score += 30
        elif spo2 < 95: vital_score += 15

        # BP
        if sbp >= 180 or dbp >= 110: vital_score += 40
        elif sbp >= 160 or dbp >= 100: vital_score += 25
        elif sbp >= 140 or dbp >= 90: vital_score += 15
        elif sbp >= 130: vital_score += 8

        # HR
        if hr > 130 or hr < 40: vital_score += 35
        elif hr > 110 or hr < 50: vital_score += 20
        elif hr > 95: vital_score += 10

        # Glucose
        if glu > 250 or glu < 55: vital_score += 30
        elif glu > 180 or glu < 70: vital_score += 18
        elif glu > 140: vital_score += 8

        # RR
        if rr >= 28 or rr <= 8: vital_score += 30
        elif rr >= 22: vital_score += 15

        # Temp
        if temp >= 39.0 or temp <= 35.0: vital_score += 25
        elif temp >= 38.0: vital_score += 12

        subscore_vitals = min(100.0, vital_score)

        anomaly_index = anomaly_result.get('anomaly_index', 0.0)
        subscore_anomaly = min(100.0, anomaly_index * 25.0)

        worsening_count = trend_result.get('worsening_parameters_count', 0)
        subscore_trends = min(100.0, worsening_count * 25.0)

        subscore_context = 5.0
        conditions = str(patient_profile.get('existing_conditions', '')).lower()
        if 'chf' in conditions or 'heart failure' in conditions: subscore_context += 25
        if 'copd' in conditions: subscore_context += 20
        if 'cad' in conditions or 'coronary' in conditions: subscore_context += 20
        if 'diabetes' in conditions: subscore_context += 15
        
        symptoms = str(current_vitals.get('symptoms', '')).lower()
        if any(w in symptoms for w in ['cyanosis', 'chest pain', 'confusion', 'distress', 'gasping']):
            subscore_context += 30
        elif any(w in symptoms for w in ['palpitations', 'headache', 'fatigue', 'shortness of breath']):
            subscore_context += 15
        subscore_context = min(100.0, subscore_context)

        final_score = (
            subscore_vitals * 0.40 +
            subscore_anomaly * 0.20 +
            subscore_trends * 0.25 +
            subscore_context * 0.15
        )
        final_score = max(5.0, min(99.0, round(final_score, 1)))

        if final_score >= 75.0 or spo2 < 89.0 or (sbp >= 180 and dbp >= 110):
            risk_level = 'Critical'
            recommendation = "Potentially dangerous abnormalities detected. Seek immediate professional emergency medical care (call emergency services or go to the nearest emergency department)."
        elif final_score >= 50.0:
            risk_level = 'High Risk'
            recommendation = "Multiple abnormal health indicators and worsening trends identified. Seek prompt medical evaluation from your physician or urgent care center today."
        elif final_score >= 25.0:
            risk_level = 'Caution'
            recommendation = "A parameter or health trend requires active monitoring. Recheck measurements in 2-4 hours, avoid physical exertion, and contact your doctor if symptoms persist."
        else:
            risk_level = 'Normal'
            recommendation = "Health parameters and vital sign trajectories are currently within expected baseline physiological ranges. Continue regular healthy habits."

        confidence = 0.95 if len(anomaly_result.get('z_scores', {})) >= 5 else 0.85

        return {
            'risk_score': final_score,
            'risk_level': risk_level,
            'confidence_score': confidence,
            'subscores': {
                'vitals_severity': round(subscore_vitals, 1),
                'anomaly_deviation': round(subscore_anomaly, 1),
                'temporal_trends': round(subscore_trends, 1),
                'clinical_context': round(subscore_context, 1)
            },
            'recommendation': recommendation
        }
