import React from 'react'
import { Award, CheckCircle, Clock, TrendingUp, Shield, Zap } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface BestModelDetailsProps {
  bestModel: any
}

const BestModelDetails: React.FC<BestModelDetailsProps> = ({ bestModel }) => {
  if (!bestModel || !bestModel.name) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Best Model</h3>
        <p className="text-gray-400 dark:text-gray-500">No best model selected</p>
      </div>
    )
  }

  const score = bestModel.score || 0
  const cvScore = bestModel.cv_score || 0
  const trainingTime = bestModel.training_time || 0
  const reason = bestModel.reason || 'Selected based on overall performance'

  const metrics = [
    { label: 'Score', value: `${(score * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-success-500' },
    { label: 'CV Score', value: `${(cvScore * 100).toFixed(1)}%`, icon: Shield, color: 'text-blue-500' },
    { label: 'Training Time', value: `${trainingTime.toFixed(2)}s`, icon: Clock, color: 'text-warning-500' },
    { label: 'Status', value: 'Ready', icon: CheckCircle, color: 'text-success-500' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border-2 border-yellow-400 dark:border-yellow-600">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Best Model</h3>
            <Badge variant="success" size="md">🏆 Selected</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{bestModel.name}</p>
        </div>
        <Badge variant="success" size="lg">Production Ready</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
              <span className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Why selected:</span> {reason}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <CheckCircle className="h-4 w-4 text-success-500" />
          <span>Validation Passed</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Shield className="h-4 w-4 text-success-500" />
          <span>Generalized Well</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Zap className="h-4 w-4 text-success-500" />
          <span>Fast Training</span>
        </div>
      </div>
    </div>
  )
}

export default BestModelDetails
