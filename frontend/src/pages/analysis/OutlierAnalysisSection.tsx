import React from 'react'
import { AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface OutlierFeature {
  column: string
  outlier_count: number
  outlier_percentage: number
  severity: string
  risk_score: number
  distribution: string
  recommendation: string
}

interface OutlierAnalysisSectionProps {
  features: OutlierFeature[]
  summary: {
    total_outliers: number
    highest_risk_column: string
    columns_with_outliers: number
    ranking: string[]
  }
  className?: string
}

const OutlierAnalysisSection: React.FC<OutlierAnalysisSectionProps> = ({
  features,
  summary,
  className,
}) => {
  const severityColors = {
    High: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
    Medium: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
    Low: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
    None: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
  }

  const severityBadges = {
    High: { label: 'High Risk', variant: 'danger' as const },
    Medium: { label: 'Moderate', variant: 'warning' as const },
    Low: { label: 'Low', variant: 'success' as const },
    None: { label: 'None', variant: 'default' as const },
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Outlier Analysis</h3>
        <Badge variant="info" size="sm">{features.length} Features</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Outliers</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.total_outliers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Columns Affected</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.columns_with_outliers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Highest Risk</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{summary.highest_risk_column || 'None'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Risk Ranking</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {summary.ranking.slice(0, 3).join(' → ') || 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => {
          const badge = severityBadges[feature.severity as keyof typeof severityBadges] || severityBadges.None
          return (
            <div
              key={feature.column}
              className={cn(
                'rounded-lg border p-4',
                severityColors[feature.severity as keyof typeof severityColors] || severityColors.None
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{feature.column}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.outlier_count} outliers ({feature.outlier_percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Risk Score</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{feature.risk_score}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Distribution: {feature.distribution}</span>
                <span>•</span>
                <span className="text-gray-600 dark:text-gray-300">{feature.recommendation}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OutlierAnalysisSection
