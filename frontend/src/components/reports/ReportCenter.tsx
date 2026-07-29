import React from 'react'
import { FileText, Download, Globe, FileCode, Clock, CheckCircle } from 'lucide-react'
import Card from '../common/Card'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { cn } from '../../utils/cn'

interface Report {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  format: 'pdf' | 'html' | 'markdown'
  size?: string
  generatedAt?: string
  status: 'ready' | 'generating' | 'error'
}

interface ReportCenterProps {
  reports?: Report[]
  onDownload?: (format: string) => void
  className?: string
}

const defaultReports: Report[] = [
  {
    id: 'pdf',
    title: 'PDF Report',
    description: 'Complete business report with all analysis results',
    icon: <FileText className="h-6 w-6" />,
    format: 'pdf',
    status: 'ready',
  },
  {
    id: 'html',
    title: 'HTML Report',
    description: 'Interactive web-based report with charts',
    icon: <Globe className="h-6 w-6" />,
    format: 'html',
    status: 'ready',
  },
  {
    id: 'markdown',
    title: 'Markdown Report',
    description: 'Developer-friendly report in markdown format',
    icon: <FileCode className="h-6 w-6" />,
    format: 'markdown',
    status: 'ready',
  },
]

const ReportCenter: React.FC<ReportCenterProps> = ({
  reports = defaultReports,
  onDownload,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Center</h3>
        <Badge variant="info" size="sm">{reports.length} Reports</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="flex flex-col items-start gap-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                  {report.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>
              </div>
              {report.status === 'ready' && (
                <Badge variant="success" size="sm">Ready</Badge>
              )}
              {report.status === 'generating' && (
                <Badge variant="warning" size="sm">Generating...</Badge>
              )}
              {report.status === 'error' && (
                <Badge variant="danger" size="sm">Error</Badge>
              )}
            </div>

            <div className="flex items-center justify-between w-full mt-2">
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {report.size && `${report.size} • `}
                {report.generatedAt && `Generated ${report.generatedAt}`}
              </div>
              <Button
                variant={report.status === 'ready' ? 'primary' : 'secondary'}
                size="sm"
                icon={<Download className="h-4 w-4" />}
                onClick={() => onDownload?.(report.format)}
                disabled={report.status !== 'ready'}
              >
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ReportCenter
