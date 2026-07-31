import React from 'react'
import { TrendingUp, Minus, TrendingDown } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface FeatureCategoriesProps {
  featureRanking: any[]
}

const FeatureCategories: React.FC<FeatureCategoriesProps> = ({ featureRanking }) => {
  if (featureRanking.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Categories</h3>
        <p className="text-gray-400 dark:text-gray-500">No data available</p>
      </div>
    )
  }

  const highImpact = featureRanking.filter(item => item.percentage * 100 > 15)
  const mediumImpact = featureRanking.filter(item => item.percentage * 100 > 5 && item.percentage * 100 <= 15)
  const lowImpact = featureRanking.filter(item => item.percentage * 100 <= 5)

  const renderCategory = (items: any[], label: string, icon: React.ReactNode, color: string) => {
    if (items.length === 0) return null
    return (
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="font-medium text-gray-900 dark:text-white">{label}</span>
          <Badge variant="info" size="sm">{items.length}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item.feature} className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
              {item.feature}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderCategory(
          highImpact,
          'High Impact',
          <TrendingUp className="h-4 w-4 text-success-500" />,
          'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
        )}
        {renderCategory(
          mediumImpact,
          'Medium Impact',
          <Minus className="h-4 w-4 text-warning-500" />,
          'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
        )}
        {renderCategory(
          lowImpact,
          'Low Impact',
          <TrendingDown className="h-4 w-4 text-gray-400" />,
          'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400'
        )}
      </div>
    </div>
  )
}

export default FeatureCategories
