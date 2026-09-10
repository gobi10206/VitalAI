# VitalAI Preprocessing and Feature Engineering Pipeline
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional

class HealthDataPipeline:
    """
    Validates, cleans, imputes, and extracts high-order temporal features
    from patient vital records and historical baseline.
    """
    
    PARAM_BOUNDS = {
        'heart_rate': (30.0, 220.0),
        'systolic_bp': (60.0, 260.0),
        'diastolic_bp': (40.0, 150.0),
        'blood_glucose': (40.0, 500.0),
        'spo2': (65.0, 100.0),
        'body_temperature': (34.0, 42.5),
        'respiratory_rate': (6.0, 60.0),
    }

    DEFAULT_BASELINES = {
        'baseline_heart_rate': 72.0,
        'baseline_systolic_bp': 120.0,
        'baseline_diastolic_bp': 80.0,
        'baseline_spo2': 98.0,
        'baseline_glucose': 95.0,
    }

    @classmethod
    def validate_and_clean_record(cls, record: Dict[str, Any]) -> Dict[str, float]:
        """Clips invalid biometric outliers and handles missing values."""
        cleaned = {}
        for param, (low, high) in cls.PARAM_BOUNDS.items():
            val = record.get(param)
            if val is not None and not np.isnan(float(val)):
                cleaned[param] = float(np.clip(float(val), low, high))
            else:
                cleaned[param] = None
        return cleaned

    @classmethod
    def compute_temporal_features(
        cls, 
        history_records: List[Dict[str, Any]], 
        current_record: Dict[str, Any],
        baseline: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Computes rolling statistics, percentage deltas from patient baseline,
        and first-derivative slope/trend acceleration.
        """
        base = baseline or cls.DEFAULT_BASELINES
        all_records = list(history_records) + [current_record]
        df = pd.DataFrame(all_records)
        
        features = {}
        for param in cls.PARAM_BOUNDS.keys():
            if param in df.columns and not df[param].dropna().empty:
                series = df[param].astype(float).dropna()
                curr_val = float(series.iloc[-1])
                features[f'{param}_current'] = curr_val
                
                # Baseline delta
                base_key = f'baseline_{param}' if f'baseline_{param}' in base else (
                    'baseline_glucose' if param == 'blood_glucose' else None
                )
                b_val = float(base.get(base_key, cls.DEFAULT_BASELINES.get(base_key, curr_val))) if base_key else curr_val
                delta_pct = ((curr_val - b_val) / (b_val if b_val > 0 else 1.0)) * 100.0
                features[f'{param}_delta_from_baseline_pct'] = delta_pct

                # Rolling stats
                if len(series) >= 2:
                    slope = float(series.diff().iloc[-1])
                    features[f'{param}_recent_slope'] = slope
                    features[f'{param}_pct_change_last_step'] = (slope / (series.iloc[-2] if series.iloc[-2] > 0 else 1)) * 100
                else:
                    features[f'{param}_recent_slope'] = 0.0
                    features[f'{param}_pct_change_last_step'] = 0.0
                    
                if len(series) >= 3:
                    # Consecutive direction
                    diffs = series.diff().dropna().iloc[-3:].values
                    features[f'{param}_is_monotonically_rising'] = bool(np.all(diffs > 0))
                    features[f'{param}_is_monotonically_falling'] = bool(np.all(diffs < 0))
                    features[f'{param}_rolling_std'] = float(series.iloc[-3:].std())
                else:
                    features[f'{param}_is_monotonically_rising'] = False
                    features[f'{param}_is_monotonically_falling'] = False
                    features[f'{param}_rolling_std'] = 0.0
            else:
                features[f'{param}_current'] = None
                features[f'{param}_delta_from_baseline_pct'] = 0.0
                features[f'{param}_recent_slope'] = 0.0
                features[f'{param}_pct_change_last_step'] = 0.0
                features[f'{param}_is_monotonically_rising'] = False
                features[f'{param}_is_monotonically_falling'] = False
                features[f'{param}_rolling_std'] = 0.0

        return features
