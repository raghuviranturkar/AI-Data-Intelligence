"""
EDA & Visualization Engine
Exploratory Data Analysis with correlation analysis and visualization recommendations
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from scipy import stats


class EDAEngine:
    """
    Performs exploratory data analysis and generates visualization metadata
    """
    
    def __init__(self, df: pd.DataFrame, context: Dict[str, Any] = None):
        """
        Initialize EDA engine
        
        Args:
            df: Pandas DataFrame to analyze
            context: Shared analysis context from previous engines
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
        
        # Fallback: detect types
        return {
            "numeric": self.df.select_dtypes(include=[np.number]).columns.tolist(),
            "categorical": self.df.select_dtypes(include=['object', 'string']).columns.tolist(),
            "boolean": self.df.select_dtypes(include=['bool']).columns.tolist()
        }
    
    def get_numeric_columns(self) -> List[str]:
        """Get numeric columns (excluding identifiers)"""
        classifications = self.get_column_types()
        numeric = classifications.get('numeric', [])
        
        # Exclude IDs and boolean-like columns
        exclude = set()
        if 'validation' in self.context:
            validation = self.context['validation']
            if 'profiling' in validation:
                exclude.update(validation['profiling'].get('id_columns', []))
                exclude.update(validation['profiling'].get('boolean_columns', []))
        
        return [col for col in numeric if col not in exclude]
    
    def get_categorical_columns(self) -> List[str]:
        """Get categorical columns"""
        classifications = self.get_column_types()
        categorical = classifications.get('categorical', [])
        return categorical
    
    def get_target_column(self) -> Optional[str]:
        """Get target column from context"""
        if 'validation' in self.context:
            validation = self.context['validation']
            if 'profiling' in validation:
                targets = validation['profiling'].get('target_candidates', [])
                if targets:
                    return targets[0]  # Use first target candidate
        return None
    
    def calculate_correlation_matrix(self) -> Dict[str, Any]:
        """
        Calculate Pearson correlation matrix for numeric columns
        """
        numeric_cols = self.get_numeric_columns()
        
        if len(numeric_cols) < 2:
            return {"matrix": {}, "message": "Not enough numeric columns for correlation"}
        
        # Calculate correlation matrix
        corr_matrix = self.df[numeric_cols].corr()
        
        # Convert to dictionary
        matrix_dict = {}
        for col in corr_matrix.columns:
            matrix_dict[col] = {}
            for row in corr_matrix.index:
                if col != row:
                    value = corr_matrix.loc[row, col]
                    if not pd.isna(value):
                        matrix_dict[col][row] = round(float(value), 3)
        
        return {"matrix": matrix_dict}
    
    def find_strong_correlations(self, threshold: float = 0.7) -> Dict[str, Any]:
        """
        Find strong positive correlations above threshold
        """
        numeric_cols = self.get_numeric_columns()
        
        if len(numeric_cols) < 2:
            return {"strong_correlations": [], "message": "Not enough numeric columns"}
        
        corr_matrix = self.df[numeric_cols].corr()
        strong_corrs = []
        
        for i in range(len(corr_matrix.columns)):
            for j in range(i + 1, len(corr_matrix.columns)):
                col1 = corr_matrix.columns[i]
                col2 = corr_matrix.columns[j]
                corr_value = corr_matrix.iloc[i, j]
                
                if abs(corr_value) >= threshold and not pd.isna(corr_value):
                    strong_corrs.append({
                        "feature_1": col1,
                        "feature_2": col2,
                        "correlation": round(float(corr_value), 3)
                    })
        
        # Sort by absolute correlation
        strong_corrs.sort(key=lambda x: abs(x['correlation']), reverse=True)
        
        return {
            "strong_correlations": strong_corrs,
            "threshold": threshold,
            "total_strong": len(strong_corrs)
        }
    
    def find_negative_correlations(self, threshold: float = -0.5) -> Dict[str, Any]:
        """
        Find negative correlations below threshold
        """
        numeric_cols = self.get_numeric_columns()
        
        if len(numeric_cols) < 2:
            return {"negative_correlations": [], "message": "Not enough numeric columns"}
        
        corr_matrix = self.df[numeric_cols].corr()
        negative_corrs = []
        
        for i in range(len(corr_matrix.columns)):
            for j in range(i + 1, len(corr_matrix.columns)):
                col1 = corr_matrix.columns[i]
                col2 = corr_matrix.columns[j]
                corr_value = corr_matrix.iloc[i, j]
                
                if corr_value <= threshold and not pd.isna(corr_value):
                    negative_corrs.append({
                        "feature_1": col1,
                        "feature_2": col2,
                        "correlation": round(float(corr_value), 3)
                    })
        
        # Sort by most negative
        negative_corrs.sort(key=lambda x: x['correlation'])
        
        return {
            "negative_correlations": negative_corrs,
            "threshold": threshold,
            "total_negative": len(negative_corrs)
        }
    
    def analyze_target_correlations(self) -> Dict[str, Any]:
        """
        Analyze correlations with target column
        """
        self.target_column = self.get_target_column()
        
        if not self.target_column:
            return {"target": None, "message": "No target column identified"}
        
        if self.target_column not in self.df.columns:
            return {"target": self.target_column, "message": "Target column not found in dataset"}
        
        # Check if target is numeric
        if not pd.api.types.is_numeric_dtype(self.df[self.target_column]):
            # For categorical targets, show value counts instead
            value_counts = self.df[self.target_column].value_counts()
            return {
                "target": self.target_column,
                "type": "categorical",
                "value_counts": value_counts.head(10).to_dict(),
                "unique_values": len(value_counts),
                "most_common": str(value_counts.index[0]) if not value_counts.empty else None,
                "message": "Target is categorical - showing distribution instead of correlations"
            }
        
        numeric_cols = self.get_numeric_columns()
        # Remove target from numeric columns if present
        if self.target_column in numeric_cols:
            numeric_cols.remove(self.target_column)
        
        if not numeric_cols:
            return {"target": self.target_column, "message": "No other numeric columns"}
        
        correlations = {}
        for col in numeric_cols:
            corr = self.df[col].corr(self.df[self.target_column])
            if not pd.isna(corr):
                correlations[col] = round(float(corr), 3)
        
        # Sort by absolute correlation
        sorted_corrs = sorted(correlations.items(), key=lambda x: abs(x[1]), reverse=True)
        
        return {
            "target": self.target_column,
            "type": "numeric",
            "correlations": dict(sorted_corrs),
            "top_feature": sorted_corrs[0][0] if sorted_corrs else None,
            "top_correlation": sorted_corrs[0][1] if sorted_corrs else None
        }
    
    def analyze_categorical_columns(self) -> Dict[str, Any]:
        """
        Analyze categorical columns with frequency distributions
        """
        categorical_cols = self.get_categorical_columns()
        
        if not categorical_cols:
            return {"message": "No categorical columns found"}
        
        analysis = {}
        for col in categorical_cols:
            value_counts = self.df[col].value_counts()
            total = len(self.df)
            
            analysis[col] = {
                "unique_values": len(value_counts),
                "top_categories": value_counts.head(10).to_dict(),
                "frequency_percentage": (value_counts / total * 100).head(10).to_dict(),
                "most_common": str(value_counts.index[0]) if not value_counts.empty else None,
                "most_common_count": int(value_counts.iloc[0]) if not value_counts.empty else 0,
                "least_common": str(value_counts.index[-1]) if not value_counts.empty else None,
                "least_common_count": int(value_counts.iloc[-1]) if not value_counts.empty else 0
            }
        
        return {"categorical_analysis": analysis}
    
    def analyze_numeric_distributions(self) -> Dict[str, Any]:
        """
        Analyze numeric column distributions
        """
        numeric_cols = self.get_numeric_columns()
        
        if not numeric_cols:
            return {"message": "No numeric columns found"}
        
        analysis = {}
        for col in numeric_cols:
            clean_data = self.df[col].dropna()
            
            if len(clean_data) < 2:
                continue
            
            analysis[col] = {
                "mean": round(float(clean_data.mean()), 2),
                "median": round(float(clean_data.median()), 2),
                "std": round(float(clean_data.std()), 2),
                "variance": round(float(clean_data.var()), 2),
                "range": round(float(clean_data.max() - clean_data.min()), 2),
                "min": round(float(clean_data.min()), 2),
                "max": round(float(clean_data.max()), 2),
                "skewness": round(float(clean_data.skew()), 3),
                "kurtosis": round(float(clean_data.kurt()), 3),
                "coefficient_of_variation": round(float(clean_data.std() / clean_data.mean() * 100), 2) if clean_data.mean() != 0 else None,
                "count": len(clean_data),
                "missing": self.df[col].isnull().sum()
            }
        
        return {"numeric_distributions": analysis}
    
    def generate_visualization_recommendations(self) -> Dict[str, Any]:
        """
        Generate visualization recommendations based on column types
        """
        numeric_cols = self.get_numeric_columns()
        categorical_cols = self.get_categorical_columns()
        target = self.get_target_column()
        
        visualizations = []
        
        # Histograms for numeric columns
        for col in numeric_cols[:10]:  # Limit to 10 for performance
            visualizations.append({
                "type": "histogram",
                "column": col,
                "title": f"Distribution of {col}",
                "x_label": col,
                "y_label": "Frequency"
            })
        
        # Box plots for numeric columns
        for col in numeric_cols[:5]:  # Limit to 5
            visualizations.append({
                "type": "boxplot",
                "column": col,
                "title": f"Box Plot of {col}",
                "x_label": col,
                "y_label": "Value"
            })
        
        # Bar charts for categorical columns
        for col in categorical_cols[:10]:
            visualizations.append({
                "type": "bar_chart",
                "column": col,
                "title": f"Distribution of {col}",
                "x_label": col,
                "y_label": "Count"
            })
        
        # Correlation heatmap
        if len(numeric_cols) >= 2:
            visualizations.append({
                "type": "heatmap",
                "title": "Correlation Matrix",
                "columns": numeric_cols
            })
        
        # Scatter plots for numeric pairs
        if len(numeric_cols) >= 2:
            for i in range(min(len(numeric_cols), 3)):
                for j in range(i + 1, min(len(numeric_cols), 4)):
                    if i != j:
                        visualizations.append({
                            "type": "scatter",
                            "column_1": numeric_cols[i],
                            "column_2": numeric_cols[j],
                            "title": f"{numeric_cols[i]} vs {numeric_cols[j]}"
                        })
        
        # Target-specific visualizations
        if target:
            if target in numeric_cols:
                visualizations.append({
                    "type": "target_histogram",
                    "column": target,
                    "title": f"Distribution of Target: {target}",
                    "x_label": target,
                    "y_label": "Frequency"
                })
                
                if len(numeric_cols) > 1:
                    for col in numeric_cols[:3]:
                        if col != target:
                            visualizations.append({
                                "type": "target_scatter",
                                "target": target,
                                "feature": col,
                                "title": f"{col} vs {target}"
                            })
            elif target in categorical_cols:
                visualizations.append({
                    "type": "target_bar_chart",
                    "column": target,
                    "title": f"Distribution of Target: {target}",
                    "x_label": target,
                    "y_label": "Count"
                })
        
        return {
            "visualizations": visualizations,
            "total_recommendations": len(visualizations)
        }
    
    def generate_insights(self) -> Dict[str, Any]:
        """
        Generate business insights from EDA
        """
        insights = []
        interesting_findings = []
        
        # Get strong correlations
        strong_corrs = self.find_strong_correlations(threshold=0.7)
        
        # Generate insights from correlations
        for corr in strong_corrs.get('strong_correlations', []):
            if corr['correlation'] > 0.8:
                insights.append(
                    f"Strong positive correlation between {corr['feature_1']} and {corr['feature_2']} "
                    f"(r={corr['correlation']:.2f}). These variables move together."
                )
            elif corr['correlation'] < -0.7:
                insights.append(
                    f"Strong negative correlation between {corr['feature_1']} and {corr['feature_2']} "
                    f"(r={corr['correlation']:.2f}). As one increases, the other decreases."
                )
        
        # Get target correlations
        target_analysis = self.analyze_target_correlations()
        if target_analysis.get('type') == 'numeric' and target_analysis.get('top_feature'):
            insights.append(
                f"'{target_analysis['top_feature']}' has the strongest relationship with the target "
                f"'{target_analysis['target']}' (r={target_analysis['top_correlation']:.2f})."
            )
        elif target_analysis.get('type') == 'categorical':
            insights.append(
                f"Target '{target_analysis['target']}' has {target_analysis['unique_values']} categories. "
                f"Most common is '{target_analysis['most_common']}'."
            )
        
        # Analyze distributions
        numeric_dist = self.analyze_numeric_distributions()
        for col, stats in numeric_dist.get('numeric_distributions', {}).items():
            if stats.get('skewness', 0) > 1:
                interesting_findings.append(f"{col} is highly right-skewed (skewness={stats['skewness']:.2f})")
                insights.append(f"{col} has a right-skewed distribution, indicating extreme high values.")
            elif stats.get('skewness', 0) < -1:
                interesting_findings.append(f"{col} is highly left-skewed (skewness={stats['skewness']:.2f})")
                insights.append(f"{col} has a left-skewed distribution, indicating extreme low values.")
            
            if stats.get('coefficient_of_variation', 0) and stats['coefficient_of_variation'] > 50:
                interesting_findings.append(f"{col} has high variability (CV={stats['coefficient_of_variation']:.1f}%)")
        
        # Categorical insights
        cat_analysis = self.analyze_categorical_columns()
        for col, stats in cat_analysis.get('categorical_analysis', {}).items():
            if stats['unique_values'] > 20:
                interesting_findings.append(f"{col} has high cardinality ({stats['unique_values']} unique values)")
                insights.append(f"{col} has many categories which may need encoding for ML.")
        
        return {
            "insights": insights[:10],  # Limit to 10 insights
            "interesting_findings": interesting_findings[:10],
            "total_insights": len(insights),
            "total_findings": len(interesting_findings)
        }
    
    def generate_dataset_overview(self) -> Dict[str, Any]:
        """
        Generate high-level dataset overview
        """
        numeric_cols = self.get_numeric_columns()
        categorical_cols = self.get_categorical_columns()
        classifications = self.get_column_types()
        
        return {
            "total_rows": len(self.df),
            "total_columns": len(self.df.columns),
            "numeric_features": len(numeric_cols),
            "categorical_features": len(categorical_cols),
            "boolean_features": len(classifications.get('boolean', [])),
            "datetime_features": len(classifications.get('datetime', [])),
            "identifier_columns": len(classifications.get('identifier', [])),
            "target_column": self.get_target_column()
        }
    
    def generate_summary(self) -> Dict[str, Any]:
        """
        Generate EDA summary
        """
        strong_corrs = self.find_strong_correlations(threshold=0.7)
        negative_corrs = self.find_negative_correlations(threshold=-0.5)
        
        numeric_cols = self.get_numeric_columns()
        categorical_cols = self.get_categorical_columns()
        
        return {
            "columns_analyzed": len(numeric_cols) + len(categorical_cols),
            "numeric_analyzed": len(numeric_cols),
            "categorical_analyzed": len(categorical_cols),
            "strong_relationships": len(strong_corrs.get('strong_correlations', [])),
            "negative_relationships": len(negative_corrs.get('negative_correlations', [])),
            "recommended_visualizations": len(self.generate_visualization_recommendations().get('visualizations', [])),
            "insights_generated": len(self.generate_insights().get('insights', []))
        }
    
    def analyze_all(self) -> Dict[str, Any]:
        """
        Run all EDA analyses and generate complete report
        """
        return {
            "overview": self.generate_dataset_overview(),
            "correlation": {
                "matrix": self.calculate_correlation_matrix(),
                "strong_correlations": self.find_strong_correlations(threshold=0.7),
                "negative_correlations": self.find_negative_correlations(threshold=-0.5),
                "target_correlations": self.analyze_target_correlations()
            },
            "distributions": {
                "numeric": self.analyze_numeric_distributions(),
                "categorical": self.analyze_categorical_columns()
            },
            "visualizations": self.generate_visualization_recommendations(),
            "insights": self.generate_insights(),
            "summary": self.generate_summary()
        }


def perform_eda(df: pd.DataFrame, context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Convenience function to perform EDA
    
    Args:
        df: Pandas DataFrame
        context: Shared analysis context
        
    Returns:
        Complete EDA report
    """
    engine = EDAEngine(df, context)
    return engine.analyze_all()
