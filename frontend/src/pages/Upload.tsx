import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { uploadDataset } from '../services/api';
import {
  Upload,
  FileSpreadsheet,
  FileJson,
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Clock,
  Brain,
  Shield,
  Lightbulb,
  FileText,
  BarChart3,
  Settings,
  Activity,
  Sparkles,
  X,
  Info,
  Gauge,
  Target,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

// --- Design tokens with light/dark mode support ---
const getColors = (isDark: boolean) => ({
  bg: isDark ? '#0B0F14' : '#F1F4F8',
  panel: isDark ? '#12181F' : '#FFFFFF',
  panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
  border: isDark ? '#232B35' : '#E2E8F0',
  text: isDark ? '#EDF1F5' : '#0F172A',
  textMuted: isDark ? '#8B96A5' : '#64748B',
  textDim: isDark ? '#4A5563' : '#94A3B8',
  accent: {
    amber: '#F0A94E',
    teal: '#3ECF8E',
    coral: '#F2555A',
    azure: '#4EA1F0',
    purple: '#B48CF2',
  }
});

const PROGRESS_SEGMENTS = 28;

// Format file size helper
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// --- Toast Component ---
const Toast: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const colors = getColors(isDark);
  
  const accent = {
    success: colors.accent.teal,
    error: colors.accent.coral,
    info: colors.accent.azure,
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: accent.success }} />,
    error: <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: accent.error }} />,
    info: <Info className="h-4 w-4 flex-shrink-0" style={{ color: accent.info }} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={`border rounded-md pl-3 pr-2 py-2.5 flex items-center gap-3 shadow-2xl max-w-2xl mx-auto ${
        isDark 
          ? 'bg-[#12181F] border-[#232B35]' 
          : 'bg-white border-gray-200'
      }`}
      style={{ borderLeft: `2px solid ${accent[type]}` }}
    >
      {icons[type]}
      <span className={`text-sm flex-1 font-medium ${isDark ? 'text-[#EDF1F5]' : 'text-gray-900'}`}>
        {message}
      </span>
      <button
        onClick={onClose}
        className={`${isDark ? 'text-[#8B96A5] hover:text-[#EDF1F5]' : 'text-gray-400 hover:text-gray-600'} transition-colors flex-shrink-0 p-1`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};

// --- Pipeline Stage Interface ---
interface PipelineStage {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'waiting' | 'running' | 'completed' | 'error';
}

