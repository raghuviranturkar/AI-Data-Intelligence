import React from 'react'
import { Settings, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface FeatureEngineeringSectionProps {
  featureRoles: Record<string, string>
  encoding: Record<string, any>
  scaling: Record<string, any>
  transformations: Record<string, any>
  interactions: any[]
  lowVariance: any[]
  mlReadiness: {
    score: number
    status: string
    recommendation: string
    issues: string[]
  }
  className?: string
}

const FeatureEngineeringSection: React.FC<FeatureEngineeringSectionProps> = ({
  featureRoles,
  encoding,
  scaling,
  transformations,
  interactions,
  lowVariance,
  mlReadiness,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Engineering</h3>
        <Badge variant="info" size="sm">ML Ready</Badge>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ML Readiness Score</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{mlReadiness.score}/100</p>
          </div>
          <Badge variant={mlReadiness.status === 'Ready' ? 'success' : 'warning'} size="md">
            {mlReadiness.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{mlReadiness.recommendation}</p>
        {mlReadiness.issues.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Issues to Address</p>
            <ul className="mt-1 space-y-1">
              {mlReadiness.issues.map((issue, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-300">• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="font-medium text-gray-900 dark:text-white mb-2">Feature Roles</p>
          <div className="space-y-1">
            {Object.entries(featureRoles).slice(0, 10).map(([col, role]) => (
              <div key={col} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{col}</span>
                <Badge variant="default" size="sm">{role}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="font-medium text-gray-900 dark:text-white mb-2">Encoding Recommendations</p>
            <div className="space-y-1">
              {Object.entries(encoding).slice(0, 5).map(([col, rec]) => (
                <div key={col} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{col}</span>
                  <Badge variant="info" size="sm">{rec.recommended_encoding || 'None'}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="font-medium text-gray-900 dark:text-white mb-2">Scaling Recommendations</p>
            <div className="space-y-1">
              {Object.entries(scaling).slice(0, 5).map(([col, rec]) => (
                <div key={col} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{col}</span>
                  <Badge variant="info" size="sm">{rec.recommended_scaling || 'None'}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {interactions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="font-medium text-gray-900 dark:text-white mb-2">Interaction Suggestions</p>
          <div className="space-y-1">
            {interactions.slice(0, 5).map((interaction, i) => (
              <div key={i} className="text-sm text-gray-600 dark:text-gray-300">
                {interaction.feature1} × {interaction.feature2}
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                  (r={interaction.correlation?.toFixed(2) || 'N/A'})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowVariance.length > 0 && (
        <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800 p-4">
          <p className="font-medium text-warning-700 dark:text-warning-400 mb-2">Low Variance Features</p>
          <div className="space-y-1">
            {lowVariance.slice(0, 5).map((item, i) => (
              <div key={i} className="text-sm text-gray-600 dark:text-gray-300">
                {item.column} - {item.reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeatureEngineeringSection
