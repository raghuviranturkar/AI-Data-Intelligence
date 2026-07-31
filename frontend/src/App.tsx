import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/Upload'
import AnalysisPage from './pages/analysis/AnalysisPage'
import { VisualizationsPage } from './pages/visualizations'
import { ModelsPage } from './pages/models'
import { ExplainabilityPage } from './pages/explainability'
import { ReportsPage } from './pages/reports'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/visualizations" element={<VisualizationsPage />} />
              <Route path="/models" element={<ModelsPage />} />
              <Route path="/explainability" element={<ExplainabilityPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<Dashboard />} />
            </Routes>
          </Layout>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
