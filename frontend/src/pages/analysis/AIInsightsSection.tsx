import React from 'react'
import { Lightbulb, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, List } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AIInsightsSectionProps {
  executiveSummary: string
  strengths: string[]
  weaknesses: string[]
  risks: string[]
  recommendations: string[]
  nextSteps: string[]
  healthScore: {
    score: number
    confidence: string
  }
  className?: string
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  executiveSummary,
  strengths,
  weaknesses,
  risks,
  recommendations,
  nextSteps,
  healthScore,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h3>
        <Badge variant="info" size="sm">Business Intelligence</Badge>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI Health Score</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{healthScore.score}/100</p>
          </div>
          <Badge variant={healthScore.confidence === 'High' ? 'success' : 'warning'} size="md">
            {healthScore.confidence} Confidence
          </Badge>
        </div>
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {executiveSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strengths.length > 0 && (
          <div className="bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success-500" />
              <p className="font-medium text-success-700 dark:text-success-400">Strengths</p>
            </div>
            <ul className="space-y-1">
              {strengths.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-success-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {weaknesses.length > 0 && (
          <div className="bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-danger-500" />
              <p className="font-medium text-danger-700 dark:text-danger-400">Weaknesses</p>
            </div>
            <ul className="space-y-1">
              {weaknesses.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-danger-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {risks.length > 0 && (
          <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-warning-500" />
              <p className="font-medium text-warning-700 dark:text-warning-400">Risks</p>
            </div>
            <ul className="space-y-1">
              {risks.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-warning-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <p className="font-medium text-blue-700 dark:text-blue-400">Recommendations</p>
            </div>
            <ul className="space-y-1">
              {recommendations.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {nextSteps.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <List className="h-4 w-4 text-gray-500" />
            <p className="font-medium text-gray-700 dark:text-gray-300">Next Steps</p>
          </div>
          <ul className="space-y-1">
            {nextSteps.map((step, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <span className="text-gray-400">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AIInsightsSection
