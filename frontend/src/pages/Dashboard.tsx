import React from 'react';
import { Database, Award, Activity, Brain } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import ProcessingTimeline from '../components/dashboard/ProcessingTimeline';
import EDASection from '../components/dashboard/EDASection';
import CorrelationHeatmap from '../components/dashboard/CorrelationHeatmap';
import DownloadSection from '../components/dashboard/DownloadSection';

interface DashboardProps {
  data?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const dataset = data?.dataset || {};
  const validation = data?.validation || {};
  const quality = validation?.quality || {};
  const automl = data?.automl || {};
  const insights = data?.insights || {};
  const eda = data?.eda || {};
  
  const qualityScore = quality?.quality_score || 0;
  const healthScore = insights?.ai_health_score?.score || 0;
  const bestModel = automl?.best_model?.name || 'N/A';
  const rows = dataset?.shape?.rows || 0;
  const columns = dataset?.shape?.columns || 0;
  const modelsTrained = automl?.models_trained || 0;
  const warnings = quality?.total_warnings || 0;

  // Timeline steps
  const timelineSteps = [
    { id: 'upload', label: 'Upload Dataset', status: data ? 'complete' : 'pending' },
    { id: 'validation', label: 'Data Validation', status: data ? 'complete' : 'pending' },
    { id: 'eda', label: 'Exploratory Data Analysis', status: data ? 'complete' : 'pending' },
    { id: 'automl', label: 'AutoML Training', status: data ? 'complete' : 'pending' },
    { id: 'insights', label: 'AI Insights Generation', status: data ? 'complete' : 'pending' },
    { id: 'report', label: 'Report Ready', status: data ? 'complete' : 'pending' },
  ];

  if (!data) {
    return (
      <div className="p-4 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Upload a dataset to start the analysis</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <div className="text-center py-12 bg-white rounded-lg shadow-md p-8">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No data loaded yet</p>
              <a href="/upload" className="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Upload Dataset
              </a>
            </div>
          </div>
          <div className="col-span-1">
            <ProcessingTimeline steps={timelineSteps} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your data intelligence analysis</p>
      </div>

      {/* Metrics Grid */}
      <div className="dashboard-grid mb-6 sm:mb-8">
        <MetricCard
          title="Dataset"
          value={rows}
          icon={<Database className="w-5 h-5 sm:w-6 sm:h-6" />}
          subtitle={`${columns} columns`}
        />
        <MetricCard
          title="Quality Score"
          value={`${qualityScore}/100`}
          icon={<Award className="w-5 h-5 sm:w-6 sm:h-6" />}
          color={qualityScore >= 80 ? 'text-green-600' : qualityScore >= 50 ? 'text-yellow-600' : 'text-red-600'}
        />
        <MetricCard
          title="AI Health Score"
          value={`${healthScore}/100`}
          icon={<Activity className="w-5 h-5 sm:w-6 sm:h-6" />}
          color={healthScore >= 80 ? 'text-green-600' : healthScore >= 50 ? 'text-yellow-600' : 'text-red-600'}
          subtitle={`${insights?.ai_health_score?.confidence || 'N/A'} confidence`}
        />
        <MetricCard
          title="Best Model"
          value={bestModel}
          icon={<Brain className="w-5 h-5 sm:w-6 sm:h-6" />}
          subtitle={`${modelsTrained} models trained`}
        />
      </div>

      {/* Two Column Grid */}
      <div className="two-col-grid mb-6">
        {/* Quality Section */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Data Quality</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Quality Score</span>
                <span className="font-medium">{qualityScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    qualityScore >= 80 ? 'bg-green-500' : 
                    qualityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${qualityScore}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Warnings: <span className="font-medium">{warnings}</span>
            </div>
            <div className="text-sm text-gray-600">
              Status: <span className="font-medium text-green-600">Ready for analysis</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <ProcessingTimeline steps={timelineSteps} />
      </div>

      {/* EDA and Correlation */}
      <div className="two-col-grid mb-6">
        <EDASection edaData={eda} />
        <CorrelationHeatmap correlationData={eda?.correlation} />
      </div>

      {/* AutoML Leaderboard */}
      {automl?.ranked_models && automl.ranked_models.length > 0 && (
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Model Performance Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">Rank</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Model</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Score</th>
                  <th className="text-right py-2 text-gray-500 font-medium">CV Score</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Training Time</th>
                </tr>
              </thead>
              <tbody>
                {automl.ranked_models.map((model: any) => (
                  <tr key={model.model_name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 font-medium">
                      {model.rank === 1 ? '🥇' : model.rank === 2 ? '🥈' : model.rank === 3 ? '🥉' : `#${model.rank}`}
                    </td>
                    <td className="py-2 font-medium">{model.model_name}</td>
                    <td className="py-2 text-right">{model.score.toFixed(3)}</td>
                    <td className="py-2 text-right">{model.cv_score.toFixed(3)}</td>
                    <td className="py-2 text-right">{model.training_time.toFixed(2)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights Section */}
      {insights && (
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Executive Summary</h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{insights.executive_summary}</p>
          
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Key Recommendations</h4>
              <ul className="space-y-1">
                {insights.recommendations.slice(0, 3).map((rec: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Download Section */}
      <DownloadSection data={data} />
    </div>
  );
};

export default Dashboard;
