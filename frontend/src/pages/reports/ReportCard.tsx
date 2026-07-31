import React from 'react'
import { Download, Eye, CheckCircle, Loader2 } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { cn } from '../../utils/cn'

interface Report {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  format: 'pdf' | 'html' | 'md'
  status: 'ready' | 'generating' | 'error'
  size: string
  generatedAt: string
  features: string[]
}

interface ReportCardProps {
  report: Report
  onDownload: () => void
  downloading: boolean
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDownload, downloading }) => {
  const isReady = report.status === 'ready'

  const formatColors = {
    pdf: 'border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20',
    html: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    md: 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30',
  }

  const formatBadges = {
    pdf: { label: 'PDF', variant: 'primary' as const },
    html: { label: 'HTML', variant: 'info' as const },
    md: { label: 'Markdown', variant: 'default' as const },
  }

  const badge = formatBadges[report.format] || { label: 'Unknown', variant: 'default' as const }

  return (
    <div className={cn(
      'rounded-xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
      formatColors[report.format] || formatColors.pdf
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            {report.icon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{report.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
              {isReady && <Badge variant="success" size="sm">Ready</Badge>}
              {report.size && <span className="text-xs text-gray-500 dark:text-gray-400">{report.size}</span>}
            </div>
          </div>
        </div>
        {isReady && <CheckCircle className="h-5 w-5 text-success-500" />}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{report.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {report.features.slice(0, 3).map((feature, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {feature}
          </span>
        ))}
        {report.features.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700">
            +{report.features.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">Generated {report.generatedAt}</span>
        <Button
          variant={isReady ? 'primary' : 'secondary'}
          size="sm"
          icon={downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          onClick={onDownload}
          disabled={!isReady || downloading}
        >
          {downloading ? 'Downloading...' : 'Download'}
        </Button>
      </div>
    </div>
  )
}

export default ReportCard
