import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { cn } from '../../utils/cn'

interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })
  const [isDark, setIsDark] = useState(false)

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
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed))
  }, [collapsed])

  const colors = {
    bg: isDark ? '#0B0F14' : '#F1F4F8',
    panel: isDark ? '#12181F' : '#FFFFFF',
    border: isDark ? '#232B35' : '#E2E8F0',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    accent: {
      amber: '#F0A94E',
    }
  }

  const gridBgStyle = isDark 
    ? {
        backgroundImage: 'linear-gradient(to right, rgba(237,241,245,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,241,245,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }
    : {
        backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }

  return (
    <div 
      className="min-h-screen transition-colors duration-300 relative"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <Sidebar collapsed={collapsed} />
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <main 
        className={cn(
          'min-h-screen transition-all duration-300 ease-in-out relative z-10',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="pt-16">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </div>
      </main>

      {/* Subtle corner accent - matching instrument panel style */}
      <div 
        className="fixed bottom-4 right-4 w-2 h-2 rounded-full pointer-events-none transition-colors duration-300"
        style={{ backgroundColor: colors.accent.amber }}
      />
    </div>
  )
}

export default Layout
