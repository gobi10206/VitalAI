# VitalAI Master Inference Engine
from typing import Dict, List, Any, Optional
from ml.preprocessing.pipeline import HealthDataPipeline
from ml.models.anomaly_detector import AnomalyDetector
from ml.models.time_series_detector import TimeSeriesTrendDetector
from ml.models.risk_classifier import RiskClassifierEnsemble
from ml.explainability.shap_explainer import ExplainableAIEngine

class VitalAIInferenceEngine:
    """
    Coordinates the complete AI Health Monitoring & Early Warning Pipeline.
    """

    def __init__(self):
        self.anomaly_detector = AnomalyDetector()
        self.trend_detector = TimeSeriesTrendDetector()

    def evaluate(
        self,
        current_vitals: Dict[str, Any],
        historical_vitals: Optional[List[Dict[str, Any]]] = None,
        patient_profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        history = historical_vitals or []
        profile = patient_profile or {}

        # 1. Feature Engineering & Preprocessing
        features = HealthDataPipeline.compute_temporal_features(history, current_vitals, profile)

        # 2. Multivariate Anomaly Detection
        anomaly_res = self.anomaly_detector.detect_anomalies(current_vitals)

        # 3. Temporal Trend Progression Detection
        trend_res = self.trend_detector.analyze_trends(history, current_vitals)

        # 4. Ensemble Risk Scoring & Categorization
        risk_res = RiskClassifierEnsemble.compute_risk(
            features=features,
            anomaly_result=anomaly_res,
            trend_result=trend_res,
            patient_profile=profile,
            current_vitals=current_vitals
        )

        # 5. Explainable AI & SHAP attribution
        explain_res = ExplainableAIEngine.explain_assessment(
            features=features,
            anomaly_data=anomaly_res,
            trend_data=trend_res,
            current_vitals=current_vitals,
            risk_result=risk_res
        )

        # 6. Compose Early Warning Alert output
        alert_needed = risk_res['risk_level'] in ['Caution', 'High Risk', 'Critical']
        
        return {
            'risk_score': risk_res['risk_score'],
            'risk_level': risk_res['risk_level'],
            'confidence_score': risk_res['confidence_score'],
            'subscores': risk_res['subscores'],
            'recommendation': risk_res['recommendation'],
            'is_anomalous': anomaly_res['is_anomalous'],
            'anomaly_index': anomaly_res['anomaly_index'],
            'anomaly_details': anomaly_res['detected_anomalies'],
            'trends': trend_res['trends_by_parameter'],
            'worsening_count': trend_res['worsening_parameters_count'],
            'overall_trajectory': trend_res['overall_trajectory'],
            'contributing_factors': explain_res['contributions'],
            'detected_factors': explain_res['detected_factors'],
            'clinical_summary': explain_res['clinical_summary'],
            'disclaimer': explain_res['disclaimer'],
            'alert_needed': alert_needed
        }
