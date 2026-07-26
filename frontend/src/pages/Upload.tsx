import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDataset } from '../services/api';

interface UploadPageProps {
  onDataLoaded?: (data: any) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onDataLoaded }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus('uploading');
    setProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      console.log('Uploading file:', file.name);
      const result = await uploadDataset(file);
      console.log('Upload result:', result);
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus('complete');
      
      // Pass data to parent if callback exists
      if (onDataLoaded) {
        onDataLoaded(result.data);
      }
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatus('error');
      setError(err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Dataset</h1>
        <p className="text-gray-500 mt-2">Upload a CSV or Excel file to analyze</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-400 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="file-upload" className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex flex-col items-center gap-4">
              {file ? (
                <>
                  <FileSpreadsheet className="w-12 h-12 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Drop your file here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">Supports CSV, XLSX, XLS</p>
                  </div>
                </>
              )}
            </div>
          </label>
        </div>

        {file && status === 'idle' && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-6 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload & Analyze
          </button>
        )}

        {status !== 'idle' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <span className="font-medium">
                  {status === 'uploading' && 'Uploading...'}
                  {status === 'processing' && 'Processing...'}
                  {status === 'complete' && 'Analysis Complete!'}
                  {status === 'error' && 'Upload Failed'}
                </span>
              </div>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  status === 'error' ? 'bg-red-500' : 'bg-primary-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {status === 'error' && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Supported formats: CSV, XLSX, XLS</p>
        <p className="mt-1">Maximum file size: 100MB</p>
      </div>
    </div>
  );
};

export default UploadPage;
