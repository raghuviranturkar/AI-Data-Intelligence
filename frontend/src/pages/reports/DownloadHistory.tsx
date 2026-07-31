import React from 'react'
import { History, Download, Clock } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const DownloadHistory: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Download History</h3>
        <Badge variant="info" size="sm">Empty</Badge>
      </div>

      <div className="text-center py-8">
        <Download className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 dark:text-gray-500">No previous downloads</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Reports you download will appear here</p>
      </div>
    </div>
  )
}

export default DownloadHistory
