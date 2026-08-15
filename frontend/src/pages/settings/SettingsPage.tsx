import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Moon, 
  Sun, 
  Monitor, 
  LayoutDashboard, 
  BarChart3, 
  Brain, 
  Shield,
  Eye,
  FileText,
  Database,
  Server,
  Bell,
  Keyboard,
  Info,
  AlertTriangle,
  Rocket,
  CheckCircle,
  XCircle,
  Activity,
  Layers
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

// Import sub-components
import SettingsHeader from './SettingsHeader'
import GeneralPreferences from './GeneralPreferences'
import AnalysisPreferences from './AnalysisPreferences'
import VisualizationPreferences from './VisualizationPreferences'
import ReportSettings from './ReportSettings'
import ModelPreferences from './ModelPreferences'
import DataProcessing from './DataProcessing'
import WorkspaceInfo from './WorkspaceInfo'
import SystemStatus from './SystemStatus'
import StorageInfo from './StorageInfo'
import NotificationPreferences from './NotificationPreferences'
import KeyboardShortcuts from './KeyboardShortcuts'
import AboutSection from './AboutSection'
import DangerZone from './DangerZone'
import FutureFeatures from './FutureFeatures'

// Toast notification component
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
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
    success: isDark ? 'rgba(62,207,142,0.08)' : '#F0FDF4',
    error: isDark ? 'rgba(242,85,90,0.08)' : '#FEF2F2',
    info: isDark ? 'rgba(78,161,240,0.08)' : '#EFF6FF',
  }
  
  const borderColors = {
    success: isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0',
    error: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA',
    info: isDark ? 'rgba(78,161,240,0.2)' : '#BFDBFE',
  }

  const textColors = {
    success: isDark ? '#3ECF8E' : '#16A34A',
    error: isDark ? '#F2555A' : '#DC2626',
    info: isDark ? '#4EA1F0' : '#2563EB',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-lg border p-4 mb-4 flex items-center justify-between`}
      style={{ 
        backgroundColor: colors[type],
        borderColor: borderColors[type]
      }}
    >
      <span style={{ color: textColors[type] }}>{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: textColors[type] }}>
        ✕
      </button>
    </motion.div>
  )
}

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
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

  // Settings state with localStorage persistence
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // fall through to defaults
      }
    }
    return {
      theme: theme || 'system',
      defaultPage: 'dashboard',
      autoDetectTarget: true,
      autoRunPipeline: true,
      generateReports: true,
      enableExplainability: true,
      generateAIInsights: true,
      savePreviousResults: true,
      chartTheme: 'default',
      animationSpeed: 'medium',
      showGridLines: true,
      enableTooltips: true,
      compactLayout: false,
      largeCards: false,
      defaultZoom: '100%',
      generatePDF: true,
      generateHTML: true,
      generateMarkdown: true,
      reportName: 'analysis_report',
      includeExecutiveSummary: true,
      includeVisualizations: true,
      includeAISummary: true,
      includeModelMetrics: true,
      includeRecommendations: true,
      randomSeed: 42,
      trainTestSplit: 0.2,
      cvFolds: 5,
      maxTrainingTime: 300,
      enableAutoFeatureEngineering: true,
      missingValueStrategy: 'mean',
      outlierStrategy: 'iqr',
      encodingStrategy: 'one_hot',
      scalingStrategy: 'standard',
      notificationsSuccess: true,
      notificationsError: true,
      notificationsAnalysisComplete: true,
      notificationsReportGenerated: true,
      notificationsDownloadComplete: true,
    }
  })

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
  }, [settings])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
    setHasUnsavedChanges(false)
    setToast({ message: 'Settings saved successfully!', type: 'success' })
    setTimeout(() => setToast(null), 5000)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaults = {
        theme: 'system',
        defaultPage: 'dashboard',
        autoDetectTarget: true,
        autoRunPipeline: true,
        generateReports: true,
        enableExplainability: true,
        generateAIInsights: true,
        savePreviousResults: true,
        chartTheme: 'default',
        animationSpeed: 'medium',
        showGridLines: true,
        enableTooltips: true,
        compactLayout: false,
        largeCards: false,
        defaultZoom: '100%',
        generatePDF: true,
        generateHTML: true,
        generateMarkdown: true,
        reportName: 'analysis_report',
        includeExecutiveSummary: true,
        includeVisualizations: true,
        includeAISummary: true,
        includeModelMetrics: true,
        includeRecommendations: true,
        randomSeed: 42,
        trainTestSplit: 0.2,
        cvFolds: 5,
        maxTrainingTime: 300,
        enableAutoFeatureEngineering: true,
        missingValueStrategy: 'mean',
        outlierStrategy: 'iqr',
        encodingStrategy: 'one_hot',
        scalingStrategy: 'standard',
        notificationsSuccess: true,
        notificationsError: true,
        notificationsAnalysisComplete: true,
        notificationsReportGenerated: true,
        notificationsDownloadComplete: true,
      }
      setSettings(defaults)
      localStorage.setItem('appSettings', JSON.stringify(defaults))
      setHasUnsavedChanges(false)
      setToast({ message: 'Settings restored to defaults.', type: 'info' })
      setTimeout(() => setToast(null), 5000)
    }
  }

  return (
    <div 
      className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 gap-4 py-4">
        <AnimatePresence>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </AnimatePresence>

        <SettingsHeader 
          onSave={handleSave}
          onReset={handleReset}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <GeneralPreferences 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            
            <AnalysisPreferences 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            
            <VisualizationPreferences 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            
            <ReportSettings 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            
            <ModelPreferences 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <DataProcessing 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            
            <WorkspaceInfo />
            
            <SystemStatus />
            
            <StorageInfo />
            
            <NotificationPreferences 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            
            <KeyboardShortcuts />
            
            <AboutSection />
            
            <DangerZone />
            
            <FutureFeatures />
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2"
        >
          <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
            © 2026 AI Data Intelligence Platform · v1.0.0
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              Settings {hasUnsavedChanges ? '· Unsaved changes' : ''}
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
              <span style={{ color: colors.accent.amber }}>●</span> v1.0.0
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage
