import React from 'react'
import { Info, Database, BarChart3, Award, Brain, Clock } from 'lucide-react'

interface ReportMetadataProps {
  datasetName: string
  rows: number
  columns: number
  qualityScore: number
  bestModel: string
  generatedAt: string
}

const ReportMetadata: React.FC<ReportMetadataProps> = ({
  datasetName,
  rows,
  columns,
  qualityScore,
  bestModel,
  generatedAt,
}) => {
  const items = [
    { label: 'Dataset', value: datasetName, icon: <Database className="h-4 w-4" /> },
    { label: 'Rows', value: rows.toLocaleString(), icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Columns', value: columns.toLocaleString(), icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Quality Score', value: `${qualityScore}/100`, icon: <Award className="h-4 w-4" /> },
    { label: 'Best Model', value: bestModel, icon: <Brain className="h-4 w-4" /> },
    { label: 'Generated At', value: generatedAt, icon: <Clock className="h-4 w-4" /> },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Metadata</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">{item.icon}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportMetadata
