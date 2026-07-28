import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/Upload'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/analysis" element={<Dashboard />} />
              <Route path="/visualizations" element={<Dashboard />} />
              <Route path="/models" element={<Dashboard />} />
              <Route path="/explainability" element={<Dashboard />} />
              <Route path="/insights" element={<Dashboard />} />
              <Route path="/reports" element={<Dashboard />} />
              <Route path="/settings" element={<Dashboard />} />
            </Routes>
          </Layout>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
