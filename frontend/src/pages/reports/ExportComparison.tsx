import React, { useEffect, useState } from 'react'
import { Check, X, GitCompare } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const comparisons = [
  { feature: 'Printable', pdf: true, html: true, markdown: false },
  { feature: 'Interactive', pdf: false, html: true, markdown: false },
  { feature: 'GitHub Friendly', pdf: false, html: false, markdown: true },
  { feature: 'Charts', pdf: true, html: true, markdown: false },
  { feature: 'Sharing', pdf: true, html: true, markdown: true },
  { feature: 'Dark Mode', pdf: false, html: true, markdown: false },
]

const ExportComparison: React.FC = () => {
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
      teal: '#3ECF8E',
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
          <GitCompare className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Export Formats Comparison</h3>
        <Badge variant="info" size="sm">3 Formats</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: colors.border }}>
              <th className="px-3 py-2 text-left text-xs font-mono" style={{ color: colors.textMuted }}>Feature</th>
              <th className="px-3 py-2 text-center text-xs font-mono" style={{ color: colors.textMuted }}>PDF</th>
              <th className="px-3 py-2 text-center text-xs font-mono" style={{ color: colors.textMuted }}>HTML</th>
              <th className="px-3 py-2 text-center text-xs font-mono" style={{ color: colors.textMuted }}>Markdown</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((item, index) => (
              <tr key={index} className="border-b" style={{ borderColor: colors.border }}>
                <td className="px-3 py-2 text-sm font-mono" style={{ color: colors.text }}>{item.feature}</td>
                <td className="px-3 py-2 text-center">
                  {item.pdf ? <Check className="h-4 w-4 mx-auto" style={{ color: colors.accent.teal }} /> : <X className="h-4 w-4 mx-auto" style={{ color: colors.textDim }} />}
                </td>
                <td className="px-3 py-2 text-center">
                  {item.html ? <Check className="h-4 w-4 mx-auto" style={{ color: colors.accent.teal }} /> : <X className="h-4 w-4 mx-auto" style={{ color: colors.textDim }} />}
                </td>
                <td className="px-3 py-2 text-center">
                  {item.markdown ? <Check className="h-4 w-4 mx-auto" style={{ color: colors.accent.teal }} /> : <X className="h-4 w-4 mx-auto" style={{ color: colors.textDim }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExportComparison
