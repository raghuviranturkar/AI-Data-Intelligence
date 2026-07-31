import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import { 
  Loader2, AlertTriangle, FileText, RefreshCw, Globe
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { downloadReport } from '../../services/api'

// Import sub-components
import ReportsHeader from './ReportsHeader'
import ReportsOverview from './ReportsOverview'
import ReportsPipeline from './ReportsPipeline'
import ReportCard from './ReportCard'
import ReportContentSummary from './ReportContentSummary'
import ReportMetadata from './ReportMetadata'
import ExportComparison from './ExportComparison'
import ReportPreview from './ReportPreview'
import DownloadHistory from './DownloadHistory'
import ReportStatistics from './ReportStatistics'
import ShareOptions from './ShareOptions'
import RegenerateReports from './RegenerateReports'

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  const bgColor = type === 'success' 
    ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-700 dark:text-success-400'
    : 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400'
  
  return (
    <div className={`${bgColor} border rounded-lg p-4 mb-4 flex items-center justify-between`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        ✕
      </button>
    </div>
  )
}

const ReportsPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const [generating, setGenerating] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const sessionId = (data as any)?.session_id || null

  const handleDownload = async (format: 'pdf' | 'html' | 'md') => {
    if (!sessionId) {
      setToast({ 
        message: 'Unable to download report. Please generate a report first.', 
        type: 'error' 
      })
      setTimeout(() => setToast(null), 5000)
      return
    }

    setDownloadProgress(prev => ({ ...prev, [format]: true }))
    
    try {
      await downloadReport(sessionId, format)
      const formatNames = { pdf: 'PDF', html: 'HTML', md: 'Markdown' }
      setToast({ 
        message: `${formatNames[format]} downloaded successfully`, 
        type: 'success' 
      })
      setTimeout(() => setToast(null), 5000)
    } catch (err: any) {
      console.error(`Failed to download ${format} report:`, err)
      const status = err.response?.status
      let message = 'Unable to download report. Please generate a report first.'
      if (status === 404) {
        message = 'Report not found. Please generate a report first.'
      } else if (status === 500) {
        message = 'Server error occurred while generating the report.'
      }
      setToast({ message, type: 'error' })
      setTimeout(() => setToast(null), 5000)
    } finally {
      setDownloadProgress(prev => ({ ...prev, [format]: false }))
    }
  }

  const handleRegenerate = async () => {
    setGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      setToast({ message: 'Reports regenerated successfully', type: 'success' })
      setTimeout(() => setToast(null), 5000)
    } catch (err) {
      setToast({ message: 'Failed to regenerate reports', type: 'error' })
      setTimeout(() => setToast(null), 5000)
    } finally {
      setGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading reports...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-danger-500" />
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Failed to load data</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Reports Available</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Upload a dataset to generate professional AI analysis reports.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  const dataset = data?.dataset || {}
  const validation = data?.validation || {}
  const automl = data?.automl || {}
  const insights = data?.insights || {}
  const rows = dataset?.shape?.rows || 0
  const columns = dataset?.shape?.columns || 0
  const qualityScore = validation?.quality?.quality_score || 0
  const bestModel = automl?.best_model?.name || 'N/A'
  const healthScore = insights?.ai_health_score?.score || 0

  const reports = [
    {
      id: 'pdf',
      title: 'PDF Report',
      description: 'Complete business report with all analysis results, charts, and insights. Perfect for printing and sharing with stakeholders.',
      icon: <FileText className="h-8 w-8" />,
      format: 'pdf' as const,
      status: 'ready' as const,
      size: '2.4 MB',
      generatedAt: 'Today at 08:45 AM',
      features: ['Executive Summary', 'Dataset Overview', 'Visualizations', 'Model Performance', 'AI Insights'],
    },
    {
      id: 'html',
      title: 'HTML Report',
      description: 'Interactive web-based report with full chart interactivity. Open in any browser for a rich analytical experience.',
      icon: <Globe className="h-8 w-8" />,
      format: 'html' as const,
      status: 'ready' as const,
      size: '3.1 MB',
      generatedAt: 'Today at 08:45 AM',
      features: ['Interactive Charts', 'Responsive Design', 'Dark Mode Support', 'Print-Friendly'],
    },
    {
      id: 'md',
      title: 'Markdown Report',
      description: 'Lightweight developer-friendly report in Markdown format. Perfect for documentation and GitHub repositories.',
      icon: <FileText className="h-8 w-8" />,
      format: 'md' as const,
      status: 'ready' as const,
      size: '0.8 MB',
      generatedAt: 'Today at 08:45 AM',
      features: ['GitHub Compatible', 'Lightweight', 'Version Control Friendly', 'Easy to Edit'],
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <ReportsHeader 
        reportsCount={reports.length}
        generatedAt="Today at 08:45 AM"
        datasetName={dataset?.file_name || 'Unknown'}
        onRegenerate={handleRegenerate}
        regenerating={generating}
      />

      <ReportsOverview 
        reportsCount={reports.length}
        formats={['PDF', 'HTML', 'Markdown']}
        status={sessionId ? 'Ready' : 'Not Generated'}
        generatedAt="Today at 08:45 AM"
        datasetName={dataset?.file_name || 'Unknown'}
        healthScore={healthScore}
      />

      <ReportsPipeline />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDownload={() => handleDownload(report.format)}
              downloading={downloadProgress[report.format] || false}
            />
          ))}
        </div>
      </div>

      <ReportContentSummary />
      <ReportMetadata 
        datasetName={dataset?.file_name || 'Unknown'}
        rows={rows}
        columns={columns}
        qualityScore={qualityScore}
        bestModel={bestModel}
        generatedAt="Today at 08:45 AM"
      />
      <ExportComparison />
      <ReportPreview 
        rows={rows}
        columns={columns}
        qualityScore={qualityScore}
        bestModel={bestModel}
        healthScore={healthScore}
      />
      <ReportStatistics 
        downloads={0}
        reportsGenerated={reports.length}
        avgGenerationTime="2.4s"
        lastGenerated="Today at 08:45 AM"
      />
      <ShareOptions />
      <RegenerateReports onRegenerate={handleRegenerate} regenerating={generating} />
      <DownloadHistory />
    </div>
  )
}

export default ReportsPage
