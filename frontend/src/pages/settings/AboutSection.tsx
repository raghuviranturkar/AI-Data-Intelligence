import React from 'react'
import { Info, GitBranch, Code, Brain, Database, Shield } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const AboutSection: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
        <Badge variant="info" size="sm">v1.0.0</Badge>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-bold">AI Data Intelligence</span> is a comprehensive data intelligence platform
          that automates the entire data science lifecycle from upload to insights.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <Brain className="h-4 w-4 text-primary-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">AutoML</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <Shield className="h-4 w-4 text-success-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Explainability</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <Database className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Data Intelligence</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <Code className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">FastAPI + React</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <GitBranch className="h-4 w-4 inline mr-1" />
            GitHub
          </a>
          <span className="text-sm text-gray-500 dark:text-gray-400">MIT License</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">© 2026</span>
        </div>
      </div>
    </div>
  )
}

export default AboutSection
