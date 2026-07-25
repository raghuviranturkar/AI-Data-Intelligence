"""
Feature Engineering Engine
Recommends feature transformations for ML readiness with priority and cost
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from enum import Enum


class EncodingType(Enum):
    """Encoding types for categorical features"""
    ONE_HOT = "one_hot"
    LABEL = "label"
    TARGET = "target"
    FREQUENCY = "frequency"
    ORDINAL = "ordinal"
    NONE = "none"


class ScalingType(Enum):
    """Scaling types for numeric features"""
    STANDARD = "standard"
    MINMAX = "minmax"
    ROBUST = "robust"
    NONE = "none"


class TransformType(Enum):
    """Transformation types for skewed features"""
    LOG = "log"
    SQRT = "sqrt"
    YEO_JOHNSON = "yeo_johnson"
    BOX_COX = "box_cox"
    NONE = "none"


class Priority(Enum):
    """Priority levels for feature engineering tasks"""
    CRITICAL = "critical"
    RECOMMENDED = "recommended"
    OPTIONAL = "optional"


class Cost(Enum):
    """Computational cost levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class FeatureEngineeringEngine:
    """
    Analyzes features and recommends engineering strategies with priorities and costs
    """
    
    def __init__(self, df: pd.DataFrame, context: Dict[str, Any] = None):
        """
        Initialize feature engineering engine
        
        Args:
            df: Pandas DataFrame
            context: Shared analysis context
        """
        self.df = df
        self.context = context or {}
        self.numeric_columns = []
        self.categorical_columns = []
        self.target_column = None
        
    def get_column_types(self) -> Dict[str, List[str]]:
        """Get column type classifications from context"""
        if 'validation' in self.context:
            validation = self.context['validation']
            if 'profiling' in validation:
                classifications = validation['profiling'].get('column_classifications', {})
                return classifications
        
        # Fallback
        return {
            "numeric": self.df.select_dtypes(include=[np.number]).columns.tolist(),
            "categorical": self.df.select_dtypes(include=['object', 'string']).columns.tolist(),
            "boolean": self.df.select_dtypes(include=['bool']).columns.tolist()
        }
    
    def get_target_column(self) -> Optional[str]:
        """Get target column from context"""
        if 'validation' in self.context:
            validation = self.context['validation']
            if 'profiling' in validation:
                targets = validation['profiling'].get('target_candidates', [])
                if targets:
                    return targets[0]
        return None
    
    def classify_feature_roles(self) -> Dict[str, str]:
        """
        Classify each feature by its role
        """
        self.target_column = self.get_target_column()
        classifications = self.get_column_types()
        
        roles = {}
        for col in self.df.columns:
            if col == self.target_column:
                roles[col] = "target"
            elif col in classifications.get('identifier', []):
                roles[col] = "ignored"
            elif col in classifications.get('datetime', []):
                roles[col] = "datetime"
            elif col in classifications.get('boolean', []):
                roles[col] = "boolean"
            elif col in classifications.get('numeric', []):
                roles[col] = "feature"
            elif col in classifications.get('categorical', []):
                roles[col] = "feature"
            else:
                roles[col] = "unknown"
        
        return roles
    
    def _get_priority(self, issue_type: str, severity: str = "medium") -> str:
        """Determine priority level based on issue type and severity"""
        priority_map = {
            "infinite_values": Priority.CRITICAL.value,
            "constant_column": Priority.OPTIONAL.value,
            "high_missing": Priority.CRITICAL.value,
            "low_missing": Priority.RECOMMENDED.value,
            "high_cardinality": Priority.RECOMMENDED.value,
            "low_cardinality": Priority.OPTIONAL.value,
            "high_skewness": Priority.RECOMMENDED.value,
            "moderate_skewness": Priority.OPTIONAL.value,
            "encoding": Priority.RECOMMENDED.value,
            "scaling": Priority.RECOMMENDED.value,
            "interaction": Priority.OPTIONAL.value,
            "datetime_extraction": Priority.OPTIONAL.value
        }
        return priority_map.get(issue_type, Priority.RECOMMENDED.value)
    
    def _get_cost(self, operation: str, data_size: int) -> str:
        """Estimate computational cost of operation"""
        if data_size > 100000:
            if operation in ["one_hot", "target_encoding", "interaction"]:
                return Cost.HIGH.value
            elif operation in ["scaling", "transform"]:
                return Cost.MEDIUM.value
            else:
                return Cost.LOW.value
        else:
            if operation in ["one_hot", "target_encoding"]:
                return Cost.MEDIUM.value
            else:
                return Cost.LOW.value
    
    def _get_expected_improvement(self, issue_type: str, severity: str = "medium") -> str:
        """Estimate expected performance improvement"""
        improvement_map = {
            "infinite_values": "Critical - prevents algorithm failure",
            "constant_column": "Low - removes noise",
            "high_missing": "High - preserves data quality",
            "low_missing": "Medium - slight improvement",
            "high_cardinality": "High - prevents overfitting",
            "low_cardinality": "Low - minimal impact",
            "high_skewness": "High - improves model performance",
            "moderate_skewness": "Medium - moderate improvement",
            "encoding": "High - enables categorical handling",
            "scaling": "High - improves convergence",
            "interaction": "Medium - captures relationships",
            "datetime_extraction": "Medium - adds time features"
        }
        return improvement_map.get(issue_type, "Medium - improves model performance")
    
    def recommend_encoding(self) -> Dict[str, Any]:
        """
        Recommend encoding strategies for categorical columns with priority and cost
        """
        classifications = self.get_column_types()
        categorical_cols = classifications.get('categorical', [])
        
        recommendations = {}
        for col in categorical_cols:
            unique_count = self.df[col].nunique()
            data_size = len(self.df)
            
            if unique_count == 2:
                strategy = EncodingType.LABEL.value
                reason = "Binary categorical column - label encoding is appropriate"
                priority = Priority.RECOMMENDED.value
            elif unique_count <= 10:
                strategy = EncodingType.ONE_HOT.value
                reason = f"Low cardinality ({unique_count} categories) - one-hot encoding is suitable"
                priority = Priority.RECOMMENDED.value
            elif unique_count <= 50:
                strategy = EncodingType.FREQUENCY.value
                reason = f"Moderate cardinality ({unique_count} categories) - frequency encoding preserves information"
                priority = Priority.RECOMMENDED.value
            else:
                strategy = EncodingType.TARGET.value
                reason = f"High cardinality ({unique_count} categories) - target encoding is recommended"
                priority = Priority.CRITICAL.value
            
            recommendations[col] = {
                "unique_values": unique_count,
                "recommended_encoding": strategy,
                "reason": reason,
                "priority": priority,
                "cost": self._get_cost(strategy, data_size),
                "expected_improvement": self._get_expected_improvement("encoding")
            }
        
        return {"encoding_recommendations": recommendations}
    
    def recommend_scaling(self) -> Dict[str, Any]:
        """
        Recommend scaling strategies for numeric features with priority and cost
        """
        classifications = self.get_column_types()
        numeric_cols = classifications.get('numeric', [])
        
        # Get outlier information
        has_outliers = set()
        if 'outliers' in self.context:
            outliers = self.context['outliers']
            for col, analysis in outliers.get('analysis', {}).items():
                if analysis.get('outlier_analysis', {}).get('outlier_count', 0) > 0:
                    has_outliers.add(col)
        
        recommendations = {}
        for col in numeric_cols:
            if col == self.target_column:
                continue
                
            clean_data = self.df[col].dropna()
            if len(clean_data) < 2:
                continue
            
            data_size = len(self.df)
            
            # Check if column has outliers
            if col in has_outliers:
                strategy = ScalingType.ROBUST.value
                reason = "Contains outliers - RobustScaler is recommended"
                priority = Priority.CRITICAL.value
            else:
                # Check if distribution is approximately normal
                skewness = clean_data.skew()
                if abs(skewness) < 0.5:
                    strategy = ScalingType.STANDARD.value
                    reason = "Approximately normal distribution - StandardScaler is appropriate"
                    priority = Priority.RECOMMENDED.value
                else:
                    strategy = ScalingType.MINMAX.value
                    reason = f"Skewed distribution (skewness={skewness:.2f}) - MinMaxScaler may be suitable"
                    priority = Priority.RECOMMENDED.value
            
            recommendations[col] = {
                "skewness": round(float(skewness), 3) if not pd.isna(skewness) else None,
                "recommended_scaling": strategy,
                "reason": reason,
                "priority": priority,
                "cost": self._get_cost("scaling", data_size),
                "expected_improvement": self._get_expected_improvement("scaling")
            }
        
        return {"scaling_recommendations": recommendations}
    
    def recommend_transformations(self) -> Dict[str, Any]:
        """
        Recommend transformations for skewed features with priority and cost
        """
        classifications = self.get_column_types()
        numeric_cols = classifications.get('numeric', [])
        
        recommendations = {}
        for col in numeric_cols:
            if col == self.target_column:
                continue
                
            clean_data = self.df[col].dropna()
            if len(clean_data) < 2:
                continue
            
            # Check for skewness
            skewness = clean_data.skew()
            data_size = len(self.df)
            
            # Check for negative values (affects log transform)
            has_negative = (clean_data < 0).any()
            has_zero = (clean_data == 0).any()
            
            if abs(skewness) < 0.5:
                strategy = TransformType.NONE.value
                reason = "Approximately symmetric - no transformation needed"
                priority = Priority.OPTIONAL.value
            elif skewness > 1:
                if has_negative or has_zero:
                    strategy = TransformType.YEO_JOHNSON.value
                    reason = f"Positive skewness ({skewness:.2f}) with non-positive values - Yeo-Johnson recommended"
                    priority = Priority.RECOMMENDED.value
                else:
                    strategy = TransformType.LOG.value
                    reason = f"Positive skewness ({skewness:.2f}) - log transformation recommended"
                    priority = Priority.RECOMMENDED.value
            elif skewness < -1:
                if has_negative or has_zero:
                    strategy = TransformType.YEO_JOHNSON.value
                    reason = f"Negative skewness ({skewness:.2f}) with non-positive values - Yeo-Johnson recommended"
                    priority = Priority.RECOMMENDED.value
                else:
                    strategy = TransformType.SQRT.value
                    reason = f"Negative skewness ({skewness:.2f}) - square root transformation may help"
                    priority = Priority.OPTIONAL.value
            else:
                strategy = TransformType.NONE.value
                reason = f"Moderate skewness ({skewness:.2f}) - transformation optional"
                priority = Priority.OPTIONAL.value
            
            if strategy != TransformType.NONE.value:
                recommendations[col] = {
                    "skewness": round(float(skewness), 3) if not pd.isna(skewness) else None,
                    "recommended_transform": strategy,
                    "reason": reason,
                    "priority": priority,
                    "cost": self._get_cost("transform", data_size),
                    "expected_improvement": self._get_expected_improvement(
                        "high_skewness" if abs(skewness) > 1 else "moderate_skewness"
                    )
                }
        
        return {"transformation_recommendations": recommendations}
    
    def detect_low_variance_features(self) -> Dict[str, Any]:
        """
        Detect features with very low variance (constant or near-constant)
        """
        low_variance = []
        
        for col in self.df.columns:
            if col == self.target_column:
                continue
                
            unique_count = self.df[col].nunique()
            total_rows = len(self.df)
            
            # Check if column is constant or nearly constant
            if unique_count == 1:
                low_variance.append({
                    "column": col,
                    "unique_values": 1,
                    "ratio": 1.0,
                    "recommendation": "drop",
                    "reason": "Constant column - provides no information",
                    "priority": Priority.OPTIONAL.value,
                    "cost": Cost.LOW.value,
                    "expected_improvement": "Low - removes noise"
                })
            elif unique_count / total_rows < 0.01:
                low_variance.append({
                    "column": col,
                    "unique_values": unique_count,
                    "ratio": round(unique_count / total_rows, 3),
                    "recommendation": "review",
                    "reason": "Very low variance - may provide limited information",
                    "priority": Priority.OPTIONAL.value,
                    "cost": Cost.LOW.value,
                    "expected_improvement": "Low - minimal impact"
                })
        
        return {"low_variance_features": low_variance}
    
    def suggest_interactions(self) -> Dict[str, Any]:
        """
        Suggest feature interactions based on correlation analysis
        """
        interactions = []
        
        # Get strong correlations from EDA
        if 'eda' in self.context:
            eda = self.context['eda']
            strong_corrs = eda.get('correlation', {}).get('strong_correlations', {})
            
            for corr in strong_corrs.get('strong_correlations', []):
                if corr['correlation'] > 0.8:
                    interactions.append({
                        "feature1": corr['feature_1'],
                        "feature2": corr['feature_2'],
                        "correlation": corr['correlation'],
                        "suggested_interaction": f"{corr['feature_1']}_x_{corr['feature_2']}",
                        "reason": "Strongly correlated features may benefit from interaction term",
                        "priority": Priority.OPTIONAL.value,
                        "cost": Cost.MEDIUM.value,
                        "expected_improvement": "Medium - captures relationships"
                    })
        
        return {"interaction_suggestions": interactions}
    
    def suggest_datetime_features(self) -> Dict[str, Any]:
        """
        Suggest features to extract from datetime columns
        """
        classifications = self.get_column_types()
        datetime_cols = classifications.get('datetime', [])
        
        suggestions = {}
        for col in datetime_cols:
            try:
                # Try to parse datetime
                sample = self.df[col].dropna()
                if not sample.empty:
                    pd.to_datetime(sample)
                    suggestions[col] = {
                        "extract": ["year", "month", "day", "weekday", "quarter"],
                        "reason": "Datetime column can provide time-based features",
                        "potential_features": [
                            f"{col}_year",
                            f"{col}_month",
                            f"{col}_day",
                            f"{col}_weekday",
                            f"{col}_quarter"
                        ],
                        "priority": Priority.OPTIONAL.value,
                        "cost": Cost.LOW.value,
                        "expected_improvement": "Medium - adds time features"
                    }
            except:
                pass
        
        return {"datetime_suggestions": suggestions}
    
    def suggest_feature_selection(self) -> Dict[str, Any]:
        """
        Suggest feature selection based on correlations
        """
        selections = []
        
        # Get strong correlations to identify redundant features
        if 'eda' in self.context:
            eda = self.context['eda']
            strong_corrs = eda.get('correlation', {}).get('strong_correlations', {})
            
            for corr in strong_corrs.get('strong_correlations', []):
                if abs(corr['correlation']) > 0.85:
                    # Choose which feature to keep (prefer feature with more business relevance)
                    # For now, keep the one with lower cardinality
                    col1_card = self.df[corr['feature_1']].nunique()
                    col2_card = self.df[corr['feature_2']].nunique()
                    
                    if col1_card < col2_card:
                        keep = corr['feature_1']
                        remove = corr['feature_2']
                    else:
                        keep = corr['feature_2']
                        remove = corr['feature_1']
                    
                    selections.append({
                        "keep": keep,
                        "remove": remove,
                        "correlation": corr['correlation'],
                        "reason": f"Highly correlated with '{keep}' (r={corr['correlation']:.2f}) - redundant feature",
                        "priority": Priority.RECOMMENDED.value,
                        "cost": Cost.LOW.value,
                        "expected_improvement": "High - reduces multicollinearity"
                    })
        
        return {"feature_selection_suggestions": selections}
    
    def generate_preprocessing_pipeline(self) -> Dict[str, Any]:
        """
        Generate the recommended preprocessing pipeline order with priorities
        """
        pipeline_steps = [
            {"step": "Handle Missing Values", "details": "Impute or remove missing values", 
             "priority": Priority.CRITICAL.value},
            {"step": "Replace Infinite Values", "details": "Replace inf/-inf with NaN or impute",
             "priority": Priority.CRITICAL.value},
            {"step": "Drop Constant Columns", "details": "Remove columns with no variance",
             "priority": Priority.OPTIONAL.value},
            {"step": "Encode Categorical Features", "details": "Convert categorical to numeric",
             "priority": Priority.RECOMMENDED.value},
            {"step": "Scale Numeric Features", "details": "Normalize/standardize numeric features",
             "priority": Priority.RECOMMENDED.value},
            {"step": "Transform Skewed Features", "details": "Apply transformations for normality",
             "priority": Priority.RECOMMENDED.value},
            {"step": "Create Interaction Features", "details": "Combine correlated features",
             "priority": Priority.OPTIONAL.value},
            {"step": "Extract Datetime Features", "details": "Decompose datetime into components",
             "priority": Priority.OPTIONAL.value},
            {"step": "Select Final Features", "details": "Remove redundant or low-value features",
             "priority": Priority.RECOMMENDED.value}
        ]
        
        return {"preprocessing_pipeline": pipeline_steps}
    
    def calculate_ml_readiness(self) -> Dict[str, Any]:
        """
        Calculate ML readiness score with detailed breakdown
        """
        score = 100
        issues = []
        critical_issues = []
        
        # Check for missing values
        missing_cols = [col for col in self.df.columns if self.df[col].isnull().any()]
        if missing_cols:
            score -= len(missing_cols) * 5
            if len(missing_cols) > 5:
                critical_issues.append(f"{len(missing_cols)} columns have missing values - critical")
            issues.append(f"{len(missing_cols)} columns have missing values")
        
        # Check for categorical columns
        classifications = self.get_column_types()
        categorical_cols = classifications.get('categorical', [])
        if categorical_cols:
            score -= len(categorical_cols) * 2
            issues.append(f"{len(categorical_cols)} categorical columns need encoding")
        
        # Check for skewed features
        for col in self.df.select_dtypes(include=[np.number]).columns:
            if col == self.target_column:
                continue
            skewness = self.df[col].skew()
            if abs(skewness) > 2:
                critical_issues.append(f"'{col}' is highly skewed (skewness={skewness:.2f}) - critical")
                score -= 5
            elif abs(skewness) > 1:
                score -= 2
                issues.append(f"'{col}' is skewed (skewness={skewness:.2f})")
        
        # Check for infinite values
        for col in self.df.select_dtypes(include=[np.number]).columns:
            if np.isinf(self.df[col]).any():
                critical_issues.append(f"'{col}' contains infinite values - critical")
                score -= 10
        
        # Check for constant columns
        for col in self.df.columns:
            if self.df[col].nunique() == 1:
                score -= 2
                issues.append(f"'{col}' is constant - no predictive value")
        
        # Determine status
        if score >= 80:
            status = "Ready for ML"
            recommendation = "Dataset is well-prepared for modeling"
        elif score >= 50:
            status = "Needs Preparation"
            recommendation = "Some preprocessing required before modeling"
        else:
            status = "Major Issues"
            recommendation = "Significant preprocessing required"
        
        return {
            "score": max(0, score),
            "status": status,
            "recommendation": recommendation,
            "issues": issues[:5],
            "critical_issues": critical_issues[:3],
            "issue_count": len(issues),
            "critical_count": len(critical_issues)
        }
    
    def generate_summary(self) -> Dict[str, Any]:
        """
        Generate feature engineering summary with priority breakdown
        """
        encoding_recs = self.recommend_encoding()
        scaling_recs = self.recommend_scaling()
        transform_recs = self.recommend_transformations()
        low_variance = self.detect_low_variance_features()
        
        # Count by priority
        priority_counts = {"critical": 0, "recommended": 0, "optional": 0}
        
        for rec in encoding_recs.get('encoding_recommendations', {}).values():
            priority_counts[rec.get('priority', 'recommended')] += 1
        for rec in scaling_recs.get('scaling_recommendations', {}).values():
            priority_counts[rec.get('priority', 'recommended')] += 1
        for rec in transform_recs.get('transformation_recommendations', {}).values():
            priority_counts[rec.get('priority', 'recommended')] += 1
        for item in low_variance.get('low_variance_features', []):
            priority_counts[item.get('priority', 'optional')] += 1
        
        # Count by cost
        cost_counts = {"low": 0, "medium": 0, "high": 0}
        
        for rec in encoding_recs.get('encoding_recommendations', {}).values():
            cost_counts[rec.get('cost', 'low')] += 1
        for rec in scaling_recs.get('scaling_recommendations', {}).values():
            cost_counts[rec.get('cost', 'low')] += 1
        for rec in transform_recs.get('transformation_recommendations', {}).values():
            cost_counts[rec.get('cost', 'low')] += 1
        
        return {
            "encoding_required": len(encoding_recs.get('encoding_recommendations', {})),
            "scaling_required": len(scaling_recs.get('scaling_recommendations', {})),
            "transform_required": len(transform_recs.get('transformation_recommendations', {})),
            "drop_candidates": len(low_variance.get('low_variance_features', [])),
            "priority_breakdown": priority_counts,
            "cost_breakdown": cost_counts,
            "estimated_features_after_engineering": len(self.df.columns) + 
                len(encoding_recs.get('encoding_recommendations', {})) * 2
        }
    
    def analyze_all(self) -> Dict[str, Any]:
        """
        Run all feature engineering analyses
        """
        return {
            "feature_roles": self.classify_feature_roles(),
            "encoding": self.recommend_encoding(),
            "scaling": self.recommend_scaling(),
            "transformations": self.recommend_transformations(),
            "low_variance": self.detect_low_variance_features(),
            "interactions": self.suggest_interactions(),
            "datetime_features": self.suggest_datetime_features(),
            "feature_selection": self.suggest_feature_selection(),
            "preprocessing_pipeline": self.generate_preprocessing_pipeline(),
            "ml_readiness": self.calculate_ml_readiness(),
            "summary": self.generate_summary()
        }


def engineer_features(df: pd.DataFrame, context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Convenience function to generate feature engineering recommendations
    
    Args:
        df: Pandas DataFrame
        context: Shared analysis context
        
    Returns:
        Comprehensive feature engineering recommendations
    """
    engine = FeatureEngineeringEngine(df, context)
    return engine.analyze_all()
