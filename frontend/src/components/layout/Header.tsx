import React from 'react'
import { Bell, User, Search, Menu } from 'lucide-react'
import { Badge } from '../common/Badge'
import ThemeToggle from '../common/ThemeToggle'
import { cn } from '../../utils/cn'

interface HeaderProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  title?: string
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed, title = 'Dashboard' }) => {
  return (
    <header 
      className={cn(
        'fixed top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out',
        collapsed ? 'left-16' : 'left-64',
        'right-0'
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-500 dark:text-gray-400 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
          <Badge variant="success" size="sm" className="hidden sm:inline-flex">Live</Badge>
        </div>

        {/* Center Section - Search (placeholder) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search datasets, models, insights..."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 transition-colors"
              disabled
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <ThemeToggle />
          <button className="relative rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
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
