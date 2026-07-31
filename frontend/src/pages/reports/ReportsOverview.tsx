import React from 'react'
import { FileText, Award, CheckCircle, Clock, Database, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface ReportsOverviewProps {
  reportCount: number
  formats: string[]
  status: string
  generatedAt: string
  datasetName: string
  healthScore: number
}

const ReportsOverview: React.FC<ReportsOverviewProps> = ({
  reportCount,
  formats,
  status,
  generatedAt,
  datasetName,
  healthScore,
}) => {
  const items = [
    {
      label: 'Reports Generated',
      value: reportCount,
      icon: <FileText className="h-5 w-5" />,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      subtitle: `${formats.join(', ')} formats`,
    },
    {
      label: 'Report Status',
      value: status,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-success-600 dark:text-success-400',
      bg: 'bg-success-50 dark:bg-success-900/20',
      badge: 'success',
    },
    {
      label: 'Generated At',
      value: generatedAt,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Dataset',
      value: datasetName,
      icon: <Database className="h-5 w-5" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'AI Health Score',
      value: `${healthScore}%`,
      icon: <Activity className="h-5 w-5" />,
      color: healthScore >= 70 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400',
      bg: healthScore >= 70 ? 'bg-success-50 dark:bg-success-900/20' : 'bg-warning-50 dark:bg-warning-900/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            {item.subtitle && (
              <span className="block text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReportsOverview
