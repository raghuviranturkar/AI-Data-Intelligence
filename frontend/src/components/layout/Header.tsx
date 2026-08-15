import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, Search, Menu, Settings, LogOut, HelpCircle, Sparkles } from 'lucide-react'
import { Badge } from '../common/Badge'
import ThemeToggle from '../common/ThemeToggle'
import { cn } from '../../utils/cn'
import { useAuth } from '../../context/AuthContext'

interface HeaderProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  title?: string
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed, title = 'Dashboard' }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const colors = {
    border: isDark ? '#232B35' : '#E2E8F0',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      azure: '#4EA1F0',
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setShowUserMenu(false)
  }

  const handleSettingsClick = () => {
    navigate('/settings')
    setShowUserMenu(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowUserMenu(false)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Simple search simulation - can be expanded
    if (query.length > 0) {
      const results = [
        { name: 'Datasets', path: '/datasets' },
        { name: 'Analysis', path: '/analysis' },
        { name: 'Models', path: '/models' },
        { name: 'Reports', path: '/reports' },
        { name: 'Visualizations', path: '/visualizations' },
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleSearchResultClick = (path: string) => {
    navigate(path)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      setSearchResults([])
    }
  }

  return (
    <header 
      className={cn(
        'fixed top-0 z-30 h-16 border-b transition-all duration-300 ease-in-out',
        collapsed ? 'left-16' : 'left-64',
        'right-0'
      )}
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md transition-colors duration-200 flex-shrink-0 hover:opacity-80"
            style={{ color: colors.textMuted }}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-semibold tracking-tight truncate" style={{ color: colors.text }}>
              {title}
            </h1>
            <Badge variant="success" size="sm" className="hidden sm:inline-flex">Live</Badge>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder="Search datasets, models, insights..."
              className="w-full rounded-md border pl-10 pr-4 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
                placeholder: colors.textMuted,
              }}
            />
            <kbd 
              className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-mono"
              style={{ 
                backgroundColor: colors.panel,
                borderColor: colors.border,
                color: colors.textMuted 
              }}
            >
              ⌘K
            </kbd>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 rounded-md border shadow-lg overflow-hidden z-50"
                style={{ 
                  backgroundColor: colors.panel,
                  borderColor: colors.border
                }}
              >
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchResultClick(result.path)}
                    className="w-full text-left px-4 py-2.5 transition-colors hover:opacity-80 flex items-center gap-2"
                    style={{ 
                      borderBottom: index < searchResults.length - 1 ? `1px solid ${colors.border}` : 'none'
                    }}
                  >
                    <Search className="h-3.5 w-3.5" style={{ color: colors.textMuted }} />
                    <span className="text-sm font-mono" style={{ color: colors.text }}>{result.name}</span>
                    <span className="text-[10px] font-mono ml-auto" style={{ color: colors.textDim }}>⌘+{index + 1}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <ThemeToggle />
          
          <button className="relative rounded-md p-2 transition-colors duration-200 hover:opacity-80">
            <Bell className="h-5 w-5" style={{ color: colors.textMuted }} />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: colors.accent.coral }}></span>
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: colors.accent.coral }}></span>
            </span>
          </button>

          {/* User Menu */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-md p-1.5 transition-colors duration-200 hover:opacity-80"
              style={{ 
                backgroundColor: showUserMenu ? colors.panelAlt : 'transparent',
                border: showUserMenu ? `1px solid ${colors.border}` : 'none'
              }}
            >
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <User className="h-4 w-4" style={{ color: colors.accent.amber }} />
              </div>
              <span className="hidden sm:inline-block text-sm font-medium max-w-[100px] truncate" style={{ color: colors.text }}>
                {user?.name || 'User'}
              </span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-md border shadow-lg overflow-hidden z-50"
                style={{ 
                  backgroundColor: colors.panel,
                  borderColor: colors.border
                }}
              >
                <div 
                  className="px-4 py-3 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <p className="text-sm font-semibold" style={{ color: colors.text }}>
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs font-mono" style={{ color: colors.textMuted }}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center gap-3 hover:opacity-80"
                    style={{ color: colors.textMuted }}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center gap-3 hover:opacity-80"
                    style={{ color: colors.textMuted }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center gap-3 hover:opacity-80 opacity-60 cursor-not-allowed"
                    style={{ color: colors.textMuted }}
                    disabled
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </button>
                </div>

                <div 
                  className="border-t py-1"
                  style={{ borderColor: colors.border }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center gap-3 hover:opacity-80"
                    style={{ color: colors.accent.coral }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
