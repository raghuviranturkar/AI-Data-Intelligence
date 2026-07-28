import React from 'react'
import { 
  Database, 
  Award, 
  Activity, 
  Brain,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import MetricCard from '../components/cards/MetricCard'
import StatusCard from '../components/cards/StatusCard'
import InsightCard from '../components/cards/InsightCard'
import PipelineProgress from '../components/pipeline/PipelineProgress'
import { Button } from '../components/common/Button'
import ProgressBar from '../components/common/ProgressBar'

const sampleSteps = [
  { id: '1', label: 'Upload Dataset', status: 'completed' },
  { id: '2', label: 'Validation', status: 'completed' },
  { id: '3', label: 'Cleaning', status: 'completed' },
  { id: '4', label: 'EDA', status: 'running' },
  { id: '5', label: 'Feature Engineering', status: 'waiting' },
  { id: '6', label: 'AutoML', status: 'waiting' },
  { id: '7', label: 'Explainability', status: 'waiting' },
  { id: '8', label: 'Insights', status: 'waiting' },
]

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of your data intelligence analysis</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Dataset"
          value="0"
          icon={<Database className="h-6 w-6" />}
          subtitle="0 columns"
        />
        <MetricCard
          title="Quality Score"
          value="0/100"
          icon={<Award className="h-6 w-6" />}
        />
        <MetricCard
          title="AI Health Score"
          value="0/100"
          icon={<Activity className="h-6 w-6" />}
          subtitle="No data"
        />
        <MetricCard
          title="Best Model"
          value="N/A"
          icon={<Brain className="h-6 w-6" />}
          subtitle="0 models trained"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline Progress */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Progress</h3>
          <PipelineProgress steps={sampleSteps} currentStep={3} />
        </div>

        {/* Status & Quality */}
        <div className="space-y-4">
          <StatusCard
            title="Dataset Ready"
            status="success"
            message="No issues detected. Ready for analysis."
          />
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Data Quality</h4>
            <ProgressBar value={85} label="Quality Score" variant="success" />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InsightCard
          title="Strong Correlation Detected"
          description="Salary and experience show a strong positive correlation (r=0.93)."
          type="positive"
        />
        <InsightCard
          title="High Cardinality Warning"
          description="Column 'customer_id' has 100 unique values, may need encoding."
          type="negative"
        />
      </div>

      {/* Action */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="lg">
            Upload Dataset
          </Button>
          <Button variant="outline" size="lg">
            View Reports
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
