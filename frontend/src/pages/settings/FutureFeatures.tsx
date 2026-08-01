import React from 'react'
import { Rocket, Users, Cloud, Calendar, Key, Share2, Clock } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const FutureFeatures: React.FC = () => {
  const features = [
    { name: 'Team Collaboration', icon: Users, color: 'text-blue-500' },
    { name: 'User Accounts', icon: Rocket, color: 'text-purple-500' },
    { name: 'Cloud Storage', icon: Cloud, color: 'text-cyan-500' },
    { name: 'Scheduled Analysis', icon: Calendar, color: 'text-green-500' },
    { name: 'API Keys', icon: Key, color: 'text-yellow-500' },
    { name: 'Workspace Sharing', icon: Share2, color: 'text-pink-500' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Future Features</h3>
        <Badge variant="info" size="sm">Coming Soon</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {features.map(({ name, icon: Icon, color }) => (
          <div
            key={name}
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 opacity-60"
          >
            <Icon className={`h-6 w-6 ${color} mb-2`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{name}</span>
            <Badge variant="default" size="sm" className="mt-1">Soon</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FutureFeatures
