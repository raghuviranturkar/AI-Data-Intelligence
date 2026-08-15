import React, { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { 
  Loader2, AlertTriangle, Shield, Brain, Sparkles, 
  RefreshCw, Eye, BarChart3, ChevronDown, ChevronRight,
  Layers
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import Card from '../../components/common/Card'
import { cn } from '../../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

// Import sub-components
import ExplainabilityHeader from './ExplainabilityHeader'
import ExplainabilityOverview from './ExplainabilityOverview'
import ExplainabilityPipeline from './ExplainabilityPipeline'
import FeatureImportanceChart from './FeatureImportanceChart'
import FeatureImportanceTable from './FeatureImportanceTable'
import FeatureCategories from './FeatureCategories'
import GlobalExplanation from './GlobalExplanation'
import LocalExplanation from './LocalExplanation'
import DecisionBreakdown from './DecisionBreakdown'
import SHAPVisualizations from './SHAPVisualizations'
import AIExplanation from './AIExplanation'
import ExplanationConfidence from './ExplanationConfidence'
import ExplainabilityInsights from './ExplainabilityInsights'
import ResponsibleAIPanel from './ResponsibleAIPanel'
import TechnicalDetails from './TechnicalDetails'
import FeatureContributionCards from './FeatureContributionCards'

const ExplainabilityPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const [technicalExpanded, setTechnicalExpanded] = useState(false)
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
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>Loading explainability results...</p>
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
          <Shield className="h-16 w-16" style={{ color: colors.textMuted }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>No Explainability Data</h2>
        <p className="text-sm font-mono mt-2 max-w-md" style={{ color: colors.textMuted }}>
          Upload a dataset and train a model to explore explainability insights.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  const explainability = data?.explainability || {}
  const automl = data?.automl || {}
  const bestModel = automl?.best_model || {}
  const shapAvailable = explainability?.shap_available || false
  const featureRanking = explainability?.feature_ranking || []
  const featureImportance = explainability?.feature_importance || {}
  const globalExplanation = explainability?.global_explanation || {}
  const localExplanation = explainability?.local_explanation || {}
  const insights = explainability?.insights || {}

  const hasExplainability = featureRanking.length > 0 || Object.keys(featureImportance).length > 0

  if (!hasExplainability) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: colors.bg, ...gridBgStyle }}>
        <div 
          className="p-4 rounded-md border mb-4"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <Shield className="h-16 w-16" style={{ color: colors.textMuted }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>No Explainability Available</h2>
        <p className="text-sm font-mono mt-2 max-w-md" style={{ color: colors.textMuted }}>
          Model explainability results are not available for this dataset.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  const mostImportantFeature = featureRanking.length > 0 ? featureRanking[0]?.feature : 'N/A'

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
        <ExplainabilityHeader 
          shapAvailable={shapAvailable}
          featureCount={featureRanking.length}
          mostImportantFeature={mostImportantFeature}
          method={shapAvailable ? 'SHAP' : 'Model Importance'}
          modelName={bestModel?.name || 'N/A'}
        />

        {/* Overview Cards */}
        <ExplainabilityOverview 
          shapAvailable={shapAvailable}
          featureCount={featureRanking.length}
          mostImportantFeature={mostImportantFeature}
          method={shapAvailable ? 'SHAP' : 'Model Importance'}
          modelName={bestModel?.name || 'N/A'}
          confidence={explainability?.confidence?.level || 'Medium'}
        />

        {/* Pipeline */}
        <ExplainabilityPipeline shapAvailable={shapAvailable} />

        {/* Feature Importance Chart */}
        <FeatureImportanceChart featureRanking={featureRanking} />

        {/* Feature Importance Table */}
        <FeatureImportanceTable featureRanking={featureRanking} />

        {/* Feature Categories */}
        <FeatureCategories featureRanking={featureRanking} />

        {/* Global Explanation */}
        <GlobalExplanation globalExplanation={globalExplanation} />

        {/* Local Explanation */}
        <LocalExplanation localExplanation={localExplanation} />

        {/* Decision Breakdown */}
        <DecisionBreakdown localExplanation={localExplanation} />

        {/* Feature Contribution Cards */}
        <FeatureContributionCards localExplanation={localExplanation} />

        {/* SHAP Visualizations */}
        <SHAPVisualizations shapAvailable={shapAvailable} />

        {/* AI Explanation */}
        <AIExplanation localExplanation={localExplanation} />

        {/* Explanation Confidence */}
        <ExplanationConfidence confidence={explainability?.confidence || { level: 'Medium', score: 70, reason: 'SHAP not available - using model feature importance instead' }} />

        {/* Explainability Insights */}
        <ExplainabilityInsights insights={insights} />

        {/* Responsible AI Panel */}
        <ResponsibleAIPanel shapAvailable={shapAvailable} />

        {/* Technical Details */}
        <TechnicalDetails 
          shapAvailable={shapAvailable}
          method={shapAvailable ? 'SHAP' : 'Model Importance'}
          modelName={bestModel?.name || 'N/A'}
          featureCount={featureRanking.length}
          generatedAt={new Date().toISOString()}
          expanded={technicalExpanded}
          onToggle={() => setTechnicalExpanded(!technicalExpanded)}
        />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2"
        >
          <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
            © 2026 AI Data Intelligence Platform · v1.0.0
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              {shapAvailable ? 'SHAP Powered' : 'Model Importance'}
            </span>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono" style={{ color: colors.accent.teal }}>
                Explainable
              </span>
            </div>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <span className="text-xs font-mono" style={{ color: colors.textDim }}>
              <span style={{ color: colors.accent.amber }}>●</span> Trustworthy AI
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ExplainabilityPage
