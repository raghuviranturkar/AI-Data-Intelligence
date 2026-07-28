import React from 'react'
import { Bell, User } from 'lucide-react'
import { Badge } from '../common/Badge'
import ThemeToggle from '../common/ThemeToggle'

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard' }) => {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            {title}
          </h1>
          <Badge variant="success" size="sm">Live</Badge>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="relative rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger-500"></span>
            </span>
          </button>
          <button className="rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
