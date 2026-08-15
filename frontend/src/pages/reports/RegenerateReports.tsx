import React, { useState, useEffect } from 'react'
import { RefreshCw, Loader2, CheckCircle, Zap } from 'lucide-react'
import { Button } from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'

interface RegenerateReportsProps {
  onRegenerate: () => Promise<void>
  regenerating: boolean
}

const RegenerateReports: React.FC<RegenerateReportsProps> = ({
  onRegenerate,
  regenerating,
}) => {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'running' | 'complete'>('idle')
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
    }
  }

  const handleRegenerate = async () => {
    setStatus('running')
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    try {
      await onRegenerate()
      setStatus('complete')
    } catch (err) {
      setStatus('idle')
    } finally {
      clearInterval(interval)
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
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Zap className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Regenerate Reports</h3>
      </div>

      {status === 'idle' && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleRegenerate}
          disabled={regenerating}
          className="w-full md:w-auto font-medium"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Generate New Reports
        </Button>
      )}

      {status === 'running' && (
        <div className="space-y-3">
          <ProgressBar value={progress} label="Generating reports..." />
          <div className="flex items-center gap-3 text-sm font-mono" style={{ color: colors.textMuted }}>
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: colors.accent.amber }} />
            <span>Generating PDF...</span>
            <span style={{ color: colors.textDim }}>•</span>
            <span style={{ color: colors.textDim }}>Generating HTML...</span>
            <span style={{ color: colors.textDim }}>•</span>
            <span style={{ color: colors.textDim }}>Generating Markdown...</span>
          </div>
        </div>
      )}

      {status === 'complete' && (
        <div 
          className="flex items-center gap-3 p-4 rounded-md border"
          style={{ 
            backgroundColor: isDark ? 'rgba(62,207,142,0.08)' : '#F0FDF4',
            borderColor: isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0'
          }}
        >
          <CheckCircle className="h-6 w-6" style={{ color: colors.accent.teal }} />
          <div>
            <p className="font-medium" style={{ color: colors.accent.teal }}>Reports Generated Successfully!</p>
            <p className="text-sm font-mono" style={{ color: isDark ? 'rgba(62,207,142,0.7)' : '#166534' }}>
              All reports are ready for download.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegenerateReports
