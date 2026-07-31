import React from 'react'
import { Shield, Brain, BarChart3, Sparkles, Award, Target } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface ExplainabilityOverviewProps {
  shapAvailable: boolean
  featureCount: number
  mostImportantFeature: string
  method: string
  modelName: string
  confidence: string
}

const ExplainabilityOverview: React.FC<ExplainabilityOverviewProps> = ({
  shapAvailable,
  featureCount,
  mostImportantFeature,
  method,
  modelName,
  confidence,
}) => {
  const items = [
    {
      label: 'SHAP Status',
      value: shapAvailable ? 'Available' : 'Unavailable',
      icon: shapAvailable ? <Shield className="h-5 w-5" /> : <Shield className="h-5 w-5" />,
      color: shapAvailable ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400',
      bg: shapAvailable ? 'bg-success-50 dark:bg-success-900/20' : 'bg-warning-50 dark:bg-warning-900/20',
      badge: shapAvailable ? 'success' : 'warning',
    },
    {
      label: 'Features Explained',
      value: featureCount,
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'Explanation Confidence',
      value: confidence,
      icon: <Award className="h-5 w-5" />,
      color: confidence === 'High' ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400',
      bg: confidence === 'High' ? 'bg-success-50 dark:bg-success-900/20' : 'bg-warning-50 dark:bg-warning-900/20',
    },
    {
      label: 'Most Important Feature',
      value: mostImportantFeature,
      icon: <Sparkles className="h-5 w-5" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      label: 'Explanation Method',
      value: method,
      icon: <Brain className="h-5 w-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Model',
      value: modelName,
      icon: <Target className="h-5 w-5" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={`${item.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center gap-2">
            <div className={item.color}>{item.icon}</div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
          </div>
          <div className="mt-1">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExplainabilityOverview
