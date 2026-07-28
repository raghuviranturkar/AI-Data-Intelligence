import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  )
}

export default Layout
