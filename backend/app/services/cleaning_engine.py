"""
Cleaning Recommendation Engine
Analyzes dataset issues and recommends cleaning strategies
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from enum import Enum


class Priority(Enum):
    """Priority levels for cleaning issues"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class CleaningEngine:
    """
    Analyzes dataset and provides cleaning recommendations
    Does NOT modify data - only recommends strategies
    """
    
    def __init__(self, df: pd.DataFrame, validation_report: Dict[str, Any]):
        """
        Initialize cleaning engine
        
        Args:
            df: Pandas DataFrame to analyze
            validation_report: Output from DataValidator
        """
        self.df = df
        self.validation_report = validation_report
        self.recommendations = {}
        self.priorities = {}
        self.impacts = {}
        self.steps = []
        
    def _add_recommendation(self, column: str, problem: str, 
                           strategy: str, reason: str, 
                           priority: Priority, impact: str) -> None:
        """Add a cleaning recommendation"""
        self.recommendations[column] = {
            "problem": problem,
            "recommended_strategy": strategy,
            "reason": reason,
            "priority": priority.value,
            "impact": impact
        }
        
        # Add to steps checklist
        step = f"{strategy} for '{column}'"
        if step not in self.steps:
            self.steps.append(step)
    
    def get_missing_info(self) -> Dict[str, int]:
        """
        Get missing values directly from the dataframe
        """
        missing_info = {}
        for col in self.df.columns:
            missing_count = self.df[col].isnull().sum()
            if missing_count > 0:
                missing_info[col] = int(missing_count)
        return missing_info
    
    def get_duplicate_count(self) -> int:
        """Get duplicate row count directly from dataframe"""
        return int(self.df.duplicated().sum())
    
    def get_total_rows(self) -> int:
        """Get total rows from dataframe"""
        return len(self.df)
    
    def recommend_missing_values(self) -> None:
        """Analyze missing values and recommend strategies"""
        missing_info = self.get_missing_info()
        total_rows = self.get_total_rows()
        
        for col, missing_count in missing_info.items():
            missing_pct = (missing_count / total_rows) * 100
            
            # Get column type
            dtype = self.df[col].dtype
            is_numeric = pd.api.types.is_numeric_dtype(dtype)
            is_categorical = pd.api.types.is_object_dtype(dtype) or pd.api.types.is_string_dtype(dtype)
            
            # Determine strategy based on missing percentage and column type
            if missing_pct > 50:
                strategy = "drop_column"
                reason = f"Column has {missing_pct:.1f}% missing values - too many to impute reliably"
                priority = Priority.CRITICAL
                impact = "Removes problematic column entirely"
            elif missing_pct < 5:
                strategy = "drop_rows"
                reason = f"Only {missing_pct:.1f}% missing values - safe to remove affected rows"
                priority = Priority.MEDIUM
                impact = "Removes minimal data points"
            elif is_numeric:
                # Check for outliers to decide between mean/median
                has_outliers = False
                try:
                    clean_data = self.df[col].dropna()
                    if len(clean_data) > 0:
                        q1 = clean_data.quantile(0.25)
                        q3 = clean_data.quantile(0.75)
                        iqr = q3 - q1
                        outliers = ((clean_data < (q1 - 1.5 * iqr)) | 
                                   (clean_data > (q3 + 1.5 * iqr)))
                        has_outliers = outliers.any()
                except:
                    pass
                
                if has_outliers:
                    strategy = "median"
                    reason = f"Numeric column with potential outliers - median is robust to outliers"
                else:
                    strategy = "mean"
                    reason = f"Numeric column with normal distribution - mean preserves central tendency"
                
                priority = Priority.HIGH
                impact = "Fills missing values with central tendency measure"
                
            elif is_categorical:
                strategy = "mode"
                reason = f"Categorical column - mode represents most common category"
                priority = Priority.HIGH
                impact = "Fills missing values with most common category"
                
            else:
                strategy = "mode"
                reason = f"Mixed type column - mode is safest fallback"
                priority = Priority.MEDIUM
                impact = "Fills missing values with most common value"
            
            self._add_recommendation(
                col,
                f"{missing_pct:.1f}% missing values ({missing_count} rows)",
                strategy,
                reason,
                priority,
                impact
            )
    
    def recommend_constant_columns(self) -> None:
        """Recommend handling for constant columns"""
        constant_cols = self.validation_report['validation']['constant_columns']
        
        for col in constant_cols:
            unique_val = self.df[col].iloc[0] if not self.df[col].empty else "unknown"
            self._add_recommendation(
                col,
                f"Constant column (all values = '{unique_val}')",
                "drop_column",
                "Column provides no predictive information and no variance",
                Priority.LOW,
                "Reduces dimensionality without losing information"
            )
    
    def recommend_duplicate_rows(self) -> None:
        """Recommend handling for duplicate rows"""
        duplicate_count = self.get_duplicate_count()
        total_rows = self.get_total_rows()
        
        if duplicate_count > 0:
            duplicate_pct = (duplicate_count / total_rows) * 100
            
            # Add as a dataset-level recommendation
            self.recommendations["_dataset_"] = {
                "problem": f"{duplicate_count} duplicate rows ({duplicate_pct:.1f}% of data)",
                "recommended_strategy": "remove_duplicates",
                "reason": "Duplicate rows can bias analysis and model training",
                "priority": Priority.HIGH.value,
                "impact": "Removes redundant data, improves model performance"
            }
            
            self.steps.append("Remove duplicate rows")
    
    def recommend_infinite_values(self) -> None:
        """Recommend handling for infinite values"""
        inf_info = self.validation_report['validation']['infinite_values']
        
        if inf_info['has_infinite']:
            for col in inf_info['infinite_columns']:
                # Count positive and negative infinity
                pos_inf_count = 0
                neg_inf_count = 0
                
                if col in self.df.columns:
                    pos_inf_count = (self.df[col] == np.inf).sum()
                    neg_inf_count = (self.df[col] == -np.inf).sum()
                
                details = []
                if pos_inf_count > 0:
                    details.append(f"{pos_inf_count} positive infinity")
                if neg_inf_count > 0:
                    details.append(f"{neg_inf_count} negative infinity")
                
                self._add_recommendation(
                    col,
                    f"Infinite values ({', '.join(details)})",
                    "replace_infinite_with_nan_then_impute",
                    "Infinite values break most ML algorithms and should be handled before analysis",
                    Priority.CRITICAL,
                    "Replaces infinity with NaN, then uses missing value strategy"
                )
    
    def recommend_identifiers(self) -> None:
        """Recommend handling for identifier columns"""
        id_cols = self.validation_report['profiling']['id_columns']
        
        for col in id_cols:
            self._add_recommendation(
                col,
                "Identifier column (unique per row)",
                "exclude_from_training",
                "Identifiers don't generalize to new data and can cause overfitting",
                Priority.MEDIUM,
                "Prevents overfitting and improves model generalization"
            )
    
    def recommend_high_cardinality(self) -> None:
        """Recommend handling for high cardinality columns"""
        high_card = self.validation_report['profiling']['high_cardinality']
        
        for col, info in high_card.items():
            unique_count = info['unique_values']
            total_rows = info['total_rows']
            ratio = info['ratio']
            
            if ratio > 0.8:
                strategy = "exclude_from_training"
                reason = f"Very high cardinality ({unique_count} unique, {ratio:.0%} of rows) - likely an identifier"
                priority = Priority.HIGH
                impact = "Prevents overfitting and reduces model complexity"
            elif ratio > 0.5:
                strategy = "feature_engineering"
                reason = f"High cardinality ({unique_count} unique, {ratio:.0%} of rows) - may need encoding or aggregation"
                priority = Priority.MEDIUM
                impact = "Transform into more useful features"
            else:
                strategy = "encode_categorical"
                reason = f"Moderate cardinality ({unique_count} unique) - suitable for encoding"
                priority = Priority.LOW
                impact = "Allows categorical data to be used in ML models"
            
            self._add_recommendation(
                col,
                f"High cardinality ({unique_count} unique values, {ratio:.0%} unique)",
                strategy,
                reason,
                priority,
                impact
            )
    
    def recommend_boolean_columns(self) -> None:
        """Recommend handling for boolean columns"""
        bool_cols = self.validation_report['profiling']['boolean_columns']
        
        for col in bool_cols:
            # Check if it's marked as a target candidate
            target_candidates = self.validation_report['profiling']['target_candidates']
            
            if col in target_candidates:
                strategy = "keep_as_target"
                reason = "Binary boolean column is a good candidate for classification target"
                priority = Priority.LOW
                impact = "Preserves potential target variable"
            else:
                strategy = "encode_boolean"
                reason = "Boolean column can be used as is or converted to 0/1"
                priority = Priority.LOW
                impact = "Makes boolean data compatible with ML algorithms"
            
            self._add_recommendation(
                col,
                f"Boolean column",
                strategy,
                reason,
                priority,
                impact
            )
    
    def recommend_datetime_columns(self) -> None:
        """Recommend handling for datetime columns"""
        date_cols = self.validation_report['profiling']['date_columns']
        
        for col in date_cols:
            # Check if it might be an identifier
            if col in self.validation_report['profiling']['id_columns']:
                strategy = "exclude_from_training"
                reason = "Date column appears to be an identifier"
                priority = Priority.MEDIUM
                impact = "Prevents using time-based IDs as features"
            else:
                strategy = "extract_features"
                reason = "Datetime columns can be decomposed into useful features (year, month, day, etc.)"
                priority = Priority.MEDIUM
                impact = "Creates multiple features from date information"
            
            self._add_recommendation(
                col,
                f"Datetime column",
                strategy,
                reason,
                priority,
                impact
            )
    
    def generate_cleaning_checklist(self) -> List[Dict[str, Any]]:
        """
        Generate a structured cleaning checklist
        Sorted by priority
        """
        checklist = []
        
        # Group recommendations by priority
        priority_order = [Priority.CRITICAL.value, Priority.HIGH.value, 
                         Priority.MEDIUM.value, Priority.LOW.value]
        
        for priority in priority_order:
            for col, rec in self.recommendations.items():
                if rec['priority'] == priority:
                    checklist.append({
                        "column": col,
                        "priority": priority,
                        "strategy": rec['recommended_strategy'],
                        "problem": rec['problem'],
                        "reason": rec['reason'],
                        "impact": rec['impact']
                    })
        
        return checklist
    
    def get_summary(self) -> Dict[str, Any]:
        """Generate cleaning summary"""
        priority_counts = {p.value: 0 for p in Priority}
        total_issues = 0
        
        for rec in self.recommendations.values():
            priority_counts[rec['priority']] += 1
            total_issues += 1
        
        return {
            "total_issues": total_issues,
            "critical": priority_counts["critical"],
            "high": priority_counts["high"],
            "medium": priority_counts["medium"],
            "low": priority_counts["low"],
            "steps_to_take": len(self.steps),
            "steps_list": self.steps
        }
    
    def generate_report(self) -> Dict[str, Any]:
        """
        Generate complete cleaning recommendation report
        """
        # Run all recommendations
        self.recommend_missing_values()
        self.recommend_constant_columns()
        self.recommend_duplicate_rows()
        self.recommend_infinite_values()
        self.recommend_identifiers()
        self.recommend_high_cardinality()
        self.recommend_boolean_columns()
        self.recommend_datetime_columns()
        
        return {
            "recommendations": self.recommendations,
            "checklist": self.generate_cleaning_checklist(),
            "summary": self.get_summary()
        }


def generate_cleaning_recommendations(df: pd.DataFrame, 
                                      validation_report: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate cleaning recommendations for a dataset
    
    Args:
        df: Pandas DataFrame
        validation_report: Output from validate_dataset
        
    Returns:
        Comprehensive cleaning recommendations
    """
    engine = CleaningEngine(df, validation_report)
    return engine.generate_report()
