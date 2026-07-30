import React from 'react'
import { Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface ExplainabilityChartsProps {
  data: any
}

const ExplainabilityCharts: React.FC<ExplainabilityChartsProps> = ({ data }) => {
  const explainability = data?.explainability || {}
  const importance = explainability?.feature_importance || {}
  const shapAvailable = explainability?.shap_available || false
  const ranking = explainability?.feature_ranking || []

  const topFeatures = ranking.slice(0, 5)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Model Explainability</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">Explainability Status</h3>
            <Badge variant={shapAvailable ? 'success' : 'warning'} size="sm">
              {shapAvailable ? 'SHAP Available' : 'Using Model Importance'}
            </Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Features Explained</span>
              <span className="font-medium text-gray-900 dark:text-white">{Object.keys(importance).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Method</span>
              <span className="font-medium text-gray-900 dark:text-white">{shapAvailable ? 'SHAP' : 'Model Importance'}</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Top Features</h3>
          <div className="space-y-3">
            {topFeatures.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-6">#{item.rank}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">{item.feature}</span>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.percentage.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplainabilityCharts
