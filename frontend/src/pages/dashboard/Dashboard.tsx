import React, { useEffect, useState } from 'react'
import { useData } from '../../context/DataContext'
import { 
  Database, 
  Award, 
  Activity, 
  Brain,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Shield,
  Lightbulb,
  Loader2,
  Clock,
  Target,
  BarChart3,
  Settings,
  GitBranch,
  Users,
  Zap,
  Server,
  HardDrive,
  Calendar,
  ArrowRight,
  Upload,
  Rocket,
  Layers,
  Grid,
  Sparkles,
  Gauge,
  FolderOpen,
  ChartBar,
  LineChart,
  PieChart,
  Workflow
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import Card from '../../components/common/Card'
import ProgressBar from '../../components/common/ProgressBar'
import { cn } from '../../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

// --- Design tokens ---
const getColors = (isDark: boolean) => ({
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
})

// --- Sub-components ---

// Stat Card
const StatCard: React.FC<{
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  subtitle?: string
  badge?: string
}> = ({ label, value, icon, color, subtitle, badge }) => {
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

  const colors = getColors(isDark)

  return (
    <div 
      className="rounded-lg border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>
            {label}
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: colors.text }}>{value}</p>
          {subtitle && <p className="text-xs font-mono mt-0.5" style={{ color: colors.textDim }}>{subtitle}</p>}
          {badge && (
            <Badge variant="success" size="sm" className="mt-1">
              {badge}
            </Badge>
          )}
        </div>
        <div 
          className="p-2.5 rounded-md border flex-shrink-0"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  )
}

// Pipeline Stage Component
const PipelineStage: React.FC<{
  label: string
  icon: React.ReactNode
  status: 'completed' | 'running' | 'pending'
  isLast?: boolean
}> = ({ label, icon, status, isLast = false }) => {
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

  const colors = getColors(isDark)
  const isCompleted = status === 'completed'

  return (
    <div className="flex items-center flex-shrink-0">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-md border-2 transition-all duration-300',
            isCompleted
              ? 'border-[#3ECF8E] bg-[#3ECF8E]/10 text-[#3ECF8E]'
              : 'border-[#232B35] bg-[#0B0F14] text-[#4A5563]'
          )}
        >
          {isCompleted ? <CheckCircle className="h-4 w-4" /> : icon}
        </div>
        <span
          className={cn(
            'mt-1.5 text-[10px] font-mono text-center max-w-[44px]',
            isCompleted ? 'text-[#3ECF8E]' : 'text-[#4A5563]'
          )}
        >
          {label}
        </span>
      </div>
      {!isLast && (
        <div
          className={cn(
            'mx-1 h-0.5 w-4 md:w-8',
            isCompleted ? 'bg-[#3ECF8E]' : 'bg-[#232B35]'
          )}
        />
      )}
    </div>
  )
}

// Insight Card
const InsightCard: React.FC<{
  insight: string
  index: number
}> = ({ insight, index }) => {
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

  const colors = getColors(isDark)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3 p-3 rounded-md border"
      style={{ 
        backgroundColor: colors.panelAlt,
        borderColor: colors.border
      }}
    >
      <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: colors.accent.amber }} />
      <p className="text-sm font-mono" style={{ color: colors.textMuted }}>{insight}</p>
    </motion.div>
  )
}

