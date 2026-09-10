# VitalAI Temporal Trend Analysis Engine
import numpy as np
from typing import Dict, List, Any

class TimeSeriesTrendDetector:
    """
    Detects dynamic temporal trajectories across sequences of vital signs.
    Identifies worsening trends before hard individual thresholds are crossed.
    Example: 72 -> 78 -> 84 -> 91 -> 95 BPM (rising tachycardia progression).
    """

    @staticmethod
    def analyze_trends(history: List[Dict[str, Any]], current: Dict[str, Any]) -> Dict[str, Any]:
        trends = {}
        all_points = list(history) + [current]
        
        for param in ['heart_rate', 'systolic_bp', 'diastolic_bp', 'spo2', 'blood_glucose', 'body_temperature', 'respiratory_rate']:
            values = [float(p[param]) for p in all_points if p.get(param) is not None]
            if len(values) < 2:
                trends[param] = {
                    'trajectory': 'stable',
                    'slope': 0.0,
                    'delta_absolute': 0.0,
                    'is_deteriorating': False,
                    'description': 'Insufficient temporal measurements'
                }
                continue

            delta_abs = values[-1] - values[0]
            recent_diffs = np.diff(values)
            slope = float(np.mean(recent_diffs))
            
            is_deteriorating = False
            trajectory = 'stable'
            desc = 'Values are stable within typical fluctuations.'

            if param == 'spo2':
                # Falling oxygen is dangerous
                if values[-1] < 92:
                    is_deteriorating = True
                    trajectory = 'critical_hypoxia'
                    desc = f"SpO₂ is critically low at {values[-1]:.1f}%."
                elif len(values) >= 3 and np.all(recent_diffs[-2:] < 0) and (values[0] - values[-1]) >= 3.0:
                    is_deteriorating = True
                    trajectory = 'worsening_fall'
                    desc = f"SpO₂ has experienced a sustained decline ({values[0]:.1f}% → {values[-1]:.1f}%)."
                elif slope < -1.0:
                    trajectory = 'slight_decline'
            elif param in ['heart_rate', 'systolic_bp', 'diastolic_bp', 'blood_glucose', 'body_temperature', 'respiratory_rate']:
                # Continuous upward escalation
                if len(recent_diffs) >= 3 and np.all(recent_diffs[-3:] > 0) and (values[-1] - values[-4 if len(values)>=4 else 0]) >= 12:
                    is_deteriorating = True
                    trajectory = 'sustained_rise'
                    desc = f"{param.replace('_', ' ').title()} exhibits continuous upward escalation across last {min(4, len(values))} readings."
                elif len(values) >= 3 and slope > 4.0:
                    is_deteriorating = True
                    trajectory = 'accelerated_rise'
                    desc = f"{param.replace('_', ' ').title()} is rising rapidly ({slope:+.1f}/interval)."
                elif slope > 1.0:
                    trajectory = 'mild_rise'
                elif slope < -2.0:
                    trajectory = 'falling'

            trends[param] = {
                'trajectory': trajectory,
                'slope': round(slope, 3),
                'delta_absolute': round(delta_abs, 2),
                'is_deteriorating': is_deteriorating,
                'series_sample': values[-5:],
                'description': desc
            }

        worsening_count = sum(1 for t in trends.values() if t['is_deteriorating'])
        return {
            'trends_by_parameter': trends,
            'worsening_parameters_count': worsening_count,
            'overall_trajectory': 'Critical Deterioration' if worsening_count >= 3 else (
                'Moderate Deterioration' if worsening_count >= 1 else 'Stable'
            )
        }
