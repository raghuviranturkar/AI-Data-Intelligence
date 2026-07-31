import React from 'react'
import { Download, FileText, Clock, Calendar } from 'lucide-react'

interface ReportStatisticsProps {
  downloads: number
  reportsGenerated: number
  avgGenerationTime: string
  lastGenerated: string
}

const ReportStatistics: React.FC<ReportStatisticsProps> = ({
  downloads,
  reportsGenerated,
  avgGenerationTime,
  lastGenerated,
}) => {
  const items = [
    { label: 'Total Downloads', value: downloads, icon: <Download className="h-5 w-5" />, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Reports Generated', value: reportsGenerated, icon: <FileText className="h-5 w-5" />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Avg Generation Time', value: avgGenerationTime, icon: <Clock className="h-5 w-5" />, color: 'text-success-600 dark:text-success-400', bg: 'bg-success-50 dark:bg-success-900/20' },
    { label: 'Last Generated', value: lastGenerated, icon: <Calendar className="h-5 w-5" />, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/50' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div key={index} className={`${item.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-700`}>
            <div className="flex items-center gap-2">
              <div className={item.color}>{item.icon}</div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportStatistics
