"""
Outlier Detection & Distribution Analysis Engine
Detects outliers using IQR method and provides business recommendations
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from enum import Enum


class Severity(Enum):
    """Severity levels for outliers"""
    NONE = "None"
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class DistributionType(Enum):
    """Distribution types for numeric columns"""
    NORMAL = "Approximately Normal"
    RIGHT_SKEWED = "Right Skewed"
    LEFT_SKEWED = "Left Skewed"
    UNKNOWN = "Unknown"


class OutlierEngine:
    """
    Detects outliers and analyzes distributions for numeric columns
    Uses IQR method for outlier detection
    """
    
    def __init__(self, df: pd.DataFrame, context: Dict[str, Any] = None):
        """
        Initialize outlier engine
        
        Args:
            df: Pandas DataFrame to analyze
            context: Shared analysis context from previous engines
        """
        self.df = df
        self.context = context or {}
        self.numeric_columns = []
        self.outlier_results = {}
        self.distribution_results = {}
        
    def get_numeric_columns(self) -> List[str]:
        """
        Get numeric columns excluding identifiers, booleans, and dates
        """
        # Get all numeric columns
        all_numeric = self.df.select_dtypes(include=[np.number]).columns.tolist()
        
        # Get columns to exclude
        excluded = set()
        
        # Exclude boolean columns (0/1 values)
        for col in all_numeric:
            unique_values = self.df[col].dropna().unique()
            # Only exclude if it's strictly boolean (only 0 and 1 values)
            if len(unique_values) == 2 and set(unique_values).issubset({0, 1}):
                excluded.add(col)
        
        # Exclude ID columns from validation report
        if 'validation' in self.context:
            validation = self.context['validation']
            if 'profiling' in validation:
                id_cols = validation['profiling'].get('id_columns', [])
                excluded.update(id_cols)
        
        # Only exclude columns that are IDs AND have unique values == total rows
        # This is more selective
        for col in all_numeric:
            if col not in excluded:
                unique_count = self.df[col].nunique()
                # Only exclude if it's very clearly an ID (unique values == rows AND column name suggests ID)
                if unique_count == len(self.df):
                    col_lower = col.lower()
                    id_patterns = ['id', 'code', 'number', 'no', 'index']
                    if any(pattern in col_lower for pattern in id_patterns):
                        excluded.add(col)
        
        # Return filtered list
        self.numeric_columns = [col for col in all_numeric if col not in excluded]
        return self.numeric_columns
    
    def detect_outliers_iqr(self, column: str) -> Dict[str, Any]:
        """
        Detect outliers using IQR method
        
        Args:
            column: Column name to analyze
            
        Returns:
            Dictionary with outlier analysis results
        """
        # Get clean data (remove NaN)
        clean_data = self.df[column].dropna()
        
        if len(clean_data) == 0:
            return {
                "method": "IQR",
                "error": "No valid data"
            }
        
        # Calculate quartiles
        q1 = clean_data.quantile(0.25)
        q3 = clean_data.quantile(0.75)
        iqr = q3 - q1
        
        # Calculate bounds
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        # Find outliers
        outliers = clean_data[(clean_data < lower_bound) | (clean_data > upper_bound)]
        
        # Get outlier values (limit to first 10)
        outlier_values = outliers.tolist()[:10]
        
        # Get row indices
        outlier_indices = outliers.index.tolist()[:10]
        
        # Calculate outlier stats
        outlier_count = len(outliers)
        total_count = len(clean_data)
        outlier_percentage = (outlier_count / total_count) * 100 if total_count > 0 else 0
        
        return {
            "method": "IQR",
            "q1": float(q1),
            "q3": float(q3),
            "iqr": float(iqr),
            "lower_bound": float(lower_bound),
            "upper_bound": float(upper_bound),
            "outlier_count": outlier_count,
            "outlier_percentage": round(outlier_percentage, 2),
            "outlier_values": outlier_values,
            "row_indices": outlier_indices,
            "min": float(clean_data.min()),
            "max": float(clean_data.max()),
            "mean": float(clean_data.mean()),
            "median": float(clean_data.median())
        }
    
    def classify_severity(self, outlier_percentage: float) -> str:
        """
        Classify outlier severity based on percentage
        
        Args:
            outlier_percentage: Percentage of outliers
            
        Returns:
            Severity level
        """
        if outlier_percentage == 0:
            return Severity.NONE.value
        elif outlier_percentage < 5:
            return Severity.LOW.value
        elif outlier_percentage < 15:
            return Severity.MEDIUM.value
        else:
            return Severity.HIGH.value
    
    def analyze_distribution(self, column: str) -> Dict[str, Any]:
        """
        Analyze distribution shape for a numeric column
        
        Args:
            column: Column name to analyze
            
        Returns:
            Distribution analysis results
        """
        clean_data = self.df[column].dropna()
        
        if len(clean_data) < 3:
            return {
                "distribution_type": DistributionType.UNKNOWN.value,
                "skewness": None,
                "kurtosis": None
            }
        
        # Calculate skewness and kurtosis
        skewness = clean_data.skew()
        kurtosis = clean_data.kurt()
        
        # Classify distribution
        if abs(skewness) < 0.5:
            dist_type = DistributionType.NORMAL.value
        elif skewness > 0:
            dist_type = DistributionType.RIGHT_SKEWED.value
        else:
            dist_type = DistributionType.LEFT_SKEWED.value
        
        return {
            "distribution_type": dist_type,
            "skewness": round(float(skewness), 3),
            "kurtosis": round(float(kurtosis), 3)
        }
    
    def get_business_recommendation(self, column: str, 
                                    outlier_count: int, 
                                    outlier_percentage: float,
                                    min_val: float,
                                    max_val: float,
                                    mean_val: float) -> Dict[str, Any]:
        """
        Generate business-relevant recommendation
        
        Args:
            column: Column name
            outlier_count: Number of outliers
            outlier_percentage: Percentage of outliers
            min_val: Minimum value
            max_val: Maximum value
            mean_val: Mean value
            
        Returns:
            Business recommendation
        """
        # Check for negative values in positive-only columns
        if min_val < 0 and column.lower() in ['age', 'salary', 'price', 'revenue', 'score']:
            return {
                "action": "Investigate",
                "reason": f"Negative values found in '{column}' which should be positive. Possible data entry errors."
            }
        
        # Check for extreme values
        if outlier_count > 0:
            if outlier_percentage < 5:
                # Check if outliers are on the high end (possible VIP customers)
                if max_val > mean_val * 2:
                    return {
                        "action": "Keep",
                        "reason": f"Only {outlier_percentage:.1f}% outliers in '{column}'. These may represent legitimate extreme cases (e.g., VIP customers, exceptional performance)."
                    }
                else:
                    return {
                        "action": "Keep",
                        "reason": f"Only {outlier_percentage:.1f}% outliers in '{column}'. These may represent legitimate edge cases."
                    }
            elif outlier_percentage < 15:
                return {
                    "action": "Review",
                    "reason": f"{outlier_percentage:.1f}% outliers in '{column}'. Consider domain-specific review before removal."
                }
            else:
                return {
                    "action": "Consider Cleaning",
                    "reason": f"High outlier percentage ({outlier_percentage:.1f}%) in '{column}'. Data quality may be an issue."
                }
        
        return {
            "action": "No Action Needed",
            "reason": f"No outliers detected in '{column}'."
        }
    
    def calculate_risk_score(self, severity: str, outlier_percentage: float) -> float:
        """
        Calculate risk score for a column
        
        Args:
            severity: Severity level
            outlier_percentage: Percentage of outliers
            
        Returns:
            Risk score (0-100)
        """
        severity_scores = {
            Severity.NONE.value: 0,
            Severity.LOW.value: 25,
            Severity.MEDIUM.value: 50,
            Severity.HIGH.value: 75
        }
        
        # Adjust score based on percentage
        base_score = severity_scores.get(severity, 0)
        percentage_adjustment = min(outlier_percentage * 2, 25)
        
        return min(base_score + percentage_adjustment, 100)
    
    def generate_plot_recommendation(self, column: str, dist_type: str) -> Dict[str, str]:
        """
        Recommend appropriate plot type for visualization
        
        Args:
            column: Column name
            dist_type: Distribution type
            
        Returns:
            Plot recommendation
        """
        if dist_type == DistributionType.NORMAL.value:
            return {
                "recommended_plot": "histogram",
                "reason": "Normal distribution - histogram works well",
                "additional_plots": ["qq_plot"]
            }
        elif dist_type in [DistributionType.RIGHT_SKEWED.value, DistributionType.LEFT_SKEWED.value]:
            return {
                "recommended_plot": "boxplot",
                "reason": f"{dist_type} distribution - boxplot shows skewness effectively",
                "additional_plots": ["histogram", "density_plot"]
            }
        else:
            return {
                "recommended_plot": "boxplot",
                "reason": "Unknown distribution - boxplot provides robust overview",
                "additional_plots": ["histogram"]
            }
    
    def analyze_column(self, column: str) -> Dict[str, Any]:
        """
        Complete analysis for a single column
        
        Args:
            column: Column name
            
        Returns:
            Comprehensive column analysis
        """
        # Outlier detection
        outlier_result = self.detect_outliers_iqr(column)
        
        if "error" in outlier_result:
            return outlier_result
        
        # Distribution analysis
        distribution = self.analyze_distribution(column)
        
        # Severity classification
        severity = self.classify_severity(outlier_result["outlier_percentage"])
        
        # Business recommendation
        recommendation = self.get_business_recommendation(
            column,
            outlier_result["outlier_count"],
            outlier_result["outlier_percentage"],
            outlier_result["min"],
            outlier_result["max"],
            outlier_result["mean"]
        )
        
        # Risk score
        risk_score = self.calculate_risk_score(severity, outlier_result["outlier_percentage"])
        
        # Plot recommendation
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
        """
        Generate rankings of columns by outlier severity
        
        Returns:
            Ranking information
        """
        # Filter to include only columns with outliers
        columns_with_outliers = {
            col: result for col, result in self.outlier_results.items()
            if result["outlier_analysis"]["outlier_count"] > 0
        }
        
        # Sort columns by outlier percentage
        sorted_columns = sorted(
            columns_with_outliers.items(),
            key=lambda x: x[1]["outlier_analysis"]["outlier_percentage"],
            reverse=True
        )
        
        ranking = [col for col, _ in sorted_columns]
        
        # Get the column with highest outliers
        highest_col = ranking[0] if ranking else None
        
        return {
            "ranking": ranking,
            "highest_outlier_column": highest_col,
            "total_columns_with_outliers": len(ranking)
        }
    
    def generate_summary(self) -> Dict[str, Any]:
        """
        Generate summary of all outlier analyses
        
        Returns:
            Summary statistics
        """
        columns_with_outliers = 0
        total_outliers = 0
        total_rows = len(self.df)
        total_columns_analyzed = len(self.numeric_columns)
        
        for col, result in self.outlier_results.items():
            outlier_count = result["outlier_analysis"]["outlier_count"]
            if outlier_count > 0:
                columns_with_outliers += 1
                total_outliers += outlier_count
        
        severity_counts = {
            Severity.NONE.value: 0,
            Severity.LOW.value: 0,
            Severity.MEDIUM.value: 0,
            Severity.HIGH.value: 0
        }
        
        for col, result in self.outlier_results.items():
            severity = result["severity"]
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
        
        # Get riskiest columns
        riskiest = sorted(
            [(col, result["risk_score"]) for col, result in self.outlier_results.items()],
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        # Calculate overall outlier percentage
        total_possible_outliers = total_rows * total_columns_analyzed
        outlier_percentage_overall = (total_outliers / total_possible_outliers * 100) if total_possible_outliers > 0 else 0
        
        return {
            "columns_analyzed": total_columns_analyzed,
            "columns_with_outliers": columns_with_outliers,
            "total_outliers": total_outliers,
            "total_rows": total_rows,
            "outlier_percentage_overall": round(outlier_percentage_overall, 2),
            "severity_distribution": severity_counts,
            "riskiest_columns": riskiest
        }
    
    def analyze_all(self) -> Dict[str, Any]:
        """
        Analyze all numeric columns and generate complete report
        
        Returns:
            Complete outlier analysis report
        """
        # Get numeric columns
        self.get_numeric_columns()
        
        # Analyze each column
        for col in self.numeric_columns:
            self.outlier_results[col] = self.analyze_column(col)
        
        # Generate rankings and summary
        rankings = self.generate_rankings()
        summary = self.generate_summary()
        
        return {
            "analysis": self.outlier_results,
            "summary": summary,
            "rankings": rankings,
            "columns_analyzed": self.numeric_columns
        }


def detect_outliers(df: pd.DataFrame, context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Convenience function to detect outliers
    
    Args:
        df: Pandas DataFrame
        context: Shared analysis context
        
    Returns:
        Complete outlier analysis report
    """
    engine = OutlierEngine(df, context)
    return engine.analyze_all()
