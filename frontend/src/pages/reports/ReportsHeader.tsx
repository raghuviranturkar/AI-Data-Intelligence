import React from 'react'
import { FileText, RefreshCw, History, Download } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'

interface ReportsHeaderProps {
  reportsCount: number
  generatedAt: string
  datasetName: string
  onRegenerate: () => void
  regenerating: boolean
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  reportsCount,
  generatedAt,
  datasetName,
  onRegenerate,
  regenerating,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 sticky top-16 z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports Center</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Download and manage AI-generated analysis reports.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <Badge variant="info" size="sm">{reportsCount} Reports</Badge>
              <Badge variant="info" size="sm">Dataset: {datasetName}</Badge>
              <Badge variant="info" size="sm">Generated: {generatedAt}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Download className="h-4 w-4" />}
            onClick={onRegenerate}
            disabled={regenerating}
          >
            {regenerating ? 'Generating...' : 'Generate Reports'}
          </Button>
          <Button variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" icon={<History className="h-4 w-4" />} disabled>
            History
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReportsHeader
