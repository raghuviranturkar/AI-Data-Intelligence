import React, { useEffect, useState } from 'react'
import { Download, Eye, CheckCircle, Loader2, FileText, Globe } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { cn } from '../../utils/cn'

interface Report {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  format: 'pdf' | 'html' | 'md'
  status: 'ready' | 'generating' | 'error'
  size: string
  generatedAt: string
  features: string[]
}

interface ReportCardProps {
  report: Report
  onDownload: () => void
  downloading: boolean
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDownload, downloading }) => {
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
      purple: '#B48CF2',
    }
  }

  const isReady = report.status === 'ready'

  const formatColors = {
    pdf: {
      border: isDark ? 'rgba(240,169,78,0.2)' : 'rgba(240,169,78,0.3)',
      bg: isDark ? 'rgba(240,169,78,0.05)' : 'rgba(240,169,78,0.05)',
    },
    html: {
      border: isDark ? 'rgba(78,161,240,0.2)' : 'rgba(78,161,240,0.3)',
      bg: isDark ? 'rgba(78,161,240,0.05)' : 'rgba(78,161,240,0.05)',
    },
    md: {
      border: isDark ? 'rgba(139,150,165,0.2)' : 'rgba(139,150,165,0.3)',
      bg: isDark ? 'rgba(139,150,165,0.05)' : 'rgba(139,150,165,0.05)',
    },
  }

  const formatBadges = {
    pdf: { label: 'PDF', variant: 'primary' as const },
    html: { label: 'HTML', variant: 'info' as const },
    md: { label: 'Markdown', variant: 'default' as const },
  }

  const badge = formatBadges[report.format] || { label: 'Unknown', variant: 'default' as const }

  const formatIcon = {
    pdf: <FileText className="h-8 w-8" style={{ color: colors.accent.amber }} />,
    html: <Globe className="h-8 w-8" style={{ color: colors.accent.azure }} />,
    md: <FileText className="h-8 w-8" style={{ color: colors.textMuted }} />,
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: formatColors[report.format]?.border || colors.border,
        boxShadow: isDark ? '0 0 0 1px rgba(255,255,255,0.03)' : '0 0 0 1px rgba(0,0,0,0.02)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            {formatIcon[report.format] || report.icon}
          </div>
          <div>
            <h4 className="font-semibold" style={{ color: colors.text }}>{report.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
              {isReady && <Badge variant="success" size="sm">Ready</Badge>}
              {report.size && <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{report.size}</span>}
            </div>
          </div>
        </div>
        {isReady && <CheckCircle className="h-5 w-5" style={{ color: colors.accent.teal }} />}
      </div>

      <p className="text-sm font-mono mt-3" style={{ color: colors.textMuted }}>{report.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {report.features.slice(0, 3).map((feature, i) => (
          <span 
            key={i} 
            className="text-xs font-mono px-2 py-0.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border,
              color: colors.textMuted
            }}
          >
            {feature}
          </span>
        ))}
        {report.features.length > 3 && (
          <span 
            className="text-xs font-mono px-2 py-0.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border,
              color: colors.textDim
            }}
          >
            +{report.features.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
        <span className="text-xs font-mono" style={{ color: colors.textDim }}>Generated {report.generatedAt}</span>
        <Button
          variant={isReady ? 'primary' : 'secondary'}
          size="sm"
          onClick={onDownload}
          disabled={!isReady || downloading}
          className="font-medium"
        >
          {downloading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default ReportCard
