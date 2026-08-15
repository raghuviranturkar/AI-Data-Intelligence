import React, { useEffect, useState } from 'react'
import { Brain, Target, Clock, Award, RefreshCw, GitBranch } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { cn } from '../../utils/cn'

interface ModelsHeaderProps {
  problemType: string
  targetColumn: string
  modelsTrained: number
  trainingTime: number
  bestModelName: string
  bestModelScore: number
}

const ModelsHeader: React.FC<ModelsHeaderProps> = ({
  problemType,
  targetColumn,
  modelsTrained,
  trainingTime,
  bestModelName,
  bestModelScore,
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
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
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
              backgroundColor: isDark ? '#0B0F14' : '#F8FAFC',
              borderColor: colors.border
            }}
          >
            <Brain className="h-6 w-6" style={{ color: colors.accent.amber }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>
              Models
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="info" size="sm">
                <Target className="h-3 w-3 inline mr-1" />
                {targetColumn}
              </Badge>
              <Badge variant="info" size="sm">
                {problemType}
              </Badge>
              <Badge variant="info" size="sm">
                <Brain className="h-3 w-3 inline mr-1" />
                {modelsTrained} Models
              </Badge>
              <Badge variant="info" size="sm">
                <Clock className="h-3 w-3 inline mr-1" />
                {trainingTime.toFixed(1)}s
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-md border"
            style={{
              backgroundColor: isDark ? 'rgba(62,207,142,0.08)' : '#F0FDF4',
              borderColor: isDark ? '#3ECF8E/30' : '#BBF7D0'
            }}
          >
            <Award className="h-4 w-4" style={{ color: colors.accent.teal }} />
            <span className="text-sm font-medium" style={{ color: colors.accent.teal }}>
              Best: {bestModelName} ({bestModelScore ? (bestModelScore * 100).toFixed(1) : 'N/A'}%)
            </span>
          </div>
          <Button variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={<GitBranch className="h-4 w-4" />}>
            Compare
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ModelsHeader
