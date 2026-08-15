import React, { useEffect, useState } from 'react'
import { Award, TrendingUp, Clock, Eye } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { cn } from '../../utils/cn'

interface CandidateModelsProps {
  rankedModels: any[]
  bestModelName: string
  onSelectModel?: (modelName: string) => void
}

const CandidateModels: React.FC<CandidateModelsProps> = ({
  rankedModels,
  bestModelName,
  onSelectModel,
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
    }
  }

  if (rankedModels.length === 0) {
    return (
      <div 
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Candidate Models</h3>
        <p className="text-sm font-mono mt-2" style={{ color: colors.textMuted }}>No models available</p>
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
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <TrendingUp className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Candidate Models</h3>
        <Badge variant="info" size="sm">{rankedModels.length}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {rankedModels.map((model) => {
          const isBest = model.model_name === bestModelName
          const score = model.score || 0

          return (
            <div
              key={model.model_name}
              className={cn(
                'rounded-md border p-4 transition-all duration-200',
                isBest
                  ? 'border-[#F0A94E] bg-[#F0A94E]/5'
                  : 'border-[#232B35] bg-[#0B0F14]'
              )}
              style={{
                borderColor: isBest ? colors.accent.amber : colors.border,
                backgroundColor: isBest ? 'rgba(240,169,78,0.05)' : colors.panelAlt
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate text-sm" style={{ color: colors.text }}>
                      {model.model_name}
                    </p>
                    {isBest && <Award className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.amber }} />}
                  </div>
                  {isBest && (
                    <Badge variant="success" size="sm">🏆 Best Model</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Eye className="h-3 w-3" />}
                  onClick={() => onSelectModel?.(model.model_name)}
                >
                  View
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-1 text-xs font-mono">
                <div style={{ color: colors.textMuted }}>Score</div>
                <div className="text-right font-medium" style={{ color: colors.text }}>
                  {score ? (score * 100).toFixed(1) : 'N/A'}%
                </div>
                <div style={{ color: colors.textMuted }}>Rank</div>
                <div className="text-right font-medium" style={{ color: colors.text }}>
                  #{model.rank}
                </div>
              </div>

              <div className="mt-2 w-full rounded-full h-1" style={{ backgroundColor: colors.border }}>
                <div
                  className={cn(
                    'h-1 rounded-full transition-all duration-500',
                    isBest ? 'bg-[#F0A94E]' : 'bg-[#4EA1F0]'
                  )}
                  style={{ 
                    width: `${Math.min(score * 100, 100)}%`,
                    backgroundColor: isBest ? colors.accent.amber : colors.accent.azure
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CandidateModels
