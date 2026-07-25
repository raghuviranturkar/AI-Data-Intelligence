"""
Report Engine
Orchestrates report generation in multiple formats
"""
from typing import Dict, Any, Optional
from .pdf_generator import PDFGenerator, generate_pdf_report


class ReportEngine:
    """
    Report Engine for generating professional reports
    Supports PDF, HTML, and Markdown formats
    """
    
    def __init__(self, context: Dict[str, Any]):
        """
        Initialize report engine
        
        Args:
            context: Complete pipeline context
        """
        self.context = context
        self.generator = PDFGenerator(context)
    
    def generate_pdf(self, output_path: str = "report.pdf") -> str:
        """
        Generate PDF report
        
        Args:
            output_path: Path to save the PDF
            
        Returns:
            Path to generated PDF
        """
        return self.generator.generate(output_path)
    
    def generate_html(self) -> str:
        """
        Generate HTML report
        
        Returns:
            HTML string
        """
        return self.generator.generate_html()
    
    def generate_markdown(self) -> str:
        """
        Generate Markdown report
        
        Returns:
            Markdown string
        """
        return self.generator.generate_markdown()
    
    def generate_all(self, output_dir: str = "reports") -> Dict[str, str]:
        """
        Generate all report formats
        
        Args:
            output_dir: Directory to save reports
            
        Returns:
            Dictionary with paths to generated reports
        """
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        results = {}
        
        # PDF
        pdf_path = f"{output_dir}/report.pdf"
        results["pdf"] = self.generate_pdf(pdf_path)
        
        # HTML
        html_path = f"{output_dir}/report.html"
        with open(html_path, 'w') as f:
            f.write(self.generate_html())
        results["html"] = html_path
        
        # Markdown
        md_path = f"{output_dir}/report.md"
        with open(md_path, 'w') as f:
            f.write(self.generate_markdown())
        results["markdown"] = md_path
        
        return results


def generate_report(context: Dict[str, Any], 
                   output_path: str = "report.pdf") -> str:
    """
    Convenience function to generate a PDF report
    
    Args:
        context: Complete pipeline context
        output_path: Path to save the PDF
        
    Returns:
        Path to generated PDF
    """
    engine = ReportEngine(context)
    return engine.generate_pdf(output_path)

def generate_report(context: Dict[str, Any], 
                   output_path: str = "report.pdf") -> str:
    """
    Convenience function to generate a PDF report
    
    Args:
        context: Complete pipeline context
        output_path: Path to save the PDF
        
    Returns:
        Path to generated PDF
    """
    engine = ReportEngine(context)
    return engine.generate_pdf(output_path)
