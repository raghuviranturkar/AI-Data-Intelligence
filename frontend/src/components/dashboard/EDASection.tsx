import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';

interface EDASectionProps {
  edaData: any;
}

const EDASection: React.FC<EDASectionProps> = ({ edaData }) => {
  const overview = edaData?.overview || {};
  const correlations = edaData?.correlation || {};
  const strongCorrelations = correlations?.strong_correlations?.strong_correlations || [];

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Exploratory Data Analysis (EDA)</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-primary-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Numeric Features</p>
          <p className="text-xl font-bold text-primary-700">{overview.numeric_features || 0}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Categorical Features</p>
          <p className="text-xl font-bold text-green-700">{overview.categorical_features || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Target Column</p>
          <p className="text-sm font-bold text-purple-700 truncate">{overview.target_column || 'N/A'}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Strong Correlations</p>
          <p className="text-xl font-bold text-yellow-700">{strongCorrelations.length}</p>
        </div>
      </div>

      {/* Strong Correlations */}
      {strongCorrelations.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Strong Relationships Found</h4>
          <div className="space-y-2">
            {strongCorrelations.slice(0, 3).map((corr: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{corr.feature_1}</span>
                  <span className="text-gray-400">↔</span>
                  <span className="text-sm font-medium text-gray-700">{corr.feature_2}</span>
                </div>
                <span className={`text-sm font-medium ${
                  corr.correlation > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EDASection;