// --- Main Component ---
const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { setData, setIsLoading } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [datasetPreview, setDatasetPreview] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Check dark mode
  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const colors = getColors(isDark);

  // Pipeline stages
  const initialStages: PipelineStage[] = [
    { id: 'upload', label: 'Upload', icon: <Upload className="h-4 w-4" />, status: 'waiting' },
    { id: 'validation', label: 'Validate', icon: <Shield className="h-4 w-4" />, status: 'waiting' },
    { id: 'cleaning', label: 'Clean', icon: <Zap className="h-4 w-4" />, status: 'waiting' },
    { id: 'eda', label: 'Explore', icon: <BarChart3 className="h-4 w-4" />, status: 'waiting' },
    { id: 'feature', label: 'Features', icon: <Settings className="h-4 w-4" />, status: 'waiting' },
    { id: 'automl', label: 'AutoML', icon: <Brain className="h-4 w-4" />, status: 'waiting' },
    { id: 'insights', label: 'Insights', icon: <Lightbulb className="h-4 w-4" />, status: 'waiting' },
    { id: 'reports', label: 'Reports', icon: <FileText className="h-4 w-4" />, status: 'waiting' },
  ];

  const [pipelineStages, setPipelineStages] = useState(initialStages);

  // --- Handlers ---
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = ['.csv', '.xlsx', '.xls', '.json', '.parquet'];
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(ext || '')) {
      showToast('Unsupported file format. Use CSV, Excel, JSON, or Parquet.', 'error');
      return;
    }

    if (selectedFile.size > 200 * 1024 * 1024) {
      showToast('File too large. Max size: 200MB.', 'error');
      return;
    }

    resetState();
    setFile(selectedFile);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const resetState = () => {
    setErrorMsg(null);
    setStatus('idle');
    setDatasetPreview(null);
    setProgress(0);
    setCurrentStage(0);
    setPipelineStages(initialStages.map(s => ({ ...s, status: 'waiting' })));
    setLogs([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  const simulatePipeline = async () => {
    setStatus('analyzing');
    addLog('Starting AI pipeline...');

    const stageLabels = [
      'Validating data...',
      'Cleaning data...',
      'Exploring patterns...',
      'Engineering features...',
      'Training models...',
      'Generating insights...',
      'Creating reports...'
    ];

    for (let i = 0; i < stageLabels.length; i++) {
      const stageIndex = i + 1;

      setPipelineStages(prev => prev.map((s, idx) =>
        idx === stageIndex ? { ...s, status: 'running' } : s
      ));
      setCurrentStage(stageIndex);

      addLog(stageLabels[i]);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      setPipelineStages(prev => prev.map((s, idx) =>
        idx === stageIndex ? { ...s, status: 'completed' } : s
      ));

      setProgress(35 + ((i + 1) / stageLabels.length) * 60);
    }

    setProgress(100);
    addLog('Pipeline complete.');
    setStatus('complete');
    setCurrentStage(pipelineStages.length - 1);
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a file first.', 'error');
      return;
    }

    setUploading(true);
    setStatus('uploading');
    setProgress(10);
    setIsLoading(true);
    addLog(`Uploading ${file.name}...`);

    try {
      const result = await uploadDataset(file);
      setProgress(30);
      addLog('Upload complete.');

      setPipelineStages(prev => prev.map((s, idx) =>
        idx === 0 ? { ...s, status: 'completed' } : s
      ));
      setCurrentStage(1);

      setDatasetPreview({
        rows: result?.dataset?.shape?.rows || 0,
        columns: result?.dataset?.shape?.columns || 0,
        size: file.size,
        qualityScore: result?.validation?.quality?.quality_score || 0,
        target: result?.automl?.target_column || 'Auto-detected',
      });

      setData(result);
      await simulatePipeline();
      showToast('Dataset analyzed successfully!', 'success');
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setErrorMsg(errorMessage);
      addLog(`Error: ${errorMessage}`);
      showToast(errorMessage, 'error');
    } finally {
      setUploading(false);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetState();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNavigateToDashboard = () => {
    navigate('/');
  };

  const getFileIcon = (fileName: string) => {
    const ext = '.' + fileName.split('.').pop()?.toLowerCase();
    const iconClass = "h-8 w-8";
    if (ext === '.csv') return <FileSpreadsheet className={iconClass} style={{ color: colors.accent.teal }} />;
    if (ext === '.xlsx' || ext === '.xls') return <FileSpreadsheet className={iconClass} style={{ color: colors.accent.azure }} />;
    if (ext === '.json') return <FileJson className={iconClass} style={{ color: colors.accent.amber }} />;
    if (ext === '.parquet') return <Database className={iconClass} style={{ color: colors.accent.purple }} />;
    return <FileText className={iconClass} style={{ color: colors.textMuted }} />;
  };

  const filledSegments =
    status === 'uploading' || status === 'analyzing' || status === 'complete'
      ? Math.round((progress / 100) * PROGRESS_SEGMENTS)
      : 0;

  const gridBgStyle = isDark 
    ? {
        backgroundImage: 'linear-gradient(to right, rgba(237,241,245,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,241,245,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }
    : {
        backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      };

  return (
    <div 
      className={`min-h-screen p-3 sm:p-4 flex flex-col relative transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F14]' : 'bg-[#F1F4F8]'
      }`}
      style={gridBgStyle}
    >
      {/* Toast Container */}
      <div className="flex-shrink-0 relative z-20 sticky top-2">
        <AnimatePresence>
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

      {/* Main Container */}
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 gap-4 py-2">
        {/* Upload Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border p-4 sm:p-7 flex-shrink-0 transition-colors duration-300 ${
            isDark 
              ? 'bg-[#12181F] border-[#232B35]' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300"
                  style={{
                    backgroundColor:
                      status === 'complete' ? colors.accent.teal : status === 'error' ? colors.accent.coral : colors.accent.amber,
                    boxShadow:
                      status === 'analyzing' || status === 'uploading'
                        ? `0 0 0 4px ${colors.accent.amber}26`
                        : 'none',
                  }}
                />
                <span className={`text-[11px] font-mono uppercase tracking-[0.15em] ${
                  isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                }`}>
                  Dataset Intake
                </span>
              </div>
              <h2 className={`text-2xl font-bold tracking-tight ${
                isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'
              }`}>
                {status === 'complete' ? 'Analysis complete' : file ? 'Ready to analyze' : 'Upload dataset'}
              </h2>
              <p className={`text-sm mt-1 font-mono ${
                isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
              }`}>
                {status === 'complete'
                  ? 'Pipeline finished — results are ready to review.'
                  : file
                  ? `${file.name} · ${formatFileSize(file.size)}`
                  : 'Drop a file below or browse to select one'}
              </p>
            </div>
            {status === 'complete' && (
              <Button variant="primary" size="lg" onClick={handleNavigateToDashboard}>
                View Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}
          </div>

          {/* Drop Zone with corner-bracket frame */}
          <div
            ref={dropRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              'relative rounded-md p-5 sm:p-10 text-center transition-colors duration-300 min-h-[220px] flex items-center justify-center border',
              dragActive
                ? `border-[${colors.accent.amber}]/60 bg-[${colors.accent.amber}]/[0.04]`
                : status === 'complete'
                ? `border-[${colors.accent.teal}]/40 bg-[${colors.accent.teal}]/[0.03]`
                : isDark 
                  ? 'border-[#232B35] hover:border-[#3A4453]'
                  : 'border-gray-200 hover:border-gray-300'
            )}
            style={{
              borderColor: dragActive 
                ? colors.accent.amber 
                : status === 'complete' 
                ? colors.accent.teal 
                : isDark 
                  ? '#232B35' 
                  : '#E2E8F0'
            }}
          >
            {/* corner brackets */}
            {(['top-4 left-4 border-t border-l', 'top-4 right-4 border-t border-r', 'bottom-4 left-4 border-b border-l', 'bottom-4 right-4 border-b border-r'] as const).map((pos, i) => (
              <span
                key={i}
                className={cn('absolute w-4 h-4 pointer-events-none', pos)}
                style={{
                  borderColor: dragActive 
                    ? colors.accent.amber 
                    : status === 'complete' 
                    ? colors.accent.teal 
                    : isDark 
                      ? '#3A4453' 
                      : '#CBD5E1',
                }}
              />
            ))}

            {status === 'complete' ? (
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className={`w-16 h-16 border rounded-md flex items-center justify-center ${
                  isDark 
                    ? 'bg-[#3ECF8E]/10 border-[#3ECF8E]/30' 
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <CheckCircle className="h-8 w-8" style={{ color: colors.accent.teal }} />
                </div>
                <div className="text-left">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                    Ready to explore insights
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                    Open the dashboard to view detailed results
                  </p>
                </div>
                <Button variant="outline" size="lg" onClick={handleReset}>
                  Upload New File
                </Button>
              </div>
            ) : file ? (
              <div className="flex items-center justify-center gap-8 w-full flex-wrap">
                <div className={`w-16 h-16 rounded-md flex items-center justify-center border ${
                  isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                }`}>
                  {getFileIcon(file.name)}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className={`text-base font-semibold truncate max-w-lg ${
                    isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'
                  }`}>
                    {file.name}
                  </h3>
                  <p className={`text-sm font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {status === 'uploading' || status === 'analyzing' ? (
                  <div className="w-72">
                    <div className={`flex justify-between text-xs mb-2 font-mono uppercase tracking-wide ${
                      isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                    }`}>
                      <span>{status === 'uploading' ? 'Uploading' : 'Processing'}</span>
                      <span className="font-semibold" style={{ color: colors.accent.amber }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="flex gap-[3px]">
                      {Array.from({ length: PROGRESS_SEGMENTS }).map((_, idx) => (
                        <div
                          key={idx}
                          className="h-3 flex-1 rounded-[1px] transition-colors duration-200"
                          style={{
                            backgroundColor: idx < filledSegments ? colors.accent.amber : isDark ? '#232B35' : '#E2E8F0',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleUpload}
                      disabled={uploading}
                      className="min-w-[160px]"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          Analyze Now
                          <Zap className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleReset}>
                      Change File
                    </Button>
                  </div>
                )}

                {errorMsg && (
                  <div className={`p-3 rounded-md border ${
                    isDark 
                      ? 'bg-[#F2555A]/10 border-[#F2555A]/30' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-sm flex items-center gap-2 font-mono ${
                      isDark ? 'text-[#F2555A]' : 'text-red-600'
                    }`}>
                      <AlertCircle className="h-4 w-4" />
                      {errorMsg}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-10 flex-wrap">
                <div className={`w-16 h-16 border rounded-md flex items-center justify-center ${
                  isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                }`}>
                  <Upload className="h-7 w-7" style={{ color: colors.accent.amber }} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                    Drop your file here
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                    or use the button to browse
                  </p>
                </div>
                <Button variant="primary" size="lg" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-5 w-5 mr-2" />
                  Select File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.json,.parquet"
                  onChange={handleFileChange}
                />
                <div className={`flex gap-4 text-xs font-mono w-full justify-center pt-2 border-t mt-1 ${
                  isDark ? 'text-[#8B96A5] border-[#232B35]' : 'text-[#64748B] border-gray-200'
                }`}>
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="h-3.5 w-3.5" style={{ color: colors.accent.teal }} />
                    CSV
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="h-3.5 w-3.5" style={{ color: colors.accent.azure }} />
                    EXCEL
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileJson className="h-3.5 w-3.5" style={{ color: colors.accent.amber }} />
                    JSON
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5" style={{ color: colors.accent.purple }} />
                    PARQUET
                  </span>
                  <span className={isDark ? 'text-[#4A5563]' : 'text-gray-400'}>· 200MB max</span>
                </div>
              </div>
            )}
          </div>

          {/* Dataset Preview */}
          {datasetPreview && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 grid grid-cols-4 gap-3"
            >
              {[
                { label: 'Total Rows', value: datasetPreview.rows.toLocaleString(), icon: <Activity className="h-4 w-4" /> },
                { label: 'Total Columns', value: datasetPreview.columns, icon: <FileSpreadsheet className="h-4 w-4" /> },
                { label: 'Quality Score', value: `${datasetPreview.qualityScore}/100`, icon: <Gauge className="h-4 w-4" /> },
                { label: 'Target Column', value: datasetPreview.target, icon: <Target className="h-4 w-4" /> },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-md p-3.5 border ${
                    isDark 
                      ? 'bg-[#0B0F14] border-[#232B35]' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${
                    isDark ? 'text-[#5E6A78]' : 'text-[#64748B]'
                  }`}>
                    {stat.icon}
                    <span className="text-[10px] font-mono uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className={`text-xl font-bold truncate mt-1 font-mono ${
                    isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'
                  }`}>{stat.value}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Pipeline Track */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-lg border p-5 mt-4 flex-shrink-0 transition-colors duration-300 ${
            isDark 
              ? 'bg-[#12181F] border-[#232B35]' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 border rounded-md ${
                isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
              }`}>
                <Brain className="h-4 w-4" style={{ color: colors.accent.amber }} />
              </div>
              <div>
                <span className={`text-sm font-semibold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                  Pipeline
                </span>
                <p className={`text-[11px] font-mono ${isDark ? 'text-[#5E6A78]' : 'text-[#64748B]'}`}>
                  8 stages · sequential execution
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status === 'complete' && <Badge variant="success">Complete</Badge>}
              {status === 'analyzing' && <Badge variant="warning">Running</Badge>}
              {status === 'uploading' && <Badge variant="info">Uploading</Badge>}
              {status === 'idle' && <Badge variant="secondary">Ready</Badge>}
            </div>
          </div>

          {/* Stage track */}
          <div className="flex items-start justify-between gap-1 w-full">
            {pipelineStages.map((stage, index) => {
              const isCompleted = stage.status === 'completed';
              const isActive = stage.status === 'running';

              return (
                <div key={stage.id} className="flex items-start flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <span className={`text-[10px] font-mono mb-1.5 ${
                      isDark ? 'text-[#4A5563]' : 'text-gray-400'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div
                      className={cn(
                        'w-11 h-11 rounded-md flex items-center justify-center transition-all duration-300 border'
                      )}
                      style={{
                        backgroundColor: isCompleted
                          ? isDark ? 'rgba(62,207,142,0.10)' : 'rgba(62,207,142,0.08)'
                          : isActive
                          ? isDark ? 'rgba(240,169,78,0.10)' : 'rgba(240,169,78,0.08)'
                          : isDark ? '#0B0F14' : '#F8FAFC',
                        borderColor: isCompleted 
                          ? colors.accent.teal 
                          : isActive 
                          ? colors.accent.amber 
                          : isDark ? '#232B35' : '#E2E8F0',
                        color: isCompleted 
                          ? colors.accent.teal 
                          : isActive 
                          ? colors.accent.amber 
                          : isDark ? '#4A5563' : '#94A3B8',
                        boxShadow: isActive ? `0 0 0 3px ${colors.accent.amber}1F` : 'none',
                      }}
                    >
                      {isCompleted
                        ? <CheckCircle className="h-5 w-5" />
                        : isActive
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : stage.icon
                      }
                    </div>
                    <span
                      className="text-xs mt-2 font-medium truncate max-w-full"
                      style={{ 
                        color: isCompleted 
                          ? colors.accent.teal 
                          : isActive 
                          ? colors.accent.amber 
                          : isDark ? '#5E6A78' : '#94A3B8' 
                      }}
                    >
                      {stage.label}
                    </span>
                  </div>

                  {index < pipelineStages.length - 1 && (
                    <div className="flex-1 h-[1px] mx-1 mt-[35px]">
                      <div
                        className="h-full w-full transition-colors duration-500"
                        style={{ backgroundColor: isCompleted ? colors.accent.teal : isDark ? '#232B35' : '#E2E8F0' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Logs Console */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-lg border p-5 mt-4 flex-1 min-h-0 flex flex-col transition-colors duration-300 ${
            isDark 
              ? 'bg-[#12181F] border-[#232B35]' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 border rounded-md ${
                isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
              }`}>
                <Clock className="h-4 w-4" style={{ color: isDark ? '#8B96A5' : '#64748B' }} />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                  Live Logs
                </h3>
                <p className={`text-[11px] font-mono ${isDark ? 'text-[#5E6A78]' : 'text-[#64748B]'}`}>
                  Real-time processing output
                </p>
              </div>
              {logs.length > 0 && <Badge variant="info">{logs.length}</Badge>}
            </div>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="text-xs font-mono uppercase tracking-wide hover:opacity-80 transition-opacity"
              style={{ color: colors.accent.amber }}
            >
              {showLogs ? 'Hide' : 'Show'}
            </button>
          </div>

          <AnimatePresence>
            {showLogs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-4 flex-1 overflow-y-auto rounded-md p-4 border min-h-[120px] ${
                  isDark 
                    ? 'bg-[#0B0F14] border-[#232B35]' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {logs.length === 0 ? (
                  <p className={`text-center py-6 text-sm font-mono ${
                    isDark ? 'text-[#4A5563]' : 'text-gray-400'
                  }`}>
                    Logs will appear here during analysis
                  </p>
                ) : (
                  <>
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className={`text-[13px] py-1 font-mono leading-relaxed ${
                          isDark ? 'text-[#9BA6B3]' : 'text-gray-600'
                        }`}
                      >
                        <span style={{ color: colors.accent.teal }}>&gt;</span> {log}
                      </div>
                    ))}
                    {(status === 'uploading' || status === 'analyzing') && (
                      <span className="inline-block w-2 h-3.5 animate-pulse align-middle ml-4" 
                        style={{ backgroundColor: colors.accent.amber }} 
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;