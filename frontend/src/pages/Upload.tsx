import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { uploadDataset } from '../services/api'
import { 
  Upload, 
  FileSpreadsheet, 
  FileJson, 
  FileCode, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  Clock,
  HardDrive,
  Award,
  Target,
  Brain,
  Shield,
  Lightbulb,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  Activity,
  Sparkles
} from 'lucide-react'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { cn } from '../utils/cn'

// Toast component
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  const colors = {
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-700 dark:text-success-400',
    error: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
  }
  
  return (
    <div className={`${colors[type]} border rounded-lg p-4 mb-4 flex items-center justify-between`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        ✕
      </button>
    </div>
  )
}

// Pipeline Stage Component
interface PipelineStage {
  id: string
  label: string
  icon: React.ReactNode
  status: 'waiting' | 'running' | 'completed' | 'error'
}

const UploadPage: React.FC = () => {
  const navigate = useNavigate()
  const { setData, setIsLoading } = useData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showLogs, setShowLogs] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [datasetPreview, setDatasetPreview] = useState<any>(null)
  const [currentStage, setCurrentStage] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Pipeline stages
  const stages: PipelineStage[] = [
    { id: 'upload', label: 'Dataset Upload', icon: <Upload className="h-5 w-5" />, status: 'waiting' },
    { id: 'validation', label: 'Validation', icon: <CheckCircle className="h-5 w-5" />, status: 'waiting' },
    { id: 'cleaning', label: 'Cleaning', icon: <Activity className="h-5 w-5" />, status: 'waiting' },
    { id: 'outliers', label: 'Outlier Detection', icon: <AlertCircle className="h-5 w-5" />, status: 'waiting' },
    { id: 'eda', label: 'EDA', icon: <BarChart3 className="h-5 w-5" />, status: 'waiting' },
    { id: 'feature', label: 'Feature Engineering', icon: <Settings className="h-5 w-5" />, status: 'waiting' },
    { id: 'automl', label: 'AutoML', icon: <Brain className="h-5 w-5" />, status: 'waiting' },
    { id: 'explainability', label: 'Explainability', icon: <Shield className="h-5 w-5" />, status: 'waiting' },
    { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="h-5 w-5" />, status: 'waiting' },
    { id: 'reports', label: 'Reports', icon: <FileText className="h-5 w-5" />, status: 'waiting' },
  ]

  const [pipelineStages, setPipelineStages] = useState(stages)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = ['.csv', '.xlsx', '.xls', '.json', '.parquet']
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
    
    if (!validExtensions.includes(ext || '')) {
      setToast({ message: 'Unsupported file format. Please use CSV, Excel, JSON, or Parquet.', type: 'error' })
      setTimeout(() => setToast(null), 5000)
      return
    }
    
    if (selectedFile.size > 200 * 1024 * 1024) {
      setToast({ message: 'File too large. Maximum size is 200MB.', type: 'error' })
      setTimeout(() => setToast(null), 5000)
      return
    }
    
    setFile(selectedFile)
    setErrorMsg(null)
    setStatus('idle')
    setDatasetPreview(null)
    setProgress(0)
    setPipelineStages(stages.map(s => ({ ...s, status: 'waiting' as const })))
    setCurrentStage(0)
    setLogs([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      validateAndSetFile(selected)
    }
  }

  const simulatePipeline = async () => {
    addLog('🚀 Starting AI Analysis Pipeline...')
    setStatus('analyzing')
    setIsLoading(true)
    
    const stageNames = [
      'validation', 'cleaning', 'outliers', 'eda', 
      'feature', 'automl', 'explainability', 'insights', 'reports'
    ]
    
    const stageLabels = [
      'Validating dataset...',
      'Analyzing data quality...',
      'Detecting outliers...',
      'Performing EDA...',
      'Engineering features...',
      'Training AutoML models...',
      'Calculating explainability...',
      'Generating AI insights...',
      'Creating reports...'
    ]
    
    for (let i = 0; i < stageNames.length; i++) {
      const stageIndex = i + 1
      
      setPipelineStages(prev => prev.map((s, idx) => 
        idx === stageIndex ? { ...s, status: 'running' as const } : s
      ))
      
      addLog(`⏳ ${stageLabels[i]}`)
      
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
      
      setPipelineStages(prev => prev.map((s, idx) => 
        idx === stageIndex ? { ...s, status: 'completed' as const } : s
      ))
      
      setCurrentStage(stageIndex)
      addLog(`✅ ${stageLabels[i]} complete`)
      
      setProgress(Math.min((stageIndex / (stageNames.length)) * 100, 95))
    }
    
    setProgress(100)
    addLog('🎉 Analysis complete! All reports generated.')
    setStatus('complete')
    setIsLoading(false)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus('uploading')
    setProgress(10)
    setErrorMsg(null)
    setIsLoading(true)
    addLog(`📤 Uploading ${file.name}...`)

    try {
      const result = await uploadDataset(file)
      
      setProgress(30)
      addLog('✅ File uploaded successfully')
      
      setPipelineStages(prev => prev.map((s, idx) => 
        idx === 0 ? { ...s, status: 'completed' as const } : s
      ))
      
      setDatasetPreview({
        rows: result?.dataset?.shape?.rows || 0,
        columns: result?.dataset?.shape?.columns || 0,
        size: file.size,
        qualityScore: result?.validation?.quality?.quality_score || 0,
        target: result?.automl?.target_column || 'Auto-detected',
      })
      
      setData(result)
      
      await simulatePipeline()
      
      addLog('✅ Analysis complete!')
      
    } catch (err) {
      console.error('Upload error:', err)
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      addLog(`❌ Error: ${err instanceof Error ? err.message : 'Upload failed'}`)
      setToast({ message: 'Upload failed. Please try again.', type: 'error' })
      setTimeout(() => setToast(null), 5000)
      setIsLoading(false)
    } finally {
      setUploading(false)
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setErrorMsg(null)
    setDatasetPreview(null)
    setLogs([])
    setPipelineStages(stages.map(s => ({ ...s, status: 'waiting' as const })))
    setCurrentStage(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleNavigateToDashboard = () => {
    navigate('/')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full border border-primary-200 dark:border-primary-800">
          <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-400">AI-Powered Data Intelligence</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Upload Your Dataset
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Upload your dataset and let AI automatically inspect, clean, analyze, train models, 
          explain predictions, generate insights, and create professional reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div 
            ref={dropRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              'bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-dashed transition-all duration-300 p-12 text-center',
              dragActive 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500',
              file && 'border-success-500 bg-success-50/10 dark:bg-success-900/10'
            )}
          >
            {status === 'complete' ? (
              <div className="space-y-4 py-8">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-success-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Complete!</h3>
                <p className="text-gray-500 dark:text-gray-400">Your dataset has been successfully analyzed.</p>
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  <Button variant="primary" size="lg" onClick={handleNavigateToDashboard}>
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="secondary" size="lg" onClick={handleReset}>
                    Upload Another
                  </Button>
                </div>
              </div>
            ) : file ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <FileSpreadsheet className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{file.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                </div>
                
                {status === 'uploading' || status === 'analyzing' ? (
                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {status === 'uploading' ? 'Uploading...' : 'Analyzing...'}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          Start AI Analysis
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleReset}>
                      Change File
                    </Button>
                  </div>
                )}

                {errorMsg && (
                  <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4 text-danger-700 dark:text-danger-400">
                    {errorMsg}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <Upload className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Drop your dataset here</h3>
                  <p className="text-gray-500 dark:text-gray-400">or click to browse files</p>
                </div>
                <div>
                  <Button variant="primary" size="lg" onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400 dark:text-gray-500">
                  <span>Supports: CSV, Excel, JSON, Parquet</span>
                  <span>•</span>
                  <span>Max: 200MB</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.json,.parquet"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Supported Formats</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { name: 'CSV', icon: <FileSpreadsheet className="h-6 w-6" />, color: 'text-green-500' },
                { name: 'Excel', icon: <FileSpreadsheet className="h-6 w-6" />, color: 'text-blue-500' },
                { name: 'JSON', icon: <FileJson className="h-6 w-6" />, color: 'text-yellow-500' },
                { name: 'Parquet', icon: <Database className="h-6 w-6" />, color: 'text-purple-500' },
                { name: 'SQL', icon: <FileCode className="h-6 w-6" />, color: 'text-red-500' },
              ].map((format) => (
                <div key={format.name} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className={format.color}>{format.icon}</div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">{format.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI Pipeline</h3>
              {status === 'complete' && <Badge variant="success" size="sm">Complete</Badge>}
              {status === 'analyzing' && <Badge variant="warning" size="sm">Running</Badge>}
            </div>
            <div className="space-y-2">
              {pipelineStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
                    stage.status === 'completed' ? 'bg-success-100 dark:bg-success-900/30 text-success-500' :
                    stage.status === 'running' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-500' :
                    'bg-gray-100 dark:bg-gray-700/50 text-gray-300 dark:text-gray-600'
                  )}>
                    {stage.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : stage.status === 'running' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className={cn(
                      'text-sm transition-colors duration-300',
                      stage.status === 'completed' ? 'text-gray-900 dark:text-white' :
                      stage.status === 'running' ? 'text-primary-600 dark:text-primary-400 font-medium' :
                      'text-gray-400 dark:text-gray-500'
                    )}>
                      {stage.label}
                    </span>
                    {stage.status === 'completed' && (
                      <span className="text-xs text-success-500">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Live Logs</h3>
                {logs.length > 0 && (
                  <Badge variant="info" size="sm">{logs.length}</Badge>
                )}
              </div>
              <span className="text-gray-400">{showLogs ? '▼' : '▶'}</span>
            </button>
            
            {showLogs && (
              <div className="mt-4 max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-1 font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-gray-400 dark:text-gray-500 text-center py-4">
                    Logs will appear here during analysis
                  </p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-gray-700 dark:text-gray-300">
                      {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">💡 Tips</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Badge variant="info" size="sm">Recommended</Badge>
                <span>100+ rows for meaningful analysis</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Badge variant="success" size="sm">Preferred</Badge>
                <span>CSV format for best compatibility</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Badge variant="warning" size="sm">Supported</Badge>
                <span>Missing values are handled automatically</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Badge variant="info" size="sm">Auto Detect</Badge>
                <span>Target column is detected automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {datasetPreview && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Dataset Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{datasetPreview.rows}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rows</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{datasetPreview.columns}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Columns</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{datasetPreview.qualityScore}/100</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Quality Score</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{datasetPreview.target}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadPage
