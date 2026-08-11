import React from 'react'
import { Shield, CheckCircle, AlertCircle, Eye } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface ExplainabilityInsightsProps {
  shapAvailable: boolean
  explainabilityInsights: string[]
  onNavigate: () => void
}

const ExplainabilityInsights: React.FC<ExplainabilityInsightsProps> = ({
  shapAvailable,
  explainabilityInsights,
  onNavigate
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Explainability Insights</h3>
          <Badge variant={shapAvailable ? 'success' : 'warning'} size="sm">
            {shapAvailable ? 'SHAP Available' : 'Model Importance'}
          </Badge>
        </div>
        <button 
          onClick={onNavigate}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
        >
          View Explainability
          <Eye className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          {shapAvailable ? (
            <>
              <CheckCircle className="h-4 w-4 text-success-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">SHAP explainability is available</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-warning-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Using model feature importance (SHAP not installed)</span>
            </>
          )}
        </div>

        {explainabilityInsights && explainabilityInsights.length > 0 && (
          <div className="space-y-2">
            {explainabilityInsights.slice(0, 3).map((insight, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{insight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExplainabilityInsights
