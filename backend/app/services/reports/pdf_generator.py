"""
PDF Generator
Generates professional PDF reports from pipeline results
"""
import os
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, Image, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.utils import ImageReader
import io

from .sections import SectionGenerator


class PDFGenerator:
    """Generates professional PDF reports"""
    
    def __init__(self, context: Dict[str, Any]):
        """
        Initialize PDF generator
        
        Args:
            context: Complete pipeline context
        """
        self.context = context
        self.section_generator = SectionGenerator(context)
        self.styles = getSampleStyleSheet()
    
    def generate(self, output_path: str = "report.pdf") -> str:
        """
        Generate PDF report
        
        Args:
            output_path: Path to save the PDF
            
        Returns:
            Path to generated PDF
        """
        # Create document
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Build content
        content = []
        
        # Cover Page
        content.extend(self.section_generator.get_cover_page())
        content.append(PageBreak())
        
        # Dataset Overview
        content.extend(self.section_generator.get_dataset_overview())
        content.append(Spacer(1, 0.3 * inch))
        
        # Data Quality
        content.extend(self.section_generator.get_quality_section())
        content.append(Spacer(1, 0.3 * inch))
        
        # Missing Values
        content.extend(self.section_generator.get_missing_values_section())
        content.append(Spacer(1, 0.3 * inch))
        
        # Outlier Analysis
        content.extend(self.section_generator.get_outlier_section())
        content.append(Spacer(1, 0.3 * inch))
        
        # EDA
        content.extend(self.section_generator.get_eda_section())
        content.append(Spacer(1, 0.3 * inch))
        
        # Feature Engineering
        content.extend(self.section_generator.get_feature_engineering_section())
        content.append(Spacer(1, 0.3 * inch))
        
        # AutoML
        content.extend(self.section_generator.get_automl_section())
        content.append(Spacer(1, 0.3 * inch))
        
        # Explainability
        content.extend(self.section_generator.get_explainability_section())
        content.append(Spacer(1, 0.3 * inch))
        
        # AI Insights
        content.extend(self.section_generator.get_insights_section())
        content.append(Spacer(1, 0.3 * inch))
        
        # Appendix
        content.extend(self.section_generator.get_appendix())
        
        # Build PDF
        doc.build(content)
        
        return output_path
    
    def generate_html(self) -> str:
        """
        Generate HTML version of the report
        
        Returns:
            HTML string
        """
        html = []
        html.append("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>AI Data Intelligence Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #1a237e; }
                h2 { color: #283593; margin-top: 30px; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th { background-color: #1a237e; color: white; padding: 10px; text-align: left; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
                tr:hover { background-color: #f5f5f5; }
                .summary { background-color: #e8eaf6; padding: 20px; border-radius: 5px; }
                .warning { color: #c62828; }
                .success { color: #2e7d32; }
            </style>
        </head>
        <body>
        """)
        
        # Executive Summary
        insights = self.context.get('insights', {})
        summary = insights.get('executive_summary', '')
        if summary:
            html.append(f"<div class='summary'><h2>Executive Summary</h2><p>{summary}</p></div>")
        
        # Dataset Overview
        dataset = self.context.get('dataset', {})
        shape = dataset.get('shape', {})
        html.append("<h2>Dataset Overview</h2>")
        html.append("<table><tr><th>Property</th><th>Value</th></tr>")
        html.append(f"<tr><td>Rows</td><td>{shape.get('rows', 0)}</td></tr>")
        html.append(f"<tr><td>Columns</td><td>{shape.get('columns', 0)}</td></tr>")
        html.append(f"<tr><td>File Name</td><td>{dataset.get('file_name', 'Unknown')}</td></tr>")
        html.append("</table>")
        
        # Quality Score
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        score = quality.get('quality_score', 0)
        html.append(f"<h2>Data Quality Score: {score}/100</h2>")
        
        # Warnings
        warnings = quality.get('warnings', [])
        if warnings:
            html.append("<h3>Warnings</h3><ul>")
            for warning in warnings[:5]:
                html.append(f"<li>{warning}</li>")
            html.append("</ul>")
        
        # AI Health Score
        health = insights.get('ai_health_score', {})
        if health:
            html.append(f"<h2>AI Health Score: {health.get('score', 0)}/100</h2>")
            html.append(f"<p>Confidence: {health.get('confidence', 'Unknown')}</p>")
        
        # Recommendations
        recommendations = insights.get('recommendations', [])
        if recommendations:
            html.append("<h2>Key Recommendations</h2><ul>")
            for rec in recommendations[:5]:
                html.append(f"<li>{rec}</li>")
            html.append("</ul>")
        
        html.append("</body></html>")
        
        return "\n".join(html)
    
    def generate_markdown(self) -> str:
        """Generate Markdown version of the report"""
        md = []
        
        md.append("# AI Data Intelligence Report\n")
        
        # Dataset Overview
        dataset = self.context.get('dataset', {})
        shape = dataset.get('shape', {})
        md.append("## Dataset Overview\n")
        md.append(f"- **Rows:** {shape.get('rows', 0)}")
        md.append(f"- **Columns:** {shape.get('columns', 0)}")
        md.append(f"- **File Name:** {dataset.get('file_name', 'Unknown')}\n")
        
        # Quality Score
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        score = quality.get('quality_score', 0)
        md.append(f"## Data Quality Score: {score}/100\n")
        
        # AI Health Score
        insights = self.context.get('insights', {})
        health = insights.get('ai_health_score', {})
        if health:
            md.append(f"## AI Health Score: {health.get('score', 0)}/100\n")
        
        # Recommendations
        recommendations = insights.get('recommendations', [])
        if recommendations:
            md.append("## Key Recommendations\n")
            for rec in recommendations[:5]:
                md.append(f"- {rec}")
            md.append("")
        
        return "\n".join(md)


def generate_pdf_report(context: Dict[str, Any], output_path: str = "report.pdf") -> str:
    """
    Convenience function to generate PDF report
    
    Args:
        context: Complete pipeline context
        output_path: Path to save the PDF
        
    Returns:
        Path to generated PDF
    """
    generator = PDFGenerator(context)
    return generator.generate(output_path)
