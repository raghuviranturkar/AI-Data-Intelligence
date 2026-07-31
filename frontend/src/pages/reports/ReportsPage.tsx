import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import { 
  Loader2, AlertTriangle, FileText, Download, RefreshCw, 
  Clock, Award, Database, CheckCircle, Eye, History,
  File, FileCode, FileJson, Share2, Mail, Slack, 
  Calendar, HardDrive, BarChart3, Settings, Zap
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import Card from '../../components/common/Card'

// Import sub-components
import ReportsHeader from './ReportsHeader'
import ReportsOverview from './ReportsOverview'
import ReportsPipeline from './ReportsPipeline'
import ReportCard from './ReportCard'
import ReportContentSummary from './ReportContentSummary'
import ReportMetadata from './ReportMetadata'
import ExportComparison from './ExportComparison'
import DownloadHistory from './DownloadHistory'
import ReportStatistics from './ReportStatistics'
import ShareOptions from './ShareOptions'
import RegenerateReports from './RegenerateReports'

const ReportsPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const [generating, setGenerating] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<Record<string, 'idle' | 'downloading' | 'success' | 'error'>>({
    pdf: 'idle',
    html: 'idle',
    markdown: 'idle',
  })

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
          Upload a dataset and complete the analysis to generate reports.
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
  const qualityScore = validation?.quality?.quality_score || 0
  const healthScore = insights?.ai_health_score?.score || 0
  const bestModel = automl?.best_model?.name || 'N/A'
  const rows = dataset?.shape?.rows || 0
  const columns = dataset?.shape?.columns || 0

  const reports = [
    {
      id: 'pdf',
      format: 'PDF' as const,
      icon: <FileText className="h-8 w-8" />,
      title: 'PDF Report',
      description: 'Complete business report with all analysis results, charts, and insights.',
      size: '2.4 MB',
      status: 'ready' as const,
      features: ['Executive Summary', 'Dataset Overview', 'Visualizations', 'Model Performance', 'AI Insights'],
    },
    {
      id: 'html',
      format: 'HTML' as const,
      icon: <FileCode className="h-8 w-8" />,
      title: 'HTML Report',
      description: 'Interactive web-based report with charts, tables, and navigation.',
      size: '3.1 MB',
      status: 'ready' as const,
      features: ['Interactive', 'Browser Friendly', 'Charts', 'Tables', 'Navigation'],
    },
    {
      id: 'markdown',
      format: 'Markdown' as const,
      icon: <FileJson className="h-8 w-8" />,
      title: 'Markdown Report',
      description: 'Developer-friendly report in markdown format for documentation and version control.',
      size: '1.2 MB',
      status: 'ready' as const,
      features: ['GitHub Compatible', 'Lightweight', 'Documentation Format', 'Version Control Friendly'],
    },
  ]

  const handleDownload = async (format: 'pdf' | 'html' | 'markdown') => {
    setDownloadStatus(prev => ({ ...prev, [format]: 'downloading' }))
    
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1500))
      setDownloadStatus(prev => ({ ...prev, [format]: 'success' }))
      
      // Reset after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [format]: 'idle' }))
      }, 3000)
    } catch (err) {
      setDownloadStatus(prev => ({ ...prev, [format]: 'error' }))
    }
  }

  const handleRegenerate = async () => {
    setGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGenerating(false)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <ReportsHeader 
        reportCount={3}
        generatedAt={new Date().toLocaleString()}
        onRefresh={() => {}}
        onRegenerate={handleRegenerate}
        generating={generating}
      />

      {/* Overview Cards */}
      <ReportsOverview 
        reportCount={3}
        formats={['PDF', 'HTML', 'Markdown']}
        status="Ready"
        generatedAt={new Date().toLocaleString()}
        datasetName={dataset?.file_name || 'Unknown'}
        healthScore={healthScore}
      />

      {/* Pipeline */}
      <ReportsPipeline />

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onDownload={() => handleDownload(report.id as 'pdf' | 'html' | 'markdown')}
            isDownloading={downloadStatus[report.id as keyof typeof downloadStatus] === 'downloading'}
            isSuccess={downloadStatus[report.id as keyof typeof downloadStatus] === 'success'}
            isError={downloadStatus[report.id as keyof typeof downloadStatus] === 'error'}
          />
        ))}
      </div>

      {/* Content Summary */}
      <ReportContentSummary />

      {/* Report Metadata */}
      <ReportMetadata 
        datasetName={dataset?.file_name || 'Unknown'}
        rows={rows}
        columns={columns}
        qualityScore={qualityScore}
        bestModel={bestModel}
        generatedAt={new Date().toLocaleString()}
      />

      {/* Export Comparison */}
      <ExportComparison />

      {/* Report Statistics */}
      <ReportStatistics />

      {/* Share Options */}
      <ShareOptions />

      {/* Download History */}
      <DownloadHistory />

      {/* Regenerate */}
      <RegenerateReports 
        onRegenerate={handleRegenerate}
        generating={generating}
      />
    </div>
  )
}

export default ReportsPage
