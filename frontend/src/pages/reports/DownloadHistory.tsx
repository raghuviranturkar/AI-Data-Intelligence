import React, { useEffect, useState } from 'react'
import { History, Download, Clock, FileText } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const DownloadHistory: React.FC = () => {
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
          <History className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Download History</h3>
        <Badge variant="info" size="sm">0 Downloads</Badge>
      </div>

      <div className="text-center py-8">
        <div 
          className="w-16 h-16 rounded-md border mx-auto mb-4 flex items-center justify-center"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <History className="h-8 w-8" style={{ color: colors.textDim }} />
        </div>
        <p className="text-base font-medium" style={{ color: colors.textMuted }}>No previous downloads</p>
        <p className="text-sm font-mono mt-1" style={{ color: colors.textDim }}>
          Download reports to track your history
        </p>
      </div>
    </div>
  )
}

export default DownloadHistory
