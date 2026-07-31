import React from 'react'
import { Download, FileText, Clock, Calendar } from 'lucide-react'

const ReportStatistics: React.FC = () => {
  const stats = [
    { label: 'Total Downloads', value: '0', icon: Download, color: 'text-primary-600 dark:text-primary-400' },
    { label: 'Reports Generated', value: '3', icon: FileText, color: 'text-success-600 dark:text-success-400' },
    { label: 'Avg Generation Time', value: '2.4s', icon: Clock, color: 'text-warning-600 dark:text-warning-400' },
    { label: 'Last Generated', value: 'Today', icon: Calendar, color: 'text-blue-600 dark:text-blue-400' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
            <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportStatistics
