import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import { Loader2, AlertTriangle, Filter, Download, RefreshCw, Maximize2, Clock, BarChart3 } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import SkeletonChart from '../../components/common/SkeletonChart'

// Import all chart sections
import OverviewCharts from './OverviewCharts'
import CorrelationCharts from './CorrelationCharts'
import DistributionCharts from './DistributionCharts'
import OutlierCharts from './OutlierCharts'
import CategoryCharts from './CategoryCharts'
import TargetCharts from './TargetCharts'
import FeatureImportanceCharts from './FeatureImportanceCharts'
import ModelComparisonCharts from './ModelComparisonCharts'
import ModelPerformanceCharts from './ModelPerformanceCharts'
import FeatureEngineeringCharts from './FeatureEngineeringCharts'
import ExplainabilityCharts from './ExplainabilityCharts'
import InsightsCharts from './InsightsCharts'

const VisualizationsPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const [activeFilter, setActiveFilter] = useState<string>('all')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonChart height={250} />
          <SkeletonChart height={250} />
          <SkeletonChart height={250} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-danger-500" />
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Failed to load data</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Data Available</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Upload a dataset to generate visualizations and explore your data visually.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  const dataset = data?.dataset || {}
  const rows = dataset?.shape?.rows || 0
  const columns = dataset?.shape?.columns || 0

  // Count charts - this is a rough estimate
  const chartCount = 12

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'overview', label: 'Overview' },
    { id: 'correlations', label: 'Correlations' },
    { id: 'distributions', label: 'Distributions' },
    { id: 'outliers', label: 'Outliers' },
    { id: 'categories', label: 'Categories' },
    { id: 'target', label: 'Target' },
    { id: 'models', label: 'Models' },
    { id: 'explainability', label: 'Explainability' },
    { id: 'insights', label: 'Insights' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visual Analytics</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dataset: <span className="font-medium">{dataset?.file_name || 'Unknown'}</span>
              </p>
              <Badge variant="info" size="sm">{rows.toLocaleString()} rows</Badge>
              <Badge variant="info" size="sm">{columns} columns</Badge>
              <Badge variant="info" size="sm">
                <BarChart3 className="h-3 w-3 inline mr-1" />
                {chartCount} Charts
              </Badge>
              <Badge variant="info" size="sm">
                <Clock className="h-3 w-3 inline mr-1" />
                {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
              Refresh
            </Button>
            <Button variant="secondary" size="sm" icon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button variant="ghost" size="sm" icon={<Maximize2 className="h-4 w-4" />} />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All Sections */}
      <div className="space-y-8">
        {/* Section 1 & 2: Overview Charts */}
        {(activeFilter === 'all' || activeFilter === 'overview') && (
          <OverviewCharts data={data} />
        )}

        {/* Section 3: Correlation Charts */}
        {(activeFilter === 'all' || activeFilter === 'correlations') && (
          <CorrelationCharts data={data} />
        )}

        {/* Section 4: Distribution Charts */}
        {(activeFilter === 'all' || activeFilter === 'distributions') && (
          <DistributionCharts data={data} />
        )}

        {/* Section 5: Outlier Charts */}
        {(activeFilter === 'all' || activeFilter === 'outliers') && (
          <OutlierCharts data={data} />
        )}

        {/* Section 6: Category Charts */}
        {(activeFilter === 'all' || activeFilter === 'categories') && (
          <CategoryCharts data={data} />
        )}

        {/* Section 7: Target Charts */}
        {(activeFilter === 'all' || activeFilter === 'target') && (
          <TargetCharts data={data} />
        )}

        {/* Section 8: Feature Importance */}
        {(activeFilter === 'all' || activeFilter === 'explainability') && (
          <FeatureImportanceCharts data={data} />
        )}

        {/* Section 9 & 10: Model Comparison */}
        {(activeFilter === 'all' || activeFilter === 'models') && (
          <>
            <ModelComparisonCharts data={data} />
            <ModelPerformanceCharts data={data} />
          </>
        )}

        {/* Section 11: Feature Engineering */}
        {(activeFilter === 'all' || activeFilter === 'overview') && (
          <FeatureEngineeringCharts data={data} />
        )}

        {/* Section 12: Explainability */}
        {(activeFilter === 'all' || activeFilter === 'explainability') && (
          <ExplainabilityCharts data={data} />
        )}

        {/* Section 13: AI Insights */}
        {(activeFilter === 'all' || activeFilter === 'insights') && (
          <InsightsCharts data={data} />
        )}
      </div>
    </div>
  )
}

export default VisualizationsPage
