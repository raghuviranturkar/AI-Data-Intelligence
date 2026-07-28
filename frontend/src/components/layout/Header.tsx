import React from 'react'
import { Bell, User, Search } from 'lucide-react'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard' }) => {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <Badge variant="success" size="sm">Live</Badge>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger-500"></span>
            </span>
          </button>
          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
