import React from 'react';
import { CheckCircle, Loader2, Clock } from 'lucide-react';

interface TimelineStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  timestamp?: string;
}

interface ProcessingTimelineProps {
  steps: TimelineStep[];
  currentStep?: number;
}

const ProcessingTimeline: React.FC<ProcessingTimelineProps> = ({ steps, currentStep = 0 }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />;
      case 'error':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'processing':
        return 'bg-primary-600 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Processing Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Step circle */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
                {getStatusIcon(step.status)}
              </div>
              
              {/* Step content */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    step.status === 'complete' ? 'text-gray-900' :
                    step.status === 'processing' ? 'text-primary-700' :
                    step.status === 'error' ? 'text-red-700' :
                    'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {step.timestamp && (
                    <span className="text-xs text-gray-400">{step.timestamp}</span>
                  )}
                </div>
                
                {/* Progress bar for active step */}
                {step.status === 'processing' && (
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-primary-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingTimeline;
