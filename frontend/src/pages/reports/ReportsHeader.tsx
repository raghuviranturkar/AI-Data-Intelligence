import React, { useEffect, useState } from 'react'
import { FileText, RefreshCw, History, Download } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'

interface ReportsHeaderProps {
  reportsCount: number
  generatedAt: string
  datasetName: string
  onRegenerate: () => void
  regenerating: boolean
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  reportsCount,
  generatedAt,
  datasetName,
  onRegenerate,
  regenerating,
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
    border: isDark ? '#232B35' : '#E2E8F0',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      azure: '#4EA1F0',
    }
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300 sticky top-16 z-20"
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
            <FileText className="h-6 w-6" style={{ color: colors.accent.amber }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>
              Reports Center
            </h1>
            <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
              Download and manage AI-generated analysis reports.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="info" size="sm">{reportsCount} Reports</Badge>
              <Badge variant="info" size="sm">Dataset: {datasetName}</Badge>
              <Badge variant="info" size="sm">Generated: {generatedAt}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onRegenerate}
            disabled={regenerating}
            className="font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            {regenerating ? 'Generating...' : 'Generate Reports'}
          </Button>
          <Button variant="secondary" size="sm" className="font-medium">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="secondary" size="sm" disabled className="font-medium opacity-60">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReportsHeader
