import React from 'react'
import { Briefcase, Tag, Code, GitBranch, Calendar } from 'lucide-react'

const WorkspaceInfo: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Workspace Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Project Name</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">AI Data Intelligence</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Application Version</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">v1.0.0</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Backend Version</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">FastAPI 0.104.1</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Frontend Version</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">React 18 + TypeScript</p>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceInfo
