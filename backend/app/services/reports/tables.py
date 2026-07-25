"""
Table Generator for PDF Reports
Creates formatted tables for report sections
"""
from typing import Dict, Any, List
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


class TableGenerator:
    """Generates formatted tables for PDF reports"""
    
    @staticmethod
    def create_quality_table(quality_data: Dict[str, Any]) -> Table:
        """Create data quality table"""
        data = [
            ['Metric', 'Value', 'Status'],
            ['Quality Score', f"{quality_data.get('quality_score', 0)}/100", 
             '✅ Good' if quality_data.get('quality_score', 0) >= 70 else '⚠️ Needs Improvement'],
            ['Warnings', str(quality_data.get('total_warnings', 0)), 
             '✅' if quality_data.get('total_warnings', 0) == 0 else '⚠️ Review Required'],
            ['Duplicate Rows', str(quality_data.get('duplicate_rows', 0)), 
             '✅' if quality_data.get('duplicate_rows', 0) == 0 else '⚠️ Duplicates Found'],
        ]
        
        return TableGenerator._create_table(data, "Quality Metrics")
    
    @staticmethod
    def create_dataset_overview_table(dataset: Dict[str, Any]) -> Table:
        """Create dataset overview table"""
        shape = dataset.get('shape', {})
        data = [
            ['Property', 'Value'],
            ['Rows', str(shape.get('rows', 0))],
            ['Columns', str(shape.get('columns', 0))],
            ['Numeric Columns', str(len(dataset.get('numeric_columns', [])))],
            ['Categorical Columns', str(len(dataset.get('categorical_columns', [])))],
            ['Memory Usage', dataset.get('memory_usage', {}).get('megabytes', 'N/A')],
            ['File Name', dataset.get('file_name', 'Unknown')],
        ]
        
        return TableGenerator._create_table(data, "Dataset Overview")
    
    @staticmethod
    def create_missing_values_table(missing_values: Dict[str, int]) -> Table:
        """Create missing values table"""
        data = [['Column', 'Missing Values', 'Percentage']]
        
        for col, count in missing_values.items():
            if count > 0:
                total = sum(missing_values.values())
                pct = (count / total * 100) if total > 0 else 0
                data.append([col, str(count), f"{pct:.1f}%"])
        
        if len(data) == 1:
            data.append(['No missing values found', '', ''])
        
        return TableGenerator._create_table(data, "Missing Values Analysis")
    
    @staticmethod
    def create_model_comparison_table(ranked_models: List[Dict[str, Any]]) -> Table:
        """Create model comparison table"""
        data = [['Rank', 'Model', 'Score', 'CV Score', 'Training Time (s)']]
        
        for model in ranked_models[:5]:
            data.append([
                str(model.get('rank', '')),
                model.get('model_name', 'Unknown'),
                f"{model.get('score', 0):.3f}",
                f"{model.get('cv_score', 0):.3f}",
                f"{model.get('training_time', 0):.2f}"
            ])
        
        return TableGenerator._create_table(data, "Model Performance Comparison")
    
    @staticmethod
    def create_feature_importance_table(feature_ranking: List[Dict[str, Any]]) -> Table:
        """Create feature importance table"""
        data = [['Rank', 'Feature', 'Importance', 'Impact']]
        
        for item in feature_ranking[:10]:
            impact = 'High' if item.get('percentage', 0) > 10 else 'Medium' if item.get('percentage', 0) > 5 else 'Low'
            data.append([
                str(item.get('rank', '')),
                item.get('feature', 'Unknown'),
                f"{item.get('importance', 0):.3f}",
                impact
            ])
        
        return TableGenerator._create_table(data, "Feature Importance Ranking")
    
    @staticmethod
    def create_outlier_table(outliers: Dict[str, Any]) -> Table:
        """Create outlier analysis table"""
        data = [['Column', 'Outliers', 'Percentage', 'Severity']]
        
        analysis = outliers.get('analysis', {})
        for col, info in analysis.items():
            outlier_data = info.get('outlier_analysis', {})
            count = outlier_data.get('outlier_count', 0)
            pct = outlier_data.get('outlier_percentage', 0)
            severity = info.get('severity', 'None')
            
            if count > 0:
                data.append([col, str(count), f"{pct:.1f}%", severity])
        
        if len(data) == 1:
            data.append(['No outliers detected', '', '', ''])
        
        return TableGenerator._create_table(data, "Outlier Analysis")
    
    @staticmethod
    def create_recommendations_table(recommendations: List[str]) -> Table:
        """Create recommendations table"""
        data = [['#', 'Recommendation']]
        
        for i, rec in enumerate(recommendations[:10], 1):
            data.append([str(i), rec])
        
        return TableGenerator._create_table(data, "Key Recommendations")
    
    @staticmethod
    def _create_table(data: List[List], title: str = "") -> Table:
        """Create a formatted table"""
        # Create table
        table = Table(data, repeatRows=1)
        
        # Style the table
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ])
        
        table.setStyle(style)
        return table
