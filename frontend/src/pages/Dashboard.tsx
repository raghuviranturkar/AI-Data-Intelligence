import React, { useState } from 'react'
import { 
  Database, 
  Award, 
  Activity, 
  Brain,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  BarChart3,
  Shield,
  Lightbulb
} from 'lucide-react'
import Card from '../components/common/Card'
import MetricCard from '../components/cards/MetricCard'
import InsightCard from '../components/cards/InsightCard'
import HorizontalPipeline from '../components/pipeline/HorizontalPipeline'
import { Button } from '../components/common/Button'
import { FeatureImportanceChart, ModelComparisonChart } from '../components/charts'

const sampleStages = [
  { id: 'upload', label: 'Upload', icon: <Database className="h-6 w-6" />, status: 'completed' as const },
  { id: 'validation', label: 'Validation', icon: <CheckCircle className="h-6 w-6" />, status: 'completed' as const },
  { id: 'cleaning', label: 'Cleaning', icon: <Activity className="h-6 w-6" />, status: 'completed' as const },
  { id: 'eda', label: 'EDA', icon: <TrendingUp className="h-6 w-6" />, status: 'completed' as const },
  { id: 'feature_engineering', label: 'Feature Eng.', icon: <Brain className="h-6 w-6" />, status: 'completed' as const },
  { id: 'automl', label: 'AutoML', icon: <Brain className="h-6 w-6" />, status: 'running' as const },
  { id: 'explainability', label: 'Explainability', icon: <Shield className="h-6 w-6" />, status: 'waiting' as const },
  { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="h-6 w-6" />, status: 'waiting' as const },
  { id: 'reports', label: 'Reports', icon: <FileText className="h-6 w-6" />, status: 'waiting' as const },
]

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Pipeline */}
      <HorizontalPipeline 
        stages={sampleStages} 
        currentStage={5} 
        overallProgress={65}
      />

      {/* Metrics - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Dataset"
          value="1,024"
          icon={<Database className="h-6 w-6" />}
          subtitle="12 columns"
        />
        <MetricCard
          title="Quality Score"
          value="94/100"
          icon={<Award className="h-6 w-6" />}
          subtitle="Excellent"
        />
        <MetricCard
          title="AI Health Score"
          value="82/100"
          icon={<Activity className="h-6 w-6" />}
          subtitle="High confidence"
        />
        <MetricCard
          title="Best Model"
          value="Random Forest"
          icon={<Brain className="h-6 w-6" />}
          subtitle="91% accuracy"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureImportanceChart
          data={[
            { feature: 'Salary', importance: 0.85 },
            { feature: 'Experience', importance: 0.72 },
            { feature: 'Productivity', importance: 0.61 },
            { feature: 'Age', importance: 0.43 },
            { feature: 'Department', importance: 0.28 },
          ]}
        />
        <ModelComparisonChart
          data={[
            { model: 'Random Forest', score: 0.91, cvScore: 0.88 },
            { model: 'XGBoost', score: 0.89, cvScore: 0.86 },
            { model: 'Logistic Regression', score: 0.85, cvScore: 0.83 },
            { model: 'KNN', score: 0.79, cvScore: 0.76 },
          ]}
        />
      </div>

      {/* Insights Section - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard
          title="Strong Correlation Detected"
          description="Salary and experience show a strong positive correlation (r=0.93). This suggests experience is a key factor in compensation."
          type="positive"
          severity="high"
          metadata={[
            { label: 'Correlation', value: '0.93' },
            { label: 'Features', value: '2' },
          ]}
          footer="This relationship is consistent across all departments."
        />
        <InsightCard
          title="High Cardinality Warning"
          description="Column 'customer_id' has 100 unique values across 100 rows. Consider encoding or feature engineering for better model performance."
          type="warning"
          severity="medium"
          metadata={[
            { label: 'Unique Values', value: '100' },
            { label: 'Total Rows', value: '100' },
          ]}
          footer="Recommendation: Frequency or target encoding"
        />
        <InsightCard
          title="Class Imbalance"
          description="Target variable 'churn' is imbalanced (30% positive, 70% negative). Consider using class weights or SMOTE for better performance."
          type="negative"
          severity="high"
          metadata={[
            { label: 'Positive', value: '30%' },
            { label: 'Negative', value: '70%' },
          ]}
          footer="Consider resampling techniques"
        />
        <InsightCard
          title="Feature Importance"
          description="Top 3 features: Salary (85%), Experience (72%), Productivity (61%). These are your most predictive variables."
          type="info"
          severity="low"
          metadata={[
            { label: 'Top Feature', value: 'Salary' },
            { label: 'Total Features', value: '12' },
          ]}
          footer="These features explain 72% of variance"
        />
      </div>

      {/* Reports Section */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📄 Generate Reports</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export your analysis in multiple formats</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Button variant="primary" size="md" icon={<Download className="h-4 w-4" />}>
              PDF
            </Button>
            <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />}>
              HTML
            </Button>
            <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />}>
              Markdown
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
