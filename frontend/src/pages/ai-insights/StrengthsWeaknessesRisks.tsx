import React from 'react'
import { CheckCircle, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

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
  const hasContent = strengths.length > 0 || weaknesses.length > 0 || risks.length > 0

  if (!hasContent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Strengths, Weaknesses & Risks</h3>
        <p className="text-gray-500 dark:text-gray-400">No insights available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Strengths, Weaknesses & Risks</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Strengths */}
        <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
            <h4 className="font-medium text-success-700 dark:text-success-400">Strengths</h4>
            <Badge variant="success" size="sm">{strengths.length}</Badge>
          </div>
          {strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.slice(0, 5).map((item, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-success-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No strengths identified</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-800">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-danger-600 dark:text-danger-400" />
            <h4 className="font-medium text-danger-700 dark:text-danger-400">Weaknesses</h4>
            <Badge variant="danger" size="sm">{weaknesses.length}</Badge>
          </div>
          {weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {weaknesses.slice(0, 5).map((item, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-danger-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No weaknesses identified</p>
          )}
        </div>

        {/* Risks */}
        <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" />
            <h4 className="font-medium text-warning-700 dark:text-warning-400">Risks</h4>
            <Badge variant="warning" size="sm">{risks.length}</Badge>
          </div>
          {risks.length > 0 ? (
            <ul className="space-y-2">
              {risks.slice(0, 5).map((item, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-warning-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No risks identified</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StrengthsWeaknessesRisks
