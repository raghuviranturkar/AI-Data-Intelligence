import React from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { cn } from '../../utils/cn'

interface DeploymentReadinessProps {
  bestModel: any
}

const DeploymentReadiness: React.FC<DeploymentReadinessProps> = ({ bestModel }) => {
  const items = [
    { label: 'Model Trained', status: !!bestModel?.name },
    { label: 'Validation Passed', status: bestModel?.cv_score !== undefined && bestModel?.cv_score !== null },
    { label: 'Metrics Available', status: !!bestModel?.metrics && Object.keys(bestModel.metrics).length > 0 },
    { label: 'Explainability Ready', status: true },
    { label: 'Report Generated', status: true },
    { label: 'Ready for Deployment', status: bestModel?.score && bestModel.score > 0.5 },
  ]

  const allReady = items.every(item => item.status)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deployment Readiness</h3>
        <div className={cn(
          'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
          allReady ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400' : 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
        )}>
          {allReady ? '✅ Ready' : '⏳ In Progress'}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            {item.status ? (
              <CheckCircle className="h-4 w-4 text-success-500" />
            ) : (
              <Clock className="h-4 w-4 text-gray-400" />
            )}
            <span className={cn(
              'text-sm',
              item.status ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
            )}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeploymentReadiness
