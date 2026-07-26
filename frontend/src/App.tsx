import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/Upload';

function App() {
  const [pipelineData, setPipelineData] = useState<any>(null);

  const handleDataLoaded = (data: any) => {
    console.log('Data loaded in App:', data);
    setPipelineData(data);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard data={pipelineData} />} />
            <Route path="/upload" element={<UploadPage onDataLoaded={handleDataLoaded} />} />
            <Route path="/analysis" element={<Dashboard data={pipelineData} />} />
            <Route path="/reports" element={<Dashboard data={pipelineData} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
