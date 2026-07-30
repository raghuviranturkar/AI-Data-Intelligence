import React from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface OutlierChartsProps {
  data: any
}

const OutlierCharts: React.FC<OutlierChartsProps> = ({ data }) => {
  const outliers = data?.outliers || {}
  const analysis = outliers?.analysis || {}
  const features = Object.entries(analysis)

  if (features.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Outlier Analysis</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
          <p className="text-gray-400 dark:text-gray-500">No outliers detected</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All numeric columns are within expected ranges</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Outlier Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.slice(0, 8).map(([column, info]: [string, any]) => {
          const outlierData = info?.outlier_analysis || {}
          const count = outlierData.outlier_count || 0
          const percentage = outlierData.outlier_percentage || 0
          const severity = info?.severity || 'None'
          const riskScore = info?.risk_score || 0

          const severityColors = {
            High: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
            Medium: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
            Low: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
            None: 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700',
          }

          const severityBadges = {
            High: { label: 'High Risk', variant: 'danger' as const },
            Medium: { label: 'Moderate', variant: 'warning' as const },
            Low: { label: 'Low', variant: 'success' as const },
            None: { label: 'None', variant: 'default' as const },
          }

          const badge = severityBadges[severity as keyof typeof severityBadges] || severityBadges.None
          const barColor = count > 20 ? 'bg-danger-500' : count > 10 ? 'bg-warning-500' : 'bg-success-500'

          return (
            <div key={column} className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border ${severityColors[severity as keyof typeof severityColors] || severityColors.None}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{column}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{count} outliers ({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Risk Score</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{riskScore}</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${Math.min(percentage * 2, 100)}%` }} />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{info?.recommendation?.action || 'Review recommended'}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OutlierCharts
