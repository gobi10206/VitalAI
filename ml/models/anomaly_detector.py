# VitalAI Multivariate Anomaly Detection Engine
import numpy as np
from typing import Dict, List, Any

class AnomalyDetector:
    """
    Detects abnormal multi-parameter physiological states using robust 
    statistical distance and variance thresholds.
    """

    PHYSIOLOGICAL_NORMALS = {
        'heart_rate': (60.0, 100.0, 10.0),        # (mean_min, mean_max, std)
        'systolic_bp': (90.0, 120.0, 10.0),
        'diastolic_bp': (60.0, 80.0, 8.0),
        'blood_glucose': (70.0, 110.0, 15.0),
        'spo2': (95.0, 100.0, 1.5),
        'body_temperature': (36.1, 37.2, 0.4),
        'respiratory_rate': (12.0, 20.0, 2.5),
    }

    def detect_anomalies(self, current_vitals: Dict[str, Any]) -> Dict[str, Any]:
        anomalies = []
        z_scores = {}
        total_squared_z = 0.0
        count = 0

        for param, (low, high, std) in self.PHYSIOLOGICAL_NORMALS.items():
            val = current_vitals.get(param)
            if val is not None:
                val = float(val)
                z = 0.0
                if val < low:
                    z = (low - val) / std
                    anomalies.append({
                        'parameter': param,
                        'value': val,
                        'direction': 'critically_low' if z > 3.0 else 'low',
                        'deviation_score': round(z, 2),
                        'description': f"{param.replace('_', ' ').title()} is below normal range ({val} < {low})"
                    })
                elif val > high:
                    z = (val - high) / std
                    anomalies.append({
                        'parameter': param,
                        'value': val,
                        'direction': 'critically_high' if z > 3.0 else 'high',
                        'deviation_score': round(z, 2),
                        'description': f"{param.replace('_', ' ').title()} is above normal range ({val} > {high})"
                    })
                z_scores[param] = round(z, 2)
                total_squared_z += z ** 2
                count += 1

        multivariate_anomaly_index = np.sqrt(total_squared_z / count) if count > 0 else 0.0
        is_anomalous = (multivariate_anomaly_index > 1.8) or (len(anomalies) >= 2) or any(a['deviation_score'] > 3.0 for a in anomalies)

        return {
            'is_anomalous': bool(is_anomalous),
            'anomaly_index': round(float(multivariate_anomaly_index), 3),
            'detected_anomalies': anomalies,
            'z_scores': z_scores
        }
