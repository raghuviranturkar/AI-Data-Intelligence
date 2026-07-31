import React from 'react'
import { Shield, Brain, Sparkles, RefreshCw, Eye } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'

interface ExplainabilityHeaderProps {
  shapAvailable: boolean
  featureCount: number
  mostImportantFeature: string
  method: string
  modelName: string
}

const ExplainabilityHeader: React.FC<ExplainabilityHeaderProps> = ({
  shapAvailable,
  featureCount,
  mostImportantFeature,
  method,
  modelName,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 sticky top-16 z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explainability</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Understand how the model makes predictions and which features influence its decisions.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <Badge variant={shapAvailable ? 'success' : 'warning'} size="sm">
                {shapAvailable ? 'SHAP Available' : 'Using Model Importance'}
              </Badge>
              <Badge variant="info" size="sm">
                <Brain className="h-3 w-3 inline mr-1" />
                {modelName}
              </Badge>
              <Badge variant="info" size="sm">
                <Sparkles className="h-3 w-3 inline mr-1" />
                {featureCount} Features Explained
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" icon={<Eye className="h-4 w-4" />} disabled>
            Export Explanation
          </Button>
          <Badge variant="info" size="sm">Model: {modelName}</Badge>
        </div>
      </div>
    </div>
  )
}

export default ExplainabilityHeader
