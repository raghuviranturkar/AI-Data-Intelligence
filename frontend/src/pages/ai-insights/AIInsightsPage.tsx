import React, { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { useNavigate } from 'react-router-dom'
import { 
  Loader2, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Shield,
  CheckCircle,
  ArrowRight,
  Target,
  Award,
  Activity,
  FileText,
  Sparkles,
  BarChart3,
  Settings,
  GitBranch,
  Zap,
  Layers
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import Card from '../../components/common/Card'
import { cn } from '../../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

// Import sub-components
import AIHealthScore from './AIHealthScore'
import AIExecutiveSummary from './AIExecutiveSummary'
import DataQualityInsights from './DataQualityInsights'
import EDAInsights from './EDAInsights'
import ModelInsights from './ModelInsights'
import ExplainabilityInsights from './ExplainabilityInsights'
import StrengthsWeaknessesRisks from './StrengthsWeaknessesRisks'
import RecommendationsNextSteps from './RecommendationsNextSteps'

const AIInsightsPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const navigate = useNavigate()
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
      azure: '#4EA1F0',
      purple: '#B48CF2',
      coral: '#F2555A',
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
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>Generating AI insights...</p>
          <div className="flex flex-col items-center gap-1 text-xs font-mono" style={{ color: colors.textDim }}>
            <p>Analyzing dataset</p>
            <p>Analyzing quality</p>
            <p>Analyzing EDA</p>
            <p>Analyzing models</p>
            <p>Analyzing explainability</p>
            <p>Preparing recommendations</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12" style={{ color: colors.accent.coral }} />
          <h2 className="text-2xl font-bold" style={{ color: colors.text }}>Unable to load AI insights</h2>
          <p className="text-sm font-mono max-w-md" style={{ color: colors.textMuted }}>{error}</p>
          <Button className="mt-2" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div 
            className="p-4 rounded-md border mb-2"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <Sparkles className="h-16 w-16" style={{ color: colors.textMuted }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: colors.text }}>No dataset analyzed yet</h2>
          <p className="text-sm font-mono max-w-md" style={{ color: colors.textMuted }}>
            Upload a dataset to generate AI insights.
          </p>
          <Button variant="primary" size="lg" className="mt-4" onClick={() => navigate('/upload')}>
            Upload Dataset
          </Button>
        </div>
      </div>
    )
  }

  const insights = data?.insights || {}
  const dataset = data?.dataset || {}
  const validation = data?.validation || {}
  const automl = data?.automl || {}
  const explainability = data?.explainability || {}
  const healthScore = insights?.ai_health_score?.score || 0
  const healthConfidence = insights?.ai_health_score?.confidence || 'Medium'

  return (
    <div 
      className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 gap-4 py-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-6 transition-colors duration-300"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="p-2.5 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Sparkles className="h-6 w-6" style={{ color: colors.accent.amber }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>
                  AI Insights
                </h1>
                <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
                  What the system understands about your dataset, models, and what you should do next
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info" size="sm">
                <FileText className="h-3 w-3 inline mr-1" />
                {dataset?.file_name || 'Unknown dataset'}
              </Badge>
              <Badge variant="info" size="sm">
                <Activity className="h-3 w-3 inline mr-1" />
                {dataset?.shape?.rows || 0} rows
              </Badge>
              <Badge variant="info" size="sm">
                <BarChart3 className="h-3 w-3 inline mr-1" />
                {dataset?.shape?.columns || 0} columns
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* AI Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <AIHealthScore 
            score={healthScore}
            confidence={healthConfidence}
            datasetName={dataset?.file_name || 'Unknown'}
          />
        </motion.div>

        {/* Executive Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AIExecutiveSummary summary={insights?.executive_summary || ''} />
        </motion.div>

        {/* Insights Grid - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <DataQualityInsights 
              qualityScore={validation?.quality?.quality_score || 0}
              warnings={validation?.quality?.warnings || []}
              totalWarnings={validation?.quality?.total_warnings || 0}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EDAInsights insights={insights?.eda_insights || []} />
          </motion.div>
        </div>

        {/* Insights Grid - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <ModelInsights 
              bestModel={automl?.best_model?.name || 'N/A'}
              modelsTrained={automl?.models_trained || 0}
              modelScore={automl?.best_model?.score || 0}
              modelInsights={insights?.model_insights || []}
              onNavigate={() => navigate('/models')}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ExplainabilityInsights 
              shapAvailable={explainability?.shap_available || false}
              explainabilityInsights={insights?.explainability_insights || []}
              onNavigate={() => navigate('/explainability')}
            />
          </motion.div>
        </div>

        {/* Strengths, Weaknesses & Risks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <StrengthsWeaknessesRisks 
            strengths={insights?.strengths || []}
            weaknesses={insights?.weaknesses || []}
            risks={insights?.risks || []}
          />
        </motion.div>

        {/* Recommendations & Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecommendationsNextSteps 
            recommendations={insights?.recommendations || []}
            nextSteps={insights?.next_steps || []}
          />
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
              AI Powered Insights
            </span>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono" style={{ color: colors.accent.teal }}>
                Ready
              </span>
            </div>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <span className="text-xs font-mono" style={{ color: colors.textDim }}>
              <span style={{ color: colors.accent.amber }}>●</span> Real-time
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AIInsightsPage
