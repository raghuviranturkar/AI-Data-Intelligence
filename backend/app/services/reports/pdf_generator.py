"""
PDF Generator - Creates real PDF reports
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
import io
import json

from .sections import SectionGenerator


class PDFGenerator:
    def __init__(self, context: Dict[str, Any]):
        self.context = context
        self.section_generator = SectionGenerator(context)
        self.styles = getSampleStyleSheet()
    
    def generate(self, output_path: str = "report.pdf") -> str:
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        content = []
        content.extend(self.section_generator.get_cover_page())
        content.append(PageBreak())
        content.extend(self.section_generator.get_dataset_overview())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_quality_section())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_missing_values_section())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_outlier_section())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_eda_section())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_feature_engineering_section())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_automl_section())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_explainability_section())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_insights_section())
        content.append(Spacer(1, 0.3 * inch))
        content.extend(self.section_generator.get_appendix())
        
        doc.build(content)
        return output_path
    
    def generate_html(self) -> str:
        """Generate HTML report"""
        html = []
        html.append("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>AI Data Intelligence Report</title>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #1a237e; border-bottom: 3px solid #1a237e; padding-bottom: 10px; }
                h2 { color: #283593; margin-top: 30px; border-bottom: 2px solid #e8eaf6; padding-bottom: 8px; }
                h3 { color: #3949ab; margin-top: 20px; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th { background-color: #1a237e; color: white; padding: 10px; text-align: left; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
                tr:nth-child(even) { background-color: #f5f5f5; }
                .summary { background-color: #e8eaf6; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .warning { color: #c62828; }
                .success { color: #2e7d32; }
                .card { background-color: white; border-radius: 8px; padding: 20px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .metric { display: inline-block; background: #f5f5f5; padding: 10px 20px; margin: 5px; border-radius: 5px; }
                .metric-value { font-size: 24px; font-weight: bold; color: #1a237e; }
                .metric-label { font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
        """)
        
        # Dataset Overview
        dataset = self.context.get('dataset', {})
        shape = dataset.get('shape', {})
        html.append("<h1>AI Data Intelligence Report</h1>")
        html.append(f"<p><strong>Dataset:</strong> {dataset.get('file_name', 'Unknown')}</p>")
        html.append(f"<p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>")
        
        html.append("<h2>Dataset Overview</h2>")
        html.append(f"<div class='card'>")
        html.append(f"<span class='metric'><span class='metric-value'>{shape.get('rows', 0)}</span><br><span class='metric-label'>Rows</span></span>")
        html.append(f"<span class='metric'><span class='metric-value'>{shape.get('columns', 0)}</span><br><span class='metric-label'>Columns</span></span>")
        html.append(f"</div>")
        
        # Quality Score
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        score = quality.get('quality_score', 0)
        html.append(f"<h2>Data Quality Score: {score}/100</h2>")
        
        # Warnings
        warnings = quality.get('warnings', [])
        if warnings:
            html.append("<h3>Warnings</h3><ul>")
            for warning in warnings[:10]:
                html.append(f"<li>{warning}</li>")
            html.append("</ul>")
        
        # Insights
        insights = self.context.get('insights', {})
        summary = insights.get('executive_summary', '')
        if summary:
            html.append(f"<div class='summary'><h2>Executive Summary</h2><p>{summary}</p></div>")
        
        # Recommendations
        recommendations = insights.get('recommendations', [])
        if recommendations:
            html.append("<h2>Recommendations</h2><ul>")
            for rec in recommendations[:5]:
                html.append(f"<li>{rec}</li>")
            html.append("</ul>")
        
        html.append("</body></html>")
        return "\n".join(html)
    
    def generate_markdown(self) -> str:
        """Generate Markdown report"""
        md = []
        
        dataset = self.context.get('dataset', {})
        shape = dataset.get('shape', {})
        
        md.append("# AI Data Intelligence Report\n")
        md.append(f"**Dataset:** {dataset.get('file_name', 'Unknown')}\n")
        md.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        md.append("## Dataset Overview\n")
        md.append(f"- **Rows:** {shape.get('rows', 0)}")
        md.append(f"- **Columns:** {shape.get('columns', 0)}\n")
        
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        score = quality.get('quality_score', 0)
        md.append(f"## Data Quality Score: {score}/100\n")
        
        warnings = quality.get('warnings', [])
        if warnings:
            md.append("### Warnings\n")
            for warning in warnings[:10]:
                md.append(f"- {warning}")
            md.append("")
        
        insights = self.context.get('insights', {})
        summary = insights.get('executive_summary', '')
        if summary:
            md.append("## Executive Summary\n")
            md.append(f"{summary}\n")
        
        recommendations = insights.get('recommendations', [])
        if recommendations:
            md.append("## Recommendations\n")
            for rec in recommendations[:5]:
                md.append(f"- {rec}")
            md.append("")
        
        return "\n".join(md)


def generate_pdf_report(context: Dict[str, Any], output_path: str = "report.pdf") -> str:
    generator = PDFGenerator(context)
    return generator.generate(output_path)


def generate_html_report(context: Dict[str, Any]) -> str:
    generator = PDFGenerator(context)
    return generator.generate_html()


def generate_markdown_report(context: Dict[str, Any]) -> str:
    generator = PDFGenerator(context)
    return generator.generate_markdown()
