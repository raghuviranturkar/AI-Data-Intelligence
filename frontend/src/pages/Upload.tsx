import React, { useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '../components/common/Button'
import ProgressBar from '../components/common/ProgressBar'
import EmptyState from '../components/common/EmptyState'

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
    }
  }

  const handleUpload = () => {
    if (!file) return
    setUploading(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Upload Dataset</h2>
        <p className="text-gray-500 mt-1">Upload a CSV or Excel file to analyze</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              {file ? (
                <>
                  <FileSpreadsheet className="w-12 h-12 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.preventDefault()
                        setFile(null)
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Drop your file here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">Supports CSV, XLSX, XLS</p>
                  </div>
                </>
              )}
            </div>
          </label>
        </div>

        {uploading && (
          <div className="mt-6">
            <ProgressBar value={progress} label="Uploading..." />
          </div>
        )}

        {file && !uploading && (
          <Button
            onClick={handleUpload}
            size="lg"
            className="mt-6 w-full"
          >
            Upload & Analyze
          </Button>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Supported formats: CSV, XLSX, XLS</p>
        <p className="mt-1">Maximum file size: 100MB</p>
      </div>
    </div>
  )
}

export default UploadPage
