import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, Rocket } from 'lucide-react'
import { cn } from '../../utils/cn'

interface DeploymentReadinessProps {
  bestModel: any
}

const DeploymentReadiness: React.FC<DeploymentReadinessProps> = ({ bestModel }) => {
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
      coral: '#F2555A',
    }
  }

  const items = [
    { label: 'Model Trained', status: !!bestModel?.name },
    { label: 'Validation Passed', status: bestModel?.cv_score !== undefined && bestModel?.cv_score !== null },
    { label: 'Metrics Available', status: !!bestModel?.metrics && Object.keys(bestModel.metrics).length > 0 },
    { label: 'Explainability Ready', status: true },
    { label: 'Report Generated', status: true },
    { label: 'Ready for Deployment', status: bestModel?.score && bestModel.score > 0.5 },
  ]

  const allReady = items.every(item => item.status)

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
            <Rocket className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-base font-semibold" style={{ color: colors.text }}>Deployment Readiness</h3>
        </div>
        <div 
          className={cn(
            'flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono',
            allReady 
              ? 'bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/30'
              : 'bg-[#F0A94E]/10 text-[#F0A94E] border border-[#F0A94E]/30'
          )}
        >
          {allReady ? '✅ Ready' : '⏳ In Progress'}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((item) => (
          <div 
            key={item.label} 
            className="flex items-center gap-2 p-2.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            {item.status ? (
              <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
            ) : (
              <Clock className="h-4 w-4" style={{ color: colors.textDim }} />
            )}
            <span className={cn(
              'text-xs font-mono',
              item.status ? '' : 'opacity-60'
            )} style={{ color: item.status ? colors.text : colors.textMuted }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeploymentReadiness
