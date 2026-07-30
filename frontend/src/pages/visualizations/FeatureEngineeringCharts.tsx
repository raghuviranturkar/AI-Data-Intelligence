import React from 'react'
import { CheckCircle, Settings } from 'lucide-react'

interface FeatureEngineeringChartsProps {
  data: any
}

const FeatureEngineeringCharts: React.FC<FeatureEngineeringChartsProps> = ({ data }) => {
  const featureEng = data?.feature_engineering || {}
  const roles = featureEng?.feature_roles || {}
  const mlReadiness = featureEng?.ml_readiness || { score: 0, status: 'Unknown' }

  const featureCount = Object.keys(roles).length
  const ready = mlReadiness.status === 'Ready'

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Feature Engineering</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Features</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{featureCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <CheckCircle className={`h-6 w-6 mb-2 ${ready ? 'text-success-500' : 'text-warning-500'}`} />
          <p className="text-sm text-gray-500 dark:text-gray-400">ML Readiness</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{mlReadiness.score || 0}/100</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{mlReadiness.status || 'Unknown'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Encoding Required</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{featureEng?.encoding_required || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Scaling Required</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{featureEng?.scaling_required || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default FeatureEngineeringCharts
