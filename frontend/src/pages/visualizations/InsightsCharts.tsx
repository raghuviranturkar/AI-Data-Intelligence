import React from 'react'
import { Lightbulb, CheckCircle, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface InsightsChartsProps {
  data: any
}

const InsightsCharts: React.FC<InsightsChartsProps> = ({ data }) => {
  const insights = data?.insights || {}
  const healthScore = insights?.ai_health_score || { score: 0, confidence: 'Unknown' }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Insights Visualization</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* AI Health Score */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center">
          <div className="w-32 h-32">
            <CircularProgressbar
              value={healthScore.score}
              text={`${healthScore.score}%`}
              styles={buildStyles({
                textColor: healthScore.score >= 70 ? '#22C55E' : '#F59E0B',
                pathColor: healthScore.score >= 70 ? '#22C55E' : '#F59E0B',
                trailColor: '#E5E7EB',
              })}
            />
          </div>
          <p className="mt-3 font-medium text-gray-900 dark:text-white">AI Health Score</p>
          <Badge variant={healthScore.confidence === 'High' ? 'success' : 'warning'} size="sm">
            {healthScore.confidence} Confidence
          </Badge>
        </div>

        {/* Strengths */}
        {insights?.strengths?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-success-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">Strengths</h3>
              <Badge variant="success" size="sm">{insights.strengths.length}</Badge>
            </div>
            <ul className="space-y-2">
              {insights.strengths.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-success-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {insights?.weaknesses?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-5 w-5 text-danger-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">Weaknesses</h3>
              <Badge variant="danger" size="sm">{insights.weaknesses.length}</Badge>
            </div>
            <ul className="space-y-2">
              {insights.weaknesses.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-danger-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {insights?.risks?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-warning-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">Risks</h3>
              <Badge variant="warning" size="sm">{insights.risks.length}</Badge>
            </div>
            <ul className="space-y-2">
              {insights.risks.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-warning-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {insights?.recommendations?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Key Recommendations</h3>
            <Badge variant="info" size="sm">{insights.recommendations.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.recommendations.slice(0, 4).map((item: string, i: number) => (
              <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InsightsCharts
