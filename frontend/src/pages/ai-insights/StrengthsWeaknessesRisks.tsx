import React, { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, TrendingDown, TrendingUp, Layers } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface StrengthsWeaknessesRisksProps {
  strengths: string[]
  weaknesses: string[]
  risks: string[]
}

const StrengthsWeaknessesRisks: React.FC<StrengthsWeaknessesRisksProps> = ({
  strengths,
  weaknesses,
  risks
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
      coral: '#F2555A',
    }
  }

  const hasContent = strengths.length > 0 || weaknesses.length > 0 || risks.length > 0

  if (!hasContent) {
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
            <Layers className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Strengths, Weaknesses & Risks</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No insights available.</p>
      </div>
    )
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Layers className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Strengths, Weaknesses & Risks</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Strengths */}
        <div 
          className="p-4 rounded-md border"
          style={{ 
            backgroundColor: isDark ? 'rgba(62,207,142,0.05)' : '#F0FDF4',
            borderColor: isDark ? 'rgba(62,207,142,0.15)' : '#BBF7D0'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
            <h4 className="text-xs font-semibold" style={{ color: colors.accent.teal }}>Strengths</h4>
            <Badge variant="success" size="sm">{strengths.length}</Badge>
          </div>
          {strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.slice(0, 5).map((item, index) => (
                <li key={index} className="text-xs font-mono flex items-start gap-2" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.teal }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-mono" style={{ color: colors.textDim }}>No strengths identified</p>
          )}
        </div>

        {/* Weaknesses */}
        <div 
          className="p-4 rounded-md border"
          style={{ 
            backgroundColor: isDark ? 'rgba(242,85,90,0.05)' : '#FEF2F2',
            borderColor: isDark ? 'rgba(242,85,90,0.15)' : '#FECACA'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-4 w-4" style={{ color: colors.accent.coral }} />
            <h4 className="text-xs font-semibold" style={{ color: colors.accent.coral }}>Weaknesses</h4>
            <Badge variant="danger" size="sm">{weaknesses.length}</Badge>
          </div>
          {weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {weaknesses.slice(0, 5).map((item, index) => (
                <li key={index} className="text-xs font-mono flex items-start gap-2" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.coral }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-mono" style={{ color: colors.textDim }}>No weaknesses identified</p>
          )}
        </div>

        {/* Risks */}
        <div 
          className="p-4 rounded-md border"
          style={{ 
            backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(240,169,78,0.15)' : '#FDE68A'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" style={{ color: colors.accent.amber }} />
            <h4 className="text-xs font-semibold" style={{ color: colors.accent.amber }}>Risks</h4>
            <Badge variant="warning" size="sm">{risks.length}</Badge>
          </div>
          {risks.length > 0 ? (
            <ul className="space-y-2">
              {risks.slice(0, 5).map((item, index) => (
                <li key={index} className="text-xs font-mono flex items-start gap-2" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.amber }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-mono" style={{ color: colors.textDim }}>No risks identified</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StrengthsWeaknessesRisks
