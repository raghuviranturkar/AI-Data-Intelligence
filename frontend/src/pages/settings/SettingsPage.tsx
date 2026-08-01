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
  Activity
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { useTheme } from '../../context/ThemeContext'

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
  const colors = {
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-700 dark:text-success-400',
    error: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
  }
  
  return (
    <div className={`${colors[type]} border rounded-lg p-4 mb-4 flex items-center justify-between`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        ✕
      </button>
    </div>
  )
}

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
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
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    setHasUnsavedChanges(false)
    setToast({ message: 'Settings saved successfully!', type: 'success' })
    setTimeout(() => setToast(null), 5000)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset logic would go here
      setHasUnsavedChanges(false)
      setToast({ message: 'Settings restored to defaults.', type: 'info' })
      setTimeout(() => setToast(null), 5000)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <SettingsHeader 
        onSave={handleSave}
        onReset={handleReset}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
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
        <div className="space-y-6">
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
    </div>
  )
}

export default SettingsPage
