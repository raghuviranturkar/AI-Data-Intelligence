import React from 'react'
import { Server, Database, FileText, Shield, Brain, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const SystemStatus: React.FC = () => {
  const statuses = [
    { label: 'Backend', icon: Server, status: 'online' },
    { label: 'API', icon: Activity, status: 'connected' },
    { label: 'Reports', icon: FileText, status: 'available' },
    { label: 'AI Insights', icon: Brain, status: 'ready' },
    { label: 'Explainability', icon: Shield, status: 'ready' },
    { label: 'Database', icon: Database, status: 'connected' },
  ]

  const statusColors = {
    online: 'bg-success-500',
    connected: 'bg-success-500',
    available: 'bg-success-500',
    ready: 'bg-success-500',
    offline: 'bg-danger-500',
    error: 'bg-danger-500',
  }

  const statusLabels = {
    online: '🟢 Online',
    connected: '🟢 Connected',
    available: '🟢 Available',
    ready: '🟢 Ready',
    offline: '🔴 Offline',
    error: '🔴 Error',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Server className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
        <Badge variant="success" size="sm">All Systems Go</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statuses.map(({ label, icon: Icon, status }) => (
          <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <span className={`inline-block h-2 w-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-center gap-4">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-success-500" />
          All systems operational
        </span>
      </div>
    </div>
  )
}

export default SystemStatus