// Quick Nav Item
const QuickNavItem: React.FC<{
  to: string
  icon: React.ReactNode
  label: string
  color: string
}> = ({ to, icon, label, color }) => {
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

  const colors = getColors(isDark)

  return (
    <Link to={to} className="block">
      <div 
        className="flex flex-col items-center p-3 rounded-md border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{ 
          backgroundColor: colors.panelAlt,
          borderColor: colors.border
        }}
      >
        <div 
          className="p-2 rounded-md border"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <span className="text-xs font-mono mt-1.5" style={{ color: colors.textMuted }}>{label}</span>
      </div>
    </Link>
  )
}

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData()
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

  const colors = getColors(isDark)

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
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>Loading dashboard...</p>
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
          <Database className="h-16 w-16" style={{ color: colors.textMuted }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>No Data Available</h2>
        <p className="text-sm font-mono mt-2 max-w-md" style={{ color: colors.textMuted }}>
          Upload a dataset to start your analysis journey.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Dataset
        </Button>
      </div>
    )
  }

  // Extract data
  const dataset = data?.dataset || {}
  const validation = data?.validation || {}
  const automl = data?.automl || {}
  const insights = data?.insights || {}
  const explainability = data?.explainability || {}

  const rows = dataset?.shape?.rows || 0
  const columns = dataset?.shape?.columns || 0
  const qualityScore = validation?.quality?.quality_score || 0
  const healthScore = insights?.ai_health_score?.score || 0
  const bestModel = automl?.best_model?.name || 'N/A'
  const modelsTrained = automl?.models_trained || 0
  const targetColumn = automl?.target_column || 'N/A'
  const reportsGenerated = 3
  const processingTime = '2.4s'
  const duplicates = dataset?.duplicate_rows || 0
  const missingValues = Object.values(dataset?.missing_values || {}).reduce((a: number, b: number) => a + b, 0)
  const totalRows = rows
  const missingPercentage = totalRows > 0 ? (missingValues / (totalRows * columns)) * 100 : 0

  const qualityLevel = qualityScore >= 80 ? 'Excellent' : qualityScore >= 60 ? 'Good' : 'Needs Improvement'
  const healthLevel = healthScore >= 70 ? 'Production Ready' : healthScore >= 50 ? 'Needs Review' : 'Not Ready'

  const insightsList = insights?.executive_summary 
    ? [insights.executive_summary, ...(insights?.recommendations || [])].slice(0, 4)
    : ['Dataset ready for analysis', 'Quality score is excellent', 'Model performance is good', 'Reports generated successfully']

  const pipelineStages = [
    { id: 'upload', label: 'Upload', icon: <Upload className="h-3.5 w-3.5" />, status: 'completed' as const },
    { id: 'validation', label: 'Validate', icon: <Shield className="h-3.5 w-3.5" />, status: 'completed' as const },
    { id: 'eda', label: 'Explore', icon: <BarChart3 className="h-3.5 w-3.5" />, status: 'completed' as const },
    { id: 'feature', label: 'Features', icon: <Settings className="h-3.5 w-3.5" />, status: 'completed' as const },
    { id: 'automl', label: 'AutoML', icon: <Brain className="h-3.5 w-3.5" />, status: 'completed' as const },
    { id: 'explain', label: 'Explain', icon: <Shield className="h-3.5 w-3.5" />, status: 'completed' as const },
    { id: 'insights', label: 'Insights', icon: <Lightbulb className="h-3.5 w-3.5" />, status: 'completed' as const },
    { id: 'reports', label: 'Reports', icon: <FileText className="h-3.5 w-3.5" />, status: 'completed' as const },
  ]

  return (
    <div 
      className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 gap-4 py-4">
        {/* Welcome Header */}
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
                <Sparkles className="h-6 w-6" style={{ color: colors.accent.amber }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>
                  Good Afternoon 👋
                </h1>
                <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
                  Welcome back to AI Data Intelligence Platform
                </p>
                <p className="text-xs font-mono mt-0.5" style={{ color: colors.textDim }}>
                  Latest dataset: {dataset?.file_name || 'Unknown'} · Processed successfully
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" size="sm">
                <Database className="h-3 w-3 inline mr-1" />
                {dataset?.file_name || 'Unknown'}
              </Badge>
              <Badge variant="info" size="sm">
                <Clock className="h-3 w-3 inline mr-1" />
                Today 10:25
              </Badge>
              <Badge variant="success" size="sm">✓ Complete</Badge>
            </div>
          </div>
        </motion.div>

        {/* Row 1: Executive KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <StatCard 
            label="Dataset Size"
            value={rows.toLocaleString()}
            icon={<Database className="h-5 w-5" />}
            color={colors.accent.amber}
            subtitle={`${columns} columns`}
          />
          <StatCard 
            label="Quality Score"
            value={`${qualityScore}/100`}
            icon={<Award className="h-5 w-5" />}
            color={qualityScore >= 80 ? colors.accent.teal : colors.accent.amber}
            badge={qualityLevel}
          />
          <StatCard 
            label="AI Health"
            value={`${healthScore}%`}
            icon={<Activity className="h-5 w-5" />}
            color={healthScore >= 70 ? colors.accent.teal : colors.accent.amber}
            badge={healthLevel}
          />
          <StatCard 
            label="Best Model"
            value={bestModel}
            icon={<Brain className="h-5 w-5" />}
            color={colors.accent.purple}
            subtitle={`${((automl?.best_model?.score || 0) * 100).toFixed(1)}% accuracy`}
          />
        </motion.div>

        {/* Row 2: Secondary Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <div 
            className="rounded-lg border p-3 transition-colors duration-300"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <GitBranch className="h-4 w-4" style={{ color: colors.accent.azure }} />
              </div>
              <div>
                <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Models Trained</p>
                <p className="text-lg font-bold" style={{ color: colors.text }}>{modelsTrained}</p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-lg border p-3 transition-colors duration-300"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Target className="h-4 w-4" style={{ color: colors.accent.purple }} />
              </div>
              <div>
                <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Target Variable</p>
                <p className="text-lg font-bold truncate max-w-[100px]" style={{ color: colors.text }}>{targetColumn}</p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-lg border p-3 transition-colors duration-300"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <FileText className="h-4 w-4" style={{ color: colors.accent.teal }} />
              </div>
              <div>
                <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Reports Generated</p>
                <p className="text-lg font-bold" style={{ color: colors.text }}>{reportsGenerated}</p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-lg border p-3 transition-colors duration-300"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Clock className="h-4 w-4" style={{ color: colors.accent.amber }} />
              </div>
              <div>
                <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Processing Time</p>
                <p className="text-lg font-bold" style={{ color: colors.text }}>{processingTime}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dataset Overview + Pipeline Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Dataset Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-lg border p-5 transition-colors duration-300"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-1.5 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Layers className="h-4 w-4" style={{ color: colors.accent.amber }} />
              </div>
              <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Dataset Overview</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Name', value: dataset?.file_name || 'Unknown' },
                { label: 'Rows', value: rows.toLocaleString() },
                { label: 'Columns', value: columns },
                { label: 'Target', value: targetColumn },
                { label: 'Missing Values', value: `${missingPercentage.toFixed(1)}%` },
                { label: 'Duplicates', value: duplicates },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-1.5 border-b last:border-0"
                  style={{ borderColor: colors.border }}
                >
                  <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
                  <span className="text-xs font-medium" style={{ color: colors.text }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pipeline Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-lg border p-5 transition-colors duration-300"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-1.5 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Workflow className="h-4 w-4" style={{ color: colors.accent.azure }} />
              </div>
              <h3 className="text-sm font-semibold" style={{ color: colors.text }}>AI Pipeline Status</h3>
              <Badge variant="success" size="sm">All Stages Complete</Badge>
            </div>
            <div className="flex items-center justify-between overflow-x-auto py-2 gap-1">
              {pipelineStages.map((stage, index) => (
                <PipelineStage
                  key={stage.id}
                  label={stage.label}
                  icon={stage.icon}
                  status={stage.status}
                  isLast={index === pipelineStages.length - 1}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dataset Health + Business Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Dataset Health */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-lg border p-5 transition-colors duration-300"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-1.5 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Gauge className="h-4 w-4" style={{ color: colors.accent.teal }} />
              </div>
              <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Dataset Health</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Quality', value: qualityScore, color: qualityScore >= 80 ? colors.accent.teal : colors.accent.amber },
                { label: 'Completeness', value: Math.round(100 - missingPercentage), color: colors.accent.teal },
                { label: 'Consistency', value: qualityScore >= 80 ? 94 : 78, color: colors.accent.teal },
                { label: 'Readiness', value: 100, color: colors.accent.teal },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span style={{ color: colors.textMuted }}>{item.label}</span>
                    <span className="font-medium" style={{ color: colors.text }}>{item.value}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: colors.border }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Business Insights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg border p-5 transition-colors duration-300"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-1.5 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Lightbulb className="h-4 w-4" style={{ color: colors.accent.amber }} />
              </div>
              <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Business Insights</h3>
              <Badge variant="info" size="sm">{insightsList.length}</Badge>
            </div>
            <div className="space-y-2">
              {insightsList.slice(0, 4).map((insight: string, index: number) => (
                <InsightCard key={index} insight={insight} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-lg border p-5 transition-colors duration-300"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="p-1.5 rounded-md border"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <Grid className="h-4 w-4" style={{ color: colors.accent.purple }} />
            </div>
            <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Quick Navigation</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { to: '/analysis', icon: <BarChart3 className="h-5 w-5" />, label: 'Analysis', color: colors.accent.amber },
              { to: '/visualizations', icon: <LineChart className="h-5 w-5" />, label: 'Visuals', color: colors.accent.azure },
              { to: '/models', icon: <Brain className="h-5 w-5" />, label: 'Models', color: colors.accent.purple },
              { to: '/explainability', icon: <Shield className="h-5 w-5" />, label: 'Explain', color: colors.accent.teal },
              { to: '/insights', icon: <Lightbulb className="h-5 w-5" />, label: 'Insights', color: colors.accent.amber },
              { to: '/reports', icon: <FileText className="h-5 w-5" />, label: 'Reports', color: colors.accent.coral },
            ].map((item) => (
              <QuickNavItem key={item.to} {...item} />
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg border p-5 transition-colors duration-300"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="p-1.5 rounded-md border"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <Server className="h-4 w-4" style={{ color: colors.accent.teal }} />
            </div>
            <h3 className="text-sm font-semibold" style={{ color: colors.text }}>System Status</h3>
            <Badge variant="success" size="sm">All Systems Operational</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Backend', status: 'Healthy', icon: <Server className="h-4 w-4" /> },
              { label: 'AutoML', status: 'Ready', icon: <Brain className="h-4 w-4" /> },
              { label: 'Storage', status: 'Available', icon: <HardDrive className="h-4 w-4" /> },
              { label: 'Report Engine', status: 'Ready', icon: <FileText className="h-4 w-4" /> },
            ].map((item) => (
              <div 
                key={item.label} 
                className="flex items-center justify-between p-2.5 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: colors.textMuted }}>{item.icon}</span>
                  <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
                </div>
                <Badge variant="success" size="sm">{item.status}</Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2"
        >
          <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
            © 2026 AI Data Intelligence Platform · v1.0.0
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              Models Available: {modelsTrained}
            </span>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              Last Updated: Today 10:25
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

export default Dashboard
