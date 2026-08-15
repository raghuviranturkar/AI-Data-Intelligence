import React, { useEffect, useState } from 'react'
import { Eye, Lock, FileText } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

interface ReportPreviewProps {
  rows: number
  columns: number
  qualityScore: number
  bestModel: string
  healthScore: number
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  rows,
  columns,
  qualityScore,
  bestModel,
  healthScore,
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
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-1.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Eye className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-base font-semibold" style={{ color: colors.text }}>Report Preview</h3>
          <Badge variant="info" size="sm">Sample</Badge>
        </div>
        <Button variant="secondary" size="sm" className="font-medium">
          <Eye className="h-4 w-4 mr-2" />
          Open Full Report
        </Button>
      </div>

      <div 
        className="rounded-md p-6 relative border"
        style={{ 
          backgroundColor: colors.panelAlt,
          borderColor: colors.border
        }}
      >
        <div className="space-y-4 opacity-75">
          <div className="border-b pb-2" style={{ borderColor: colors.border }}>
            <h3 className="text-lg font-bold" style={{ color: colors.text }}>Executive Summary</h3>
            <p className="text-sm font-mono mt-1" style={{ color: colors.textMuted }}>
              Dataset contains {rows} rows and {columns} columns.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="p-3 rounded-md border"
              style={{ 
                backgroundColor: colors.panel,
                borderColor: colors.border
              }}
            >
              <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Quality Score</p>
              <p className="text-lg font-bold" style={{ color: colors.text }}>{qualityScore}/100</p>
            </div>
            <div 
              className="p-3 rounded-md border"
              style={{ 
                backgroundColor: colors.panel,
                borderColor: colors.border
              }}
            >
              <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Best Model</p>
              <p className="text-lg font-bold" style={{ color: colors.text }}>{bestModel}</p>
            </div>
            <div 
              className="p-3 rounded-md border col-span-2"
              style={{ 
                backgroundColor: colors.panel,
                borderColor: colors.border
              }}
            >
              <p className="text-xs font-mono" style={{ color: colors.textMuted }}>AI Health Score</p>
              <p className="text-lg font-bold" style={{ color: colors.text }}>{healthScore}%</p>
            </div>
          </div>
        </div>

        {/* Blur overlay */}
        <div 
          className="absolute inset-0 rounded-md flex items-end justify-center pb-6"
          style={{
            background: isDark 
              ? 'linear-gradient(to bottom, transparent 40%, rgba(11,15,20,0.9) 100%)'
              : 'linear-gradient(to bottom, transparent 40%, rgba(241,244,248,0.9) 100%)'
          }}
        >
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-md shadow-lg border"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <Lock className="h-4 w-4" style={{ color: colors.textMuted }} />
            <span className="text-sm font-mono" style={{ color: colors.textMuted }}>
              Download full report to view all content
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportPreview
