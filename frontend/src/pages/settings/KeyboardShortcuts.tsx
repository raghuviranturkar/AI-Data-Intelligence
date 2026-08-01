import React from 'react'
import { Keyboard } from 'lucide-react'

const KeyboardShortcuts: React.FC = () => {
  const shortcuts = [
    { keys: ['Ctrl', 'U'], action: 'Upload Dataset' },
    { keys: ['Ctrl', 'R'], action: 'Generate Report' },
    { keys: ['Ctrl', 'D'], action: 'Dashboard' },
    { keys: ['Ctrl', 'M'], action: 'Models' },
    { keys: ['Ctrl', '/'], action: 'Search (coming soon)' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Keyboard className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
      </div>

      <div className="space-y-2">
        {shortcuts.map(({ keys, action }) => (
          <div key={action} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">{action}</span>
            <div className="flex gap-1">
              {keys.map((key, i) => (
                <span key={i} className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300">
                  {key}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeyboardShortcuts
