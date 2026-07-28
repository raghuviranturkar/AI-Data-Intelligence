import React, { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, BarChart3, Settings, Brain, Shield, Lightbulb } from 'lucide-react'
import { Button } from '../components/common/Button'
import ProgressBar from '../components/common/ProgressBar'
import HorizontalPipeline from '../components/pipeline/HorizontalPipeline'
import { cn } from '../utils/cn'

const pipelineStages = [
  { id: 'upload', label: 'Upload', icon: <Upload className="h-6 w-6" />, status: 'completed' as const },
  { id: 'validation', label: 'Validation', icon: <CheckCircle className="h-6 w-6" />, status: 'waiting' as const },
  { id: 'cleaning', label: 'Cleaning', icon: <Loader2 className="h-6 w-6" />, status: 'waiting' as const },
  { id: 'eda', label: 'EDA', icon: <BarChart3 className="h-6 w-6" />, status: 'waiting' as const },
  { id: 'feature_engineering', label: 'Feature Eng.', icon: <Settings className="h-6 w-6" />, status: 'waiting' as const },
  { id: 'automl', label: 'AutoML', icon: <Brain className="h-6 w-6" />, status: 'waiting' as const },
  { id: 'explainability', label: 'Explainability', icon: <Shield className="h-6 w-6" />, status: 'waiting' as const },
  { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="h-6 w-6" />, status: 'waiting' as const },
]

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [stages, setStages] = useState(pipelineStages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setError(null)
      setStatus('idle')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError(null)
      setStatus('idle')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const simulatePipeline = async () => {
    const stageIds = ['validation', 'cleaning', 'eda', 'feature_engineering', 'automl', 'explainability', 'insights']
    
    for (let i = 0; i < stageIds.length; i++) {
      setStages(prev => prev.map(s => 
        s.id === stageIds[i] ? { ...s, status: 'running' as const } : s
      ))
      
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
      
      setStages(prev => prev.map(s => 
        s.id === stageIds[i] ? { ...s, status: 'completed' as const } : s
      ))
      
      setProgress(prev => Math.min(prev + 12, 100))
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus('uploading')
    setProgress(10)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProgress(30)
      setStatus('processing')

      await simulatePipeline()
      
      setProgress(100)
      setStatus('complete')
      
    } catch (err) {
      setStatus('error')
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setError(null)
    setStages(pipelineStages)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Dataset</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Upload a CSV or Excel file to analyze</p>
      </div>

      {/* Upload Area */}
      <div 
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-8 transition-all duration-200',
          status === 'complete' && 'border-2 border-success-500 dark:border-success-400'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {status === 'complete' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-success-500 dark:text-success-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Upload Complete!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Your dataset has been successfully analyzed.</p>
            <Button onClick={handleReset} className="mt-6">Upload Another</Button>
          </div>
        ) : (
          <>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
                ref={fileInputRef}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileSpreadsheet className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleReset()
                        }}
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Drop your file here</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Supports CSV, XLSX, XLS</p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Progress and Pipeline */}
            {(uploading || status === 'processing') && (
              <div className="mt-6 space-y-4">
                <ProgressBar value={progress} label={status === 'uploading' ? 'Uploading...' : 'Processing...'} />
                {progress > 30 && (
                  <HorizontalPipeline stages={stages} currentStage={stages.findIndex(s => s.status === 'running')} overallProgress={progress} />
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4 text-sm text-danger-700 dark:text-danger-400">
                {error}
              </div>
            )}

            {file && !uploading && status !== 'processing' && status !== 'complete' && (
              <Button
                onClick={handleUpload}
                size="lg"
                className="mt-6 w-full"
              >
                Upload & Analyze
              </Button>
            )}
          </>
        )}
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Supported formats: CSV, XLSX, XLS</p>
        <p className="mt-1">Maximum file size: 100MB</p>
      </div>
    </div>
  )
}

export default UploadPage
