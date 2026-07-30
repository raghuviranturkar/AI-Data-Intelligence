import React from 'react'

interface DatasetSplitDisplayProps {
  datasetSplit: any
}

const DatasetSplitDisplay: React.FC<DatasetSplitDisplayProps> = ({ datasetSplit }) => {
  const trainSize = datasetSplit?.train_size || 0
  const valSize = datasetSplit?.validation_size || 0
  const testSize = datasetSplit?.test_size || 0
  const total = trainSize + valSize + testSize

  if (total === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dataset Split</h3>
        <p className="text-gray-400 dark:text-gray-500">No dataset split data available</p>
      </div>
    )
  }

  const trainPct = (trainSize / total * 100).toFixed(0)
  const valPct = (valSize / total * 100).toFixed(0)
  const testPct = (testSize / total * 100).toFixed(0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dataset Split</h3>
      <div className="space-y-4">
        <div className="flex h-8 w-full overflow-hidden rounded-lg">
          <div className="bg-primary-600 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${trainPct}%` }}>
            {trainPct}%
          </div>
          <div className="bg-primary-400 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${valPct}%` }}>
            {valPct}%
          </div>
          <div className="bg-primary-300 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${testPct}%` }}>
            {testPct}%
          </div>
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary-600" />
            <span className="text-gray-600 dark:text-gray-300">Train ({trainPct}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary-400" />
            <span className="text-gray-600 dark:text-gray-300">Validation ({valPct}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary-300" />
            <span className="text-gray-600 dark:text-gray-300">Test ({testPct}%)</span>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 dark:text-gray-500">
          Total: {total} samples
        </div>
      </div>
    </div>
  )
}

export default DatasetSplitDisplay
