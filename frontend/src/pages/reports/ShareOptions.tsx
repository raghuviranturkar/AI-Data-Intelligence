import React from 'react'
import { Share2, Mail, Send, Users, Cloud } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const ShareOptions: React.FC = () => {
  const options = [
    { name: 'Email', icon: Mail, color: 'text-blue-500' },
    { name: 'Slack', icon: Send, color: 'text-purple-500' },
    { name: 'Teams', icon: Users, color: 'text-indigo-500' },
    { name: 'Google Drive', icon: Cloud, color: 'text-green-500' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Report</h3>
        <Badge variant="info" size="sm">Coming Soon</Badge>
      </div>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <div
            key={option.name}
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed"
          >
            <option.icon className={`h-5 w-5 ${option.color}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option.name}</span>
            <Badge variant="default" size="sm">Soon</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShareOptions
