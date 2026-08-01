import React from 'react'
import { HardDrive, FileText, Database, Clock } from 'lucide-react'

const StorageInfo: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <HardDrive className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Storage</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
          <FileText className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Reports Generated</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
          <Database className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Datasets Processed</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
          <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">N/A</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Last Analysis</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
          <HardDrive className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0 KB</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Storage Used</p>
        </div>
      </div>
    </div>
  )
}

export default StorageInfo
