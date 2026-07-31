import React from 'react'
import { Download, CheckCircle, AlertCircle, Loader2, Eye } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { cn } from '../../utils/cn'

interface ReportCardProps {
  report: {
    id: string
    format: 'PDF' | 'HTML' | 'Markdown'
    icon: React.ReactNode
    title: string
    description: string
    size: string
    status: 'ready' | 'generating' | 'error'
    features: string[]
  }
  onDownload: () => void
  isDownloading: boolean
  isSuccess: boolean
  isError: boolean
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onDownload,
  isDownloading,
  isSuccess,
  isError,
}) => {
  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF': return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
      case 'HTML': return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
      case 'Markdown': return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20'
      default: return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'
    }
  }

  const getFormatIconColor = (format: string) => {
    switch (format) {
      case 'PDF': return 'text-red-500'
      case 'HTML': return 'text-blue-500'
      case 'Markdown': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border-2 transition-all duration-200 hover:shadow-lg',
      isSuccess ? 'border-success-500' : isError ? 'border-danger-500' : 'border-transparent'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-lg', getFormatColor(report.format), getFormatIconColor(report.format))}>
            {report.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant={report.status === 'ready' ? 'success' : 'warning'} size="sm">
                {report.status === 'ready' ? 'Ready' : 'Generating...'}
              </Badge>
              <span className="text-xs text-gray-400 dark:text-gray-500">{report.size}</span>
            </div>
          </div>
        </div>
        {report.status === 'ready' && (
          <Badge variant="success" size="sm">✓ Ready</Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {report.features.slice(0, 3).map((feature, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
            {feature}
          </span>
        ))}
        {report.features.length > 3 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">+{report.features.length - 3} more</span>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          variant="primary"
          size="sm"
          icon={isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          onClick={onDownload}
          disabled={isDownloading || report.status !== 'ready'}
          className="flex-1"
        >
          {isDownloading ? 'Downloading...' : isSuccess ? '✓ Downloaded' : isError ? 'Retry' : 'Download'}
        </Button>
        <Button variant="secondary" size="sm" icon={<Eye className="h-4 w-4" />} disabled>
          Preview
        </Button>
      </div>

      {isError && (
        <div className="mt-3 text-sm text-danger-600 dark:text-danger-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Download failed. Please try again.
        </div>
      )}
    </div>
  )
}

export default ReportCard
