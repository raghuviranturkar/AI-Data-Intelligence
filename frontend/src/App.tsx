import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/Upload'
import AnalysisPage from './pages/analysis/AnalysisPage'
import TestPage from './pages/TestPage'

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
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </Layout>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
