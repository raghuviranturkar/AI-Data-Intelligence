"""
Custom JSON Encoder to handle numpy and pandas types including NaN
"""
import json
import numpy as np
import pandas as pd
from datetime import datetime, date
from decimal import Decimal
import math


def convert_to_serializable(obj):
    """Recursively convert object to JSON-serializable format"""
    if isinstance(obj, (np.int64, np.int32, np.int16, np.int8)):
        return int(obj)
    elif isinstance(obj, (np.float64, np.float32, np.float16)):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.void):
        return None
    elif isinstance(obj, pd.Series):
        return obj.tolist()
    elif isinstance(obj, pd.DataFrame):
        return obj.to_dict(orient='records')
    elif isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    elif isinstance(obj, (datetime, date)):
        return obj.isoformat()
    elif isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, set):
        return list(obj)
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_to_serializable(v) for v in obj]
    elif hasattr(obj, 'tolist'):
        return obj.tolist()
    else:
        return obj


class NumpyJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles numpy, pandas types, and NaN"""
    
    def default(self, obj):
        result = convert_to_serializable(obj)
        if result != obj:
            return result
        try:
            return super().default(obj)
        except TypeError:
            return str(obj)


def to_json(obj):
    """Convert object to JSON string with numpy support"""
    return json.dumps(obj, cls=NumpyJSONEncoder, indent=2)


def from_json(json_str):
    """Parse JSON string"""
    return json.loads(json_str)
