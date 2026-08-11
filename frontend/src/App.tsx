import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WorkspaceProvider } from './context/WorkspaceContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/Upload'
import AnalysisPage from './pages/analysis/AnalysisPage'
import { VisualizationsPage } from './pages/visualizations'
import { ModelsPage } from './pages/models'
import { ExplainabilityPage } from './pages/explainability'
import { ReportsPage } from './pages/reports'
import { SettingsPage } from './pages/settings'
import { AIInsightsPage } from './pages/ai-insights'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import WorkspacesPage from './pages/workspaces/WorkspacesPage'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
                <Route path="/workspaces" element={<ProtectedRoute><Layout><WorkspacesPage /></Layout></ProtectedRoute>} />
                <Route path="/ai-insights" element={<ProtectedRoute><Layout><AIInsightsPage /></Layout></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Layout><UploadPage /></Layout></ProtectedRoute>} />
                <Route path="/analysis" element={<ProtectedRoute><Layout><AnalysisPage /></Layout></ProtectedRoute>} />
                <Route path="/visualizations" element={<ProtectedRoute><Layout><VisualizationsPage /></Layout></ProtectedRoute>} />
                <Route path="/models" element={<ProtectedRoute><Layout><ModelsPage /></Layout></ProtectedRoute>} />
                <Route path="/explainability" element={<ProtectedRoute><Layout><ExplainabilityPage /></Layout></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><Layout><AIInsightsPage /></Layout></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WorkspaceProvider>
          </AuthProvider>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
