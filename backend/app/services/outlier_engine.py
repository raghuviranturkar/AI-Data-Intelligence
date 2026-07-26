"""
Outlier Detection & Distribution Analysis Engine
Handles datasets with no numeric columns gracefully
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from enum import Enum


class Severity(Enum):
    NONE = "None"
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class DistributionType(Enum):
    NORMAL = "Approximately Normal"
    RIGHT_SKEWED = "Right Skewed"
    LEFT_SKEWED = "Left Skewed"
    UNKNOWN = "Unknown"


class OutlierEngine:
    def __init__(self, df: pd.DataFrame, context: Dict[str, Any] = None):
        self.df = df
        self.context = context or {}
        self.numeric_columns = []
        self.outlier_results = {}
        self.distribution_results = {}
        
    def get_numeric_columns(self) -> List[str]:
        all_numeric = self.df.select_dtypes(include=[np.number]).columns.tolist()
        excluded = set()
        
        for col in all_numeric:
            unique_values = self.df[col].dropna().unique()
            if len(unique_values) == 2 and set(unique_values).issubset({0, 1}):
                excluded.add(col)
        
        if 'validation' in self.context:
            validation = self.context['validation']
            if 'profiling' in validation:
                id_cols = validation['profiling'].get('id_columns', [])
                excluded.update(id_cols)
        
        for col in all_numeric:
            if col not in excluded:
                unique_count = self.df[col].nunique()
                if unique_count == len(self.df):
                    excluded.add(col)
        
        self.numeric_columns = [col for col in all_numeric if col not in excluded]
        return self.numeric_columns
    
    def detect_outliers_iqr(self, column: str) -> Dict[str, Any]:
        clean_data = self.df[column].dropna()
        clean_data = clean_data.replace([np.inf, -np.inf], np.nan).dropna()
        
        if len(clean_data) == 0:
            return {"method": "IQR", "error": "No valid data", "outlier_count": 0, "outlier_percentage": 0}
        
        q1 = clean_data.quantile(0.25)
        q3 = clean_data.quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outliers = clean_data[(clean_data < lower_bound) | (clean_data > upper_bound)]
        
        outlier_count = len(outliers)
        total_count = len(clean_data)
        outlier_percentage = (outlier_count / total_count) * 100 if total_count > 0 else 0
        
        return {
            "method": "IQR",
            "q1": float(q1) if not pd.isna(q1) else None,
            "q3": float(q3) if not pd.isna(q3) else None,
            "iqr": float(iqr) if not pd.isna(iqr) else None,
            "lower_bound": float(lower_bound) if not pd.isna(lower_bound) else None,
            "upper_bound": float(upper_bound) if not pd.isna(upper_bound) else None,
            "outlier_count": int(outlier_count),
            "outlier_percentage": round(float(outlier_percentage), 2),
            "outlier_values": outliers.tolist()[:10],
            "row_indices": outliers.index.tolist()[:10],
            "min": float(clean_data.min()) if not pd.isna(clean_data.min()) else None,
            "max": float(clean_data.max()) if not pd.isna(clean_data.max()) else None,
            "mean": float(clean_data.mean()) if not pd.isna(clean_data.mean()) else None,
            "median": float(clean_data.median()) if not pd.isna(clean_data.median()) else None
        }
    
    def classify_severity(self, outlier_percentage: float) -> str:
        if outlier_percentage == 0:
            return Severity.NONE.value
        elif outlier_percentage < 5:
            return Severity.LOW.value
        elif outlier_percentage < 15:
            return Severity.MEDIUM.value
        else:
            return Severity.HIGH.value
    
    def analyze_distribution(self, column: str) -> Dict[str, Any]:
        clean_data = self.df[column].dropna()
        clean_data = clean_data.replace([np.inf, -np.inf], np.nan).dropna()
        
        if len(clean_data) < 3:
            return {"distribution_type": DistributionType.UNKNOWN.value, "skewness": None, "kurtosis": None}
        
        skewness = clean_data.skew()
        kurtosis = clean_data.kurt()
        
        if abs(skewness) < 0.5:
            dist_type = DistributionType.NORMAL.value
        elif skewness > 0:
            dist_type = DistributionType.RIGHT_SKEWED.value
        else:
            dist_type = DistributionType.LEFT_SKEWED.value
        
        return {
            "distribution_type": dist_type,
            "skewness": round(float(skewness), 3) if not pd.isna(skewness) else None,
            "kurtosis": round(float(kurtosis), 3) if not pd.isna(kurtosis) else None
        }
    
    def get_business_recommendation(self, column: str, outlier_count: int, outlier_percentage: float,
                                    min_val: float, max_val: float, mean_val: float) -> Dict[str, Any]:
        if outlier_count == 0:
            return {"action": "No Action Needed", "reason": f"No outliers detected in '{column}'."}
        
        if min_val is not None and min_val < 0 and column.lower() in ['age', 'salary', 'price', 'revenue']:
            return {"action": "Investigate", "reason": f"Negative values found in '{column}'."}
        
        if outlier_percentage < 5:
            return {"action": "Keep", "reason": f"Only {outlier_percentage:.1f}% outliers - may be legitimate."}
        elif outlier_percentage < 15:
            return {"action": "Review", "reason": f"{outlier_percentage:.1f}% outliers - consider domain review."}
        else:
            return {"action": "Consider Cleaning", "reason": f"High outlier percentage ({outlier_percentage:.1f}%)."}
    
    def calculate_risk_score(self, severity: str, outlier_percentage: float) -> float:
        severity_scores = {Severity.NONE.value: 0, Severity.LOW.value: 25, Severity.MEDIUM.value: 50, Severity.HIGH.value: 75}
        base_score = severity_scores.get(severity, 0)
        percentage_adjustment = min(outlier_percentage * 2, 25)
        return min(base_score + percentage_adjustment, 100)
    
    def generate_plot_recommendation(self, column: str, dist_type: str) -> Dict[str, str]:
        if dist_type == DistributionType.NORMAL.value:
            return {"recommended_plot": "histogram", "reason": "Normal distribution", "additional_plots": ["qq_plot"]}
        else:
            return {"recommended_plot": "boxplot", "reason": "Non-normal distribution", "additional_plots": ["histogram"]}
    
    def analyze_column(self, column: str) -> Dict[str, Any]:
        outlier_result = self.detect_outliers_iqr(column)
        if "error" in outlier_result:
            return {"column": column, "error": outlier_result["error"]}
        
        distribution = self.analyze_distribution(column)
        severity = self.classify_severity(outlier_result["outlier_percentage"])
        recommendation = self.get_business_recommendation(
            column, outlier_result["outlier_count"], outlier_result["outlier_percentage"],
            outlier_result["min"], outlier_result["max"], outlier_result["mean"]
        )
        risk_score = self.calculate_risk_score(severity, outlier_result["outlier_percentage"])
        plot_rec = self.generate_plot_recommendation(column, distribution["distribution_type"])
        
        return {
            "column": column,
            "outlier_analysis": outlier_result,
            "distribution": distribution,
            "severity": severity,
            "risk_score": round(risk_score, 1),
            "recommendation": recommendation,
            "visualization": plot_rec
        }
    
    def generate_rankings(self) -> Dict[str, Any]:
        valid_results = {}
        for col, result in self.outlier_results.items():
            if isinstance(result, dict) and "outlier_analysis" in result:
                valid_results[col] = result
        
        sorted_columns = sorted(
            valid_results.items(),
            key=lambda x: x[1]["outlier_analysis"].get("outlier_percentage", 0),
            reverse=True
        )
        ranking = [col for col, _ in sorted_columns]
        return {"ranking": ranking, "highest_outlier_column": ranking[0] if ranking else None}
    
    def generate_summary(self) -> Dict[str, Any]:
        columns_with_outliers = 0
        total_outliers = 0
        
        for col, result in self.outlier_results.items():
            if isinstance(result, dict) and "outlier_analysis" in result:
                outlier_count = result["outlier_analysis"].get("outlier_count", 0)
                if outlier_count > 0:
                    columns_with_outliers += 1
                    total_outliers += outlier_count
        
        severity_counts = {Severity.NONE.value: 0, Severity.LOW.value: 0, Severity.MEDIUM.value: 0, Severity.HIGH.value: 0}
        for col, result in self.outlier_results.items():
            if isinstance(result, dict) and "severity" in result:
                severity_counts[result["severity"]] = severity_counts.get(result["severity"], 0) + 1
        
        riskiest = []
        for col, result in self.outlier_results.items():
            if isinstance(result, dict) and "risk_score" in result:
                riskiest.append((col, result["risk_score"]))
        riskiest = sorted(riskiest, key=lambda x: x[1], reverse=True)[:3]
        
        return {
            "columns_analyzed": len(self.numeric_columns),
            "columns_with_outliers": columns_with_outliers,
            "total_outliers": total_outliers,
            "severity_distribution": severity_counts,
            "riskiest_columns": riskiest,
            "has_numeric_data": len(self.numeric_columns) > 0
        }
    
    def analyze_all(self) -> Dict[str, Any]:
        self.get_numeric_columns()
        
        if not self.numeric_columns:
            return {
                "analysis": {},
                "summary": {
                    "columns_analyzed": 0,
                    "columns_with_outliers": 0,
                    "total_outliers": 0,
                    "severity_distribution": {Severity.NONE.value: 0, Severity.LOW.value: 0, Severity.MEDIUM.value: 0, Severity.HIGH.value: 0},
                    "riskiest_columns": [],
                    "has_numeric_data": False,
                    "message": "No numeric columns found for outlier detection"
                },
                "rankings": {"ranking": [], "highest_outlier_column": None},
                "columns_analyzed": []
            }
        
        for col in self.numeric_columns:
            self.outlier_results[col] = self.analyze_column(col)
        
        rankings = self.generate_rankings()
        summary = self.generate_summary()
        
        return {
            "analysis": self.outlier_results,
            "summary": summary,
            "rankings": rankings,
            "columns_analyzed": self.numeric_columns
        }


def detect_outliers(df: pd.DataFrame, context: Dict[str, Any] = None) -> Dict[str, Any]:
    engine = OutlierEngine(df, context)
    return engine.analyze_all()
