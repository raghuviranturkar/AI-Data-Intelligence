"""
Table Generator for PDF Reports
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
    def create_table(data: List[List], title: str = "") -> Table:
        """Create a formatted table with proper styling"""
        # Create table
        table = Table(data, repeatRows=1)
        
        # Style the table
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
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
    
    @staticmethod
    def create_quality_table(quality_data: Dict[str, Any]) -> Table:
        data = [
            ['Metric', 'Value', 'Status'],
            ['Quality Score', f"{quality_data.get('quality_score', 0)}/100", 
             '✅ Good' if quality_data.get('quality_score', 0) >= 70 else '⚠️ Needs Improvement'],
            ['Warnings', str(quality_data.get('total_warnings', 0)), 
             '✅' if quality_data.get('total_warnings', 0) == 0 else '⚠️ Review Required'],
        ]
        return TableGenerator.create_table(data, "Quality Metrics")
    
    @staticmethod
    def create_dataset_overview_table(dataset: Dict[str, Any]) -> Table:
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
        return TableGenerator.create_table(data, "Dataset Overview")
    
    @staticmethod
    def create_missing_values_table(missing_values: Dict[str, int]) -> Table:
        data = [['Column', 'Missing Values', 'Percentage']]
        for col, count in missing_values.items():
            if count > 0:
                total = sum(missing_values.values())
                pct = (count / total * 100) if total > 0 else 0
                data.append([col, str(count), f"{pct:.1f}%"])
        if len(data) == 1:
            data.append(['No missing values found', '', ''])
        return TableGenerator.create_table(data, "Missing Values Analysis")
    
    @staticmethod
    def create_model_comparison_table(ranked_models: List[Dict[str, Any]]) -> Table:
        data = [['Rank', 'Model', 'Score', 'CV Score']]
        for model in ranked_models[:5]:
            data.append([
                str(model.get('rank', '')),
                model.get('model_name', 'Unknown'),
                f"{model.get('score', 0):.3f}",
                f"{model.get('cv_score', 0):.3f}"
            ])
        return TableGenerator.create_table(data, "Model Performance Comparison")
    
    @staticmethod
    def create_recommendations_table(recommendations: List[str]) -> Table:
        data = [['#', 'Recommendation']]
        for i, rec in enumerate(recommendations[:10], 1):
            data.append([str(i), rec])
        return TableGenerator.create_table(data, "Key Recommendations")
