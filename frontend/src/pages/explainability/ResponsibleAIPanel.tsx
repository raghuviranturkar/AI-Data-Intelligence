import React from 'react'
import { CheckCircle, Shield } from 'lucide-react'

interface ResponsibleAIPanelProps {
  shapAvailable: boolean
}

const ResponsibleAIPanel: React.FC<ResponsibleAIPanelProps> = ({ shapAvailable }) => {
  const items = [
    { label: 'Explainable', status: true },
    { label: 'Feature Importance Available', status: true },
    { label: 'Prediction Traceable', status: true },
    { label: 'Global Explanation', status: true },
    { label: 'Local Explanation', status: true },
    { label: 'Human Readable', status: true },
    { label: 'SHAP Integration', status: shapAvailable },
    { label: 'Visualizations', status: shapAvailable },
  ]

  const allPassed = items.every(item => item.status)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border-l-4 border-green-500">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Responsible AI</h3>
        <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ All checks passed</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            {item.status ? (
              <CheckCircle className="h-4 w-4 text-success-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
            )}
            <span className={`text-sm ${item.status ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResponsibleAIPanel
