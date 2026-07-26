"""
Custom JSON Encoder to handle numpy and pandas types
"""
import json
import numpy as np
import pandas as pd
from datetime import datetime, date
from decimal import Decimal


class NumpyJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles numpy and pandas types"""
    
    def default(self, obj):
        # Handle numpy types
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, np.bool_):
            return bool(obj)
        elif isinstance(obj, np.void):
            return None
        
        # Handle pandas types
        elif isinstance(obj, pd.Series):
            return obj.tolist()
        elif isinstance(obj, pd.DataFrame):
            return obj.to_dict(orient='records')
        elif isinstance(obj, pd.Timestamp):
            return obj.isoformat()
        
        # Handle other types
        elif isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, date):
            return obj.isoformat()
        elif isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, set):
            return list(obj)
        elif hasattr(obj, 'tolist'):
            return obj.tolist()
        
        # For any other type, try to convert to dict
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
