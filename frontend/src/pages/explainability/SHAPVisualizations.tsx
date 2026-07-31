import React from 'react'
import { Shield, AlertCircle, BarChart3, TrendingUp, TrendingDown, GitBranch } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface SHAPVisualizationsProps {
  shapAvailable: boolean
}

const SHAPVisualizations: React.FC<SHAPVisualizationsProps> = ({ shapAvailable }) => {
  const visualizations = [
    { name: 'Summary Plot', icon: BarChart3, available: shapAvailable },
    { name: 'Waterfall Plot', icon: TrendingUp, available: shapAvailable },
    { name: 'Force Plot', icon: TrendingDown, available: shapAvailable },
    { name: 'Dependence Plot', icon: GitBranch, available: shapAvailable },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SHAP Visualizations</h3>
          <Badge variant={shapAvailable ? 'success' : 'warning'} size="sm">
            {shapAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </div>

      {shapAvailable ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visualizations.map((viz) => (
            <div
              key={viz.name}
              className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-colors"
            >
              <viz.icon className="h-8 w-8 text-primary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">{viz.name}</p>
              <Badge variant="success" size="sm">Ready</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
          <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">SHAP Package Not Installed</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
            Install SHAP to enable advanced visualizations. Currently using model feature importance.
          </p>
          <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-2">
            Run: pip install shap
          </p>
        </div>
      )}
    </div>
  )
}

export default SHAPVisualizations
