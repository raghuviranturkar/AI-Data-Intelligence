import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { Badge } from '../../components/common/Badge'

interface ModelComparisonChartsProps {
  data: any
}

const ModelComparisonCharts: React.FC<ModelComparisonChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const automl = data?.automl || {}
  const rankedModels = automl?.ranked_models || []
  const bestModel = automl?.best_model || {}

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
  }

  if (rankedModels.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Model Comparison</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No model data available</p>
        </div>
      </div>
    )
  }

  const chartData = rankedModels.map((model: any) => ({
    name: model.model_name,
    score: model.score,
    cvScore: model.cv_score || 0,
    isBest: model.rank === 1,
  }))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Model Comparison</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Model Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="name" stroke={colors.text} tick={{ fill: colors.text, fontSize: 11 }} interval={0} />
              <YAxis domain={[0, 1]} stroke={colors.text} tick={{ fill: colors.text }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ color: isDark ? '#94A3B8' : '#6B7280' }} />
              <Bar dataKey="score" name="Test Score" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cvScore" name="CV Score" fill="#818CF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {rankedModels.slice(0, 5).map((model: any) => (
              <div key={model.model_name} className={`p-3 rounded-lg ${model.rank === 1 ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400">#{model.rank}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{model.model_name}</span>
                  </div>
                  {model.rank === 1 && <Badge variant="success" size="sm">🏆 Best</Badge>}
                </div>
                <div className="flex items-center justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>Score: {model.score.toFixed(3)}</span>
                  <span>CV: {model.cv_score?.toFixed(3) || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelComparisonCharts
