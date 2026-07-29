import React from 'react'
import { X, Trophy, Award, Medal, Clock, TrendingUp, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { cn } from '../../utils/cn'

interface ModelDetails {
  name: string
  rank: number
  score: number
  cvScore: number
  trainingTime: number
  metrics?: Record<string, number>
  strengths?: string[]
  weaknesses?: string[]
  selectedReason?: string
}

interface ModelDetailsModalProps {
  model: ModelDetails | null
  isOpen: boolean
  onClose: () => void
}

const ModelDetailsModal: React.FC<ModelDetailsModalProps> = ({
  model,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !model) return null

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2: return <Award className="h-6 w-6 text-gray-400" />
      case 3: return <Medal className="h-6 w-6 text-amber-600" />
      default: return <span className="text-lg font-bold text-gray-400">{rank}</span>
    }
  }

  const getScoreColor = (score: number) => {
    if (score > 0.8) return 'text-success-500'
    if (score > 0.6) return 'text-warning-500'
    return 'text-danger-500'
  }

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1: return 'Best Model'
      case 2: return 'Runner Up'
      case 3: return 'Third Place'
      default: return `Rank #${rank}`
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {getRankIcon(model.rank)}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {model.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getRankLabel(model.rank)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
              <p className={cn('text-2xl font-bold', getScoreColor(model.score))}>
                {model.score.toFixed(3)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">CV Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {model.cvScore.toFixed(3)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Training Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {model.trainingTime.toFixed(2)}s
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                #{model.rank}
              </p>
            </div>
          </div>

          {/* Metrics Detail */}
          {model.metrics && Object.keys(model.metrics).length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(model.metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{key}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {typeof value === 'number' ? value.toFixed(3) : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.strengths && model.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold text-success-600 dark:text-success-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {model.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-success-500">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {model.weaknesses && model.weaknesses.length > 0 && (
              <div>
                <h4 className="font-semibold text-danger-600 dark:text-danger-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Weaknesses
                </h4>
                <ul className="space-y-1">
                  {model.weaknesses.map((weakness, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-danger-500">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Selection Reason */}
          {model.selectedReason && (
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
              <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-1">
                Why this model was selected
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {model.selectedReason}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ModelDetailsModal
