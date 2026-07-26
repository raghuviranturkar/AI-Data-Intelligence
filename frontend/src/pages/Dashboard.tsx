import React from 'react';
import { Database, Award, Activity, Brain, FileText } from 'lucide-react';

interface DashboardProps {
  data?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Extract data from the pipeline result
  const dataset = data?.dataset || {};
  const validation = data?.validation || {};
  const quality = validation?.quality || {};
  const automl = data?.automl || {};
  const insights = data?.insights || {};
  
  const qualityScore = quality?.quality_score || 0;
  const healthScore = insights?.ai_health_score?.score || 0;
  const bestModel = automl?.best_model?.name || 'N/A';
  const rows = dataset?.shape?.rows || 0;
  const columns = dataset?.shape?.columns || 0;
  const modelsTrained = automl?.models_trained || 0;
  const warnings = quality?.total_warnings || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your data intelligence analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Dataset</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{rows}</p>
              <p className="text-xs text-gray-400 mt-1">{columns} columns</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-50 text-primary-600">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Quality Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{qualityScore}/100</p>
              {warnings > 0 && (
                <p className="text-xs text-yellow-600 mt-1">{warnings} warnings</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${qualityScore >= 80 ? 'bg-green-50 text-green-600' : qualityScore >= 50 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">AI Health Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{healthScore}/100</p>
              <p className="text-xs text-gray-400 mt-1">{insights?.ai_health_score?.confidence || 'N/A'} confidence</p>
            </div>
            <div className={`p-3 rounded-lg ${healthScore >= 80 ? 'bg-green-50 text-green-600' : healthScore >= 50 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Best Model</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{bestModel}</p>
              <p className="text-xs text-gray-400 mt-1">{modelsTrained} models trained</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-50 text-primary-600">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {!data && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md p-8">
          <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Upload a dataset to see analysis results</p>
          <a href="/upload" className="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Upload Dataset
          </a>
        </div>
      )}

      {data && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recommendations */}
          {insights?.recommendations && insights.recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {insights.recommendations.slice(0, 3).map((rec: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Model Rankings */}
          {automl?.ranked_models && automl.ranked_models.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Model Performance</h3>
              <div className="space-y-2">
                {automl.ranked_models.slice(0, 3).map((model: any) => (
                  <div key={model.model_name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">#{model.rank}</span>
                      <span className="font-medium text-gray-900">{model.model_name}</span>
                    </div>
                    <span className="text-sm text-gray-600">Score: {model.score.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
