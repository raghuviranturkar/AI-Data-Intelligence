import React from 'react'
import { Database, BarChart3, Award, Brain, Clock, HardDrive, Settings, Calendar } from 'lucide-react'

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
    { label: 'Dataset', value: datasetName, icon: Database },
    { label: 'Rows', value: rows.toLocaleString(), icon: BarChart3 },
    { label: 'Columns', value: columns.toLocaleString(), icon: BarChart3 },
    { label: 'Quality Score', value: `${qualityScore}/100`, icon: Award },
    { label: 'Best Model', value: bestModel, icon: Brain },
    { label: 'Generation Time', value: '2.4s', icon: Clock },
    { label: 'File Size', value: '3.2 MB', icon: HardDrive },
    { label: 'Created At', value: generatedAt, icon: Calendar },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Metadata</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportMetadata
