import React from 'react'
import { CheckCircle } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const items = [
  'Dataset Overview',
  'Validation Report',
  'Missing Values',
  'Outlier Detection',
  'EDA',
  'Visualizations',
  'Feature Engineering',
  'AutoML',
  'Model Comparison',
  'Explainability',
  'AI Insights',
  'Recommendations',
]

const ReportContentSummary: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Content</h3>
        <Badge variant="info" size="sm">{items.length} Sections</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportContentSummary
