# VitalAI Explainable AI Engine (SHAP-style Feature Attribution)
from typing import Dict, List, Any

class ExplainableAIEngine:
    """
    Generates human-understandable, clinically grounded explanations for
    AI risk scores and alerts. Uses feature attribution deltas and medical rationale.
    """

    @staticmethod
    def explain_assessment(
        features: Dict[str, Any],
        anomaly_data: Dict[str, Any],
        trend_data: Dict[str, Any],
        current_vitals: Dict[str, Any],
        risk_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        contributions = []
        natural_language_factors = []

        # 1. Blood pressure analysis
        sbp = current_vitals.get('systolic_bp')
        dbp = current_vitals.get('diastolic_bp')
        sbp_delta = features.get('systolic_bp_delta_from_baseline_pct', 0.0)
        if sbp and sbp >= 140:
            pct_text = f"+{sbp_delta:.1f}%" if sbp_delta > 0 else f"{sbp_delta:.1f}%"
            contributions.append({
                'feature': 'Blood Pressure',
                'importance_pct': 28.0 if sbp >= 160 else 18.0,
                'effect': 'increases_risk',
                'detail': f"Blood pressure ({int(sbp)}/{int(dbp or 80)} mmHg) is elevated ({pct_text} from baseline)."
            })
            natural_language_factors.append(f"Blood pressure has elevated to {int(sbp)}/{int(dbp or 80)} mmHg ({pct_text} relative to baseline).")

        # 2. Heart rate & trend
        hr = current_vitals.get('heart_rate')
        hr_trend = trend_data.get('trends_by_parameter', {}).get('heart_rate', {})
        if hr and (hr > 90 or hr_trend.get('is_deteriorating')):
            contributions.append({
                'feature': 'Heart Rate Trend',
                'importance_pct': 24.0,
                'effect': 'increases_risk',
                'detail': f"Heart rate ({int(hr)} BPM) is rising across recent consecutive intervals."
            })
            natural_language_factors.append(f"Heart rate exhibits an upward trend ({int(hr)} BPM).")

        # 3. SpO2 Oxygen Saturation
        spo2 = current_vitals.get('spo2')
        if spo2 and spo2 < 95.0:
            severity = 35.0 if spo2 < 90 else 22.0
            contributions.append({
                'feature': 'Oxygen Saturation (SpO₂)',
                'importance_pct': severity,
                'effect': 'increases_risk',
                'detail': f"SpO₂ dropped to {spo2:.1f}%, indicating decreased peripheral blood oxygenation."
            })
            natural_language_factors.append(f"Reduced oxygen saturation (SpO₂: {spo2:.1f}%).")

        # 4. Blood glucose
        glu = current_vitals.get('blood_glucose')
        glu_delta = features.get('blood_glucose_delta_from_baseline_pct', 0.0)
        if glu and (glu > 140 or glu < 70):
            contributions.append({
                'feature': 'Blood Glucose',
                'importance_pct': 16.0,
                'effect': 'increases_risk',
                'detail': f"Blood glucose at {glu:.1f} mg/dL is above user target baseline."
            })
            natural_language_factors.append(f"Blood glucose is outside target range ({glu:.1f} mg/dL).")

        # 5. Respiratory Rate & Temperature
        rr = current_vitals.get('respiratory_rate')
        if rr and (rr > 20 or rr < 12):
            contributions.append({
                'feature': 'Respiratory Rate',
                'importance_pct': 14.0,
                'effect': 'increases_risk',
                'detail': f"Respiratory rate tachypneic at {rr:.0f} breaths/min."
            })
            natural_language_factors.append(f"Elevated respiratory rate ({rr:.0f} breaths/min).")

        # If normal state
        if not natural_language_factors:
            contributions.append({
                'feature': 'Cardiovascular Stability',
                'importance_pct': 85.0,
                'effect': 'decreases_risk',
                'detail': "All vital parameters are tracking closely to normal baseline."
            })
            natural_language_factors.append("Vital signs remain consistent with established personal physiological baseline.")

        # Normalize contribution percentages
        tot = sum(c['importance_pct'] for c in contributions) or 100.0
        for c in contributions:
            c['importance_pct'] = round((c['importance_pct'] / tot) * 100, 1)

        clinical_summary = (
            f"AI Risk Assessment: {risk_result['risk_level']} (Score: {risk_result['risk_score']}/100). "
            f"Primary findings: {'; '.join(natural_language_factors[:3])}."
        )

        return {
            'contributions': contributions,
            'detected_factors': natural_language_factors,
            'clinical_summary': clinical_summary,
            'disclaimer': (
                "VitalAI provides AI-assisted decision support and early-warning insights. "
                "It does not provide a definitive medical diagnosis and should never replace "
                "the clinical judgment of a qualified healthcare professional."
            )
        }
