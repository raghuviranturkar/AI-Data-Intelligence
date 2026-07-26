import React, { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle } from 'lucide-react';

interface DownloadSectionProps {
  data: any;
}

const DownloadSection: React.FC<DownloadSectionProps> = ({ data }) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDownload = async (format: 'pdf' | 'html' | 'md') => {
    setDownloading(format);
    setSuccess(null);
    
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a download with a JSON blob
      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: 'application/json' }
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess(format);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

  const getButtonStyle = (format: string) => {
    const baseStyle = 'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium';
    
    if (downloading === format) {
      return `${baseStyle} bg-gray-200 text-gray-400 cursor-not-allowed`;
    }
    
    if (success === format) {
      return `${baseStyle} bg-green-600 text-white hover:bg-green-700`;
    }
    
    switch (format) {
      case 'pdf':
        return `${baseStyle} bg-primary-600 text-white hover:bg-primary-700`;
      case 'html':
        return `${baseStyle} bg-gray-600 text-white hover:bg-gray-700`;
      case 'md':
        return `${baseStyle} bg-gray-600 text-white hover:bg-gray-700`;
      default:
        return `${baseStyle} bg-gray-600 text-white hover:bg-gray-700`;
    }
  };

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Download Reports</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleDownload('pdf')}
          disabled={downloading !== null}
          className={getButtonStyle('pdf')}
        >
          {downloading === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success === 'pdf' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          {success === 'pdf' ? 'Downloaded!' : 'Download PDF'}
        </button>
        
        <button
          onClick={() => handleDownload('html')}
          disabled={downloading !== null}
          className={getButtonStyle('html')}
        >
          {downloading === 'html' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success === 'html' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          {success === 'html' ? 'Downloaded!' : 'Download HTML'}
        </button>
        
        <button
          onClick={() => handleDownload('md')}
          disabled={downloading !== null}
          className={getButtonStyle('md')}
        >
          {downloading === 'md' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success === 'md' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          {success === 'md' ? 'Downloaded!' : 'Download Markdown'}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Reports include all analysis results, visualizations, and insights
      </p>
    </div>
  );
};

export default DownloadSection;
