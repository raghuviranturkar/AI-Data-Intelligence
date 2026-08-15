import React, { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { 
  Loader2, AlertTriangle, FileText, RefreshCw, Globe, Download, History, Layers, FileSpreadsheet
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
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
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const colors = {
    border: isDark ? '#232B35' : '#E2E8F0',
    text: isDark ? '#EDF1F5' : '#0F172A',
    accent: {
      teal: '#3ECF8E',
      coral: '#F2555A',
    }
  }

  const bgColor = type === 'success' 
    ? isDark ? 'rgba(62,207,142,0.08)' : '#F0FDF4'
    : isDark ? 'rgba(242,85,90,0.08)' : '#FEF2F2'
  
  const borderColor = type === 'success'
    ? isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0'
    : isDark ? 'rgba(242,85,90,0.2)' : '#FECACA'
  
  const textColor = type === 'success'
    ? colors.accent.teal
    : colors.accent.coral

  return (
    <div 
      className="rounded-lg border p-4 mb-4 flex items-center justify-between"
      style={{ 
        backgroundColor: bgColor,
        borderColor: borderColor
      }}
    >
      <span style={{ color: textColor }}>{message}</span>
      <button 
        onClick={onClose} 
        className="opacity-60 hover:opacity-100 transition-opacity"
        style={{ color: textColor }}
      >
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
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const colors = {
    bg: isDark ? '#0B0F14' : '#F1F4F8',
    panel: isDark ? '#12181F' : '#FFFFFF',
    border: isDark ? '#232B35' : '#E2E8F0',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      coral: '#F2555A',
    }
  }

  const gridBgStyle = isDark 
    ? {
        backgroundImage: 'linear-gradient(to right, rgba(237,241,245,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,241,245,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }
    : {
        backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }

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
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-transparent animate-spin" 
              style={{ borderTopColor: colors.accent.amber }} 
            />
          </div>
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="h-12 w-12" style={{ color: colors.accent.coral }} />
          <p className="text-base font-medium" style={{ color: colors.text }}>Failed to load data</p>
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>{error}</p>
          <Button className="mt-2" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div 
          className="p-4 rounded-md border mb-4"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <FileText className="h-16 w-16" style={{ color: colors.textMuted }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>No Reports Available</h2>
        <p className="text-sm font-mono mt-2 max-w-md" style={{ color: colors.textMuted }}>
          Upload a dataset to generate professional AI analysis reports.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          <FileText className="h-4 w-4 mr-2" />
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
    <div 
      className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 gap-4 py-4">
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
          <div className="flex items-center gap-3">
            <div 
              className="p-1.5 rounded-md border"
              style={{ 
                backgroundColor: isDark ? '#0B0F14' : '#F8FAFC',
                borderColor: colors.border
              }}
            >
              <FileSpreadsheet className="h-4 w-4" style={{ color: colors.accent.amber }} />
            </div>
            <h3 className="text-base font-semibold" style={{ color: colors.text }}>Available Reports</h3>
            <Badge variant="info" size="sm">{reports.length} Reports</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2 mt-2">
          <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
            © 2026 AI Data Intelligence Platform
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              Version 2.0
            </span>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono" style={{ color: colors.accent.teal }}>
                All systems operational
              </span>
            </div>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              <span style={{ color: colors.accent.amber }}>●</span> Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
