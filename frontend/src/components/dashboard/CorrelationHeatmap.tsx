import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CorrelationHeatmapProps {
  correlationData: any;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ correlationData }) => {
  const [showAll, setShowAll] = useState(false);
  
  const matrix = correlationData?.matrix || {};
  const columns = Object.keys(matrix);
  
  if (columns.length === 0) {
    return (
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Correlation Matrix</h3>
        <p className="text-gray-500 text-sm">No correlation data available</p>
      </div>
    );
  }

  // Get top correlations
  const allCorrelations: {col1: string, col2: string, value: number}[] = [];
  for (const col1 of columns) {
    for (const col2 of Object.keys(matrix[col1] || {})) {
      if (col1 !== col2) {
        allCorrelations.push({
          col1,
          col2,
          value: Math.abs(matrix[col1][col2])
        });
      }
    }
  }
  
  // Sort by absolute correlation value
  allCorrelations.sort((a, b) => b.value - a.value);
  
  // Get top 5 correlations
  const topCorrelations = allCorrelations.slice(0, 5);
  const displayCorrelations = showAll ? allCorrelations : topCorrelations;

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Correlation Matrix</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-gray-500 font-medium py-2">Feature 1</th>
              <th className="text-left text-gray-500 font-medium py-2">Feature 2</th>
              <th className="text-right text-gray-500 font-medium py-2">Correlation</th>
            </tr>
          </thead>
          <tbody>
            {displayCorrelations.map((corr, i) => {
              const absValue = Math.abs(corr.value);
              let color = 'bg-gray-200';
              let textColor = 'text-gray-600';
              
              if (absValue > 0.7) {
                color = 'bg-green-500';
                textColor = 'text-white';
              } else if (absValue > 0.4) {
                color = 'bg-yellow-400';
                textColor = 'text-gray-900';
              } else {
                color = 'bg-gray-300';
                textColor = 'text-gray-600';
              }
              
              return (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{corr.col1}</td>
                  <td className="py-2 text-gray-600">↔</td>
                  <td className="py-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${textColor} ${color}`}>
                      {corr.value.toFixed(3)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {allCorrelations.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All ({allCorrelations.length})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CorrelationHeatmap;
