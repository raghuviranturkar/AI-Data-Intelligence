"""
Report Storage - Stores pipeline results for report generation
"""
from typing import Dict, Any, Optional

# In-memory storage for pipeline results
# In production, this would be a database
_report_storage: Dict[str, Dict[str, Any]] = {}
_last_id: int = 0


def store_results(results: Dict[str, Any]) -> str:
    """
    Store pipeline results and return a session ID
    
    Args:
        results: Pipeline results
        
    Returns:
        Session ID for retrieving results
    """
    global _last_id
    _last_id += 1
    session_id = f"report_{_last_id}"
    _report_storage[session_id] = results
    return session_id


def get_results(session_id: str) -> Optional[Dict[str, Any]]:
    """
    Get stored pipeline results by session ID
    
    Args:
        session_id: Session ID from store_results
        
    Returns:
        Pipeline results or None if not found
    """
    return _report_storage.get(session_id)


def clear_results(session_id: str):
    """
    Clear stored results for a session
    
    Args:
        session_id: Session ID to clear
    """
    if session_id in _report_storage:
        del _report_storage[session_id]


def get_all_results() -> Dict[str, Dict[str, Any]]:
    """Get all stored results (for debugging)"""
    return _report_storage.copy()
