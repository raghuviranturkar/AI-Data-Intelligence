import React from 'react'
import { Mail, Slack, Users, HardDrive, Link2 } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const shareOptions = [
  { name: 'Email', icon: Mail, color: 'text-blue-500' },
  { name: 'Slack', icon: Slack, color: 'text-purple-500' },
  { name: 'Teams', icon: Users, color: 'text-indigo-500' },
  { name: 'Google Drive', icon: HardDrive, color: 'text-yellow-500' },
]

const ShareOptions: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Report</h3>
        <Badge variant="info" size="sm">Coming Soon</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shareOptions.map((option) => (
          <div
            key={option.name}
            className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center opacity-50 cursor-not-allowed"
          >
            <option.icon className={`h-6 w-6 ${option.color} mx-auto mb-2`} />
            <p className="text-sm text-gray-500 dark:text-gray-400">{option.name}</p>
            <Badge variant="default" size="sm">Coming Soon</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShareOptions
