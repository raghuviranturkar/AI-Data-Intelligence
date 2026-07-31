import React, { useState } from 'react'
import { RefreshCw, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'

interface RegenerateReportsProps {
  onRegenerate: () => Promise<void>
  regenerating: boolean
}

const RegenerateReports: React.FC<RegenerateReportsProps> = ({
  onRegenerate,
  regenerating,
}) => {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'running' | 'complete'>('idle')

  const handleRegenerate = async () => {
    setStatus('running')
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    try {
      await onRegenerate()
      setStatus('complete')
    } catch (err) {
      setStatus('idle')
    } finally {
      clearInterval(interval)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Regenerate Reports</h3>

      {status === 'idle' && (
        <Button
          variant="primary"
          size="lg"
          icon={<RefreshCw className="h-5 w-5" />}
          onClick={handleRegenerate}
          disabled={regenerating}
          className="w-full md:w-auto"
        >
          Generate New Reports
        </Button>
      )}

      {status === 'running' && (
        <div className="space-y-3">
          <ProgressBar value={progress} label="Generating reports..." />
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating PDF...</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-gray-300 dark:text-gray-600">Generating HTML...</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-gray-300 dark:text-gray-600">Generating Markdown...</span>
          </div>
        </div>
      )}

      {status === 'complete' && (
        <div className="flex items-center gap-3 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
          <CheckCircle className="h-6 w-6 text-success-500" />
          <div>
            <p className="font-medium text-success-700 dark:text-success-400">Reports Generated Successfully!</p>
            <p className="text-sm text-success-600 dark:text-success-300">All reports are ready for download.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegenerateReports
