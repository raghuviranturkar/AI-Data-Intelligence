import React, { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { 
  AlertTriangle, Filter, Download, RefreshCw, Maximize2, Clock, BarChart3, 
  LayoutGrid, Sparkles, Layers, Grid, Eye
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

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
import ConfusionMatrix from './ConfusionMatrix'
import BoxplotChart from './BoxplotChart'

const VisualizationsPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const colors = {
    bg: isDark ? '#0B0F14' : '#F1F4F8',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    border: isDark ? '#232B35' : '#E2E8F0',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      coral: '#F2555A',
      azure: '#4EA1F0',
      purple: '#B48CF2',
    }
  }

  const gridBgStyle = isDark 
    ? {
        backgroundImage: 'linear-gradient(to right, rgba(237,241,245,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,241,245,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }
    : {
        backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-transparent animate-spin" 
              style={{ borderTopColor: colors.accent.amber }} 
            />
          </div>
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>Loading visualizations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="h-12 w-12" style={{ color: colors.accent.coral }} />
          <p className="text-base font-medium" style={{ color: colors.text }}>Failed to load data</p>
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>{error}</p>
          <Button className="mt-2" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div 
          className="p-4 rounded-md border mb-4"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <BarChart3 className="h-16 w-16" style={{ color: colors.textMuted }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>No Data Available</h2>
        <p className="text-sm font-mono mt-2 max-w-md" style={{ color: colors.textMuted }}>
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
  const chartCount = 14

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

  // Get confusion matrix from best model if available
  const bestModel = data?.automl?.best_model || {}
  const confusionMatrix = bestModel?.metrics?.confusion_matrix
  const problemType = data?.automl?.problem_type || ''

  return (
    <div 
      className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 gap-4 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-6 transition-colors duration-300"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <LayoutGrid className="h-6 w-6" style={{ color: colors.accent.amber }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>
                  Visual Analytics
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-xs font-mono" style={{ color: colors.textMuted }}>
                    Dataset: <span className="font-medium" style={{ color: colors.text }}>{dataset?.file_name || 'Unknown'}</span>
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
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="font-medium">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="secondary" size="sm" className="font-medium">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm" className="font-medium">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-2 mb-2.5">
              <Filter className="h-4 w-4" style={{ color: colors.textMuted }} />
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>
                Filter:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-mono rounded-md border transition-all duration-200',
                    activeFilter === filter.id
                      ? 'text-white border-transparent'
                      : 'hover:opacity-80'
                  )}
                  style={{
                    backgroundColor: activeFilter === filter.id ? colors.accent.amber : colors.panelAlt,
                    borderColor: activeFilter === filter.id ? colors.accent.amber : colors.border,
                    color: activeFilter === filter.id ? '#FFFFFF' : colors.textMuted,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* All Sections */}
        <div className="space-y-6">
          {(activeFilter === 'all' || activeFilter === 'overview') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <OverviewCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'correlations') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CorrelationCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'distributions') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <DistributionCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'outliers') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <OutlierCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'categories') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <CategoryCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'target') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TargetCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'explainability') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <FeatureImportanceCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'models') && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ModelComparisonCharts data={data} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <ModelPerformanceCharts data={data} />
              </motion.div>
              {confusionMatrix && problemType && !problemType.toLowerCase().includes('regression') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.47 }}
                >
                  <ConfusionMatrix matrix={confusionMatrix} />
                </motion.div>
              )}
            </>
          )}
          {(activeFilter === 'all' || activeFilter === 'overview') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FeatureEngineeringCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'explainability') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <ExplainabilityCharts data={data} />
            </motion.div>
          )}
          {(activeFilter === 'all' || activeFilter === 'insights') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <InsightsCharts data={data} />
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2"
        >
          <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
            © 2026 AI Data Intelligence Platform · v1.0.0
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              {chartCount} Charts Available
            </span>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              Last Updated: {new Date().toLocaleTimeString()}
            </span>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono" style={{ color: colors.accent.teal }}>
                Operational
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VisualizationsPage
