import React from 'react'
import { RefreshCw, FileText, CheckCircle } from 'lucide-react'
import { Button } from '../../components/common/Button'

interface RegenerateReportsProps {
  onRegenerate: () => void
  generating: boolean
}

const RegenerateReports: React.FC<RegenerateReportsProps> = ({
  onRegenerate,
  generating,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Regenerate Reports</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate fresh reports with the latest analysis results.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={generating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
          onClick={onRegenerate}
          disabled={generating}
          className="min-w-[200px]"
        >
          {generating ? 'Generating...' : 'Generate New Reports'}
        </Button>
      </div>

      {generating && (
        <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Generating PDF...</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Generating HTML...</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Generating Markdown...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegenerateReports
