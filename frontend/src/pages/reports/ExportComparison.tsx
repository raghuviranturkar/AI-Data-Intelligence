import React from 'react'
import { Check, X } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const comparisonData = [
  { feature: 'Printable', pdf: true, html: true, markdown: false },
  { feature: 'Interactive', pdf: false, html: true, markdown: false },
  { feature: 'GitHub Friendly', pdf: false, html: false, markdown: true },
  { feature: 'Charts', pdf: true, html: true, markdown: false },
  { feature: 'Sharing', pdf: true, html: true, markdown: true },
  { feature: 'Email Ready', pdf: true, html: false, markdown: false },
]

const ExportComparison: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Formats Comparison</h3>
        <Badge variant="info" size="sm">3 Formats</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Feature</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">PDF</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">HTML</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Markdown</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{row.feature}</td>
                <td className="px-3 py-2 text-center">
                  {row.pdf ? <Check className="h-4 w-4 text-success-500 mx-auto" /> : <X className="h-4 w-4 text-gray-400 mx-auto" />}
                </td>
                <td className="px-3 py-2 text-center">
                  {row.html ? <Check className="h-4 w-4 text-success-500 mx-auto" /> : <X className="h-4 w-4 text-gray-400 mx-auto" />}
                </td>
                <td className="px-3 py-2 text-center">
                  {row.markdown ? <Check className="h-4 w-4 text-success-500 mx-auto" /> : <X className="h-4 w-4 text-gray-400 mx-auto" />}
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
