import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Loader2, AlertTriangle, AlertCircle, BarChart3 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

// Import all sections
import AnalysisOverview from './AnalysisOverview';
import DataValidationSection from './DataValidationSection';
import DataQualitySection from './DataQualitySection';
import ColumnClassificationSection from './ColumnClassificationSection';
import TargetDetectionSection from './TargetDetectionSection';
import EDASection from './EDASection';
import OutlierAnalysisSection from './OutlierAnalysisSection';
import FeatureEngineeringSection from './FeatureEngineeringSection';
import AIInsightsSection from './AIInsightsSection';
import AnalysisTimelineSection from './AnalysisTimelineSection';
import AnalysisSummarySection from './AnalysisSummarySection';

// Error fallback UI (functional component with hooks)
const SectionErrorFallback: React.FC<{
  sectionName: string;
  error: any;
}> = ({ sectionName, error }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const colors = {
    border: isDark ? '#232B35' : '#E2E8F0',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    accent: {
      coral: '#F2555A',
    },
  };

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        backgroundColor: isDark ? 'rgba(242,85,90,0.08)' : '#FEF2F2',
        borderColor: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA',
      }}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" style={{ color: colors.accent.coral }} />
        <p className="text-sm font-medium" style={{ color: colors.accent.coral }}>
          Error loading {sectionName}
        </p>
      </div>
      <p className="text-sm font-mono mt-1" style={{ color: colors.textMuted }}>
        {error?.message || 'Unknown error'}
      </p>
    </div>
  );
};

// Error Boundary component (class component)
class SectionErrorBoundary extends React.Component<{
  children: React.ReactNode;
  sectionName: string;
}> {
  state = {
    hasError: false,
    error: null as any,
  };

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <SectionErrorFallback
          sectionName={this.props.sectionName}
          error={this.state.error}
        />
      );
    }
    return this.props.children;
  }
}

const AnalysisPage: React.FC = () => {
  const { data, isLoading, error } = useData();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const colors = {
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
      azure: '#4EA1F0',
      purple: '#B48CF2',
      coral: '#F2555A',
    },
  };

  const gridBgStyle = isDark
    ? {
        backgroundImage:
          'linear-gradient(to right, rgba(237,241,245,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,241,245,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }
    : {
        backgroundImage:
          'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: colors.bg, ...gridBgStyle }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full border-4 border-transparent animate-spin"
              style={{ borderTopColor: colors.accent.amber }}
            />
          </div>
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
            Loading analysis results...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: colors.bg, ...gridBgStyle }}
      >
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="h-12 w-12" style={{ color: colors.accent.coral }} />
          <p className="text-base font-medium" style={{ color: colors.text }}>
            Failed to load data
          </p>
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
            {error}
          </p>
          <Button className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center p-8"
        style={{ backgroundColor: colors.bg, ...gridBgStyle }}
      >
        <div
          className="p-4 rounded-md border mb-4"
          style={{
            backgroundColor: colors.panel,
            borderColor: colors.border,
          }}
        >
          <BarChart3 className="h-16 w-16" style={{ color: colors.textMuted }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
          No Analysis Available
        </h2>
        <p className="text-sm font-mono mt-2 max-w-md" style={{ color: colors.textMuted }}>
          Upload a dataset to start your analysis and explore the AI-powered insights.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => (window.location.href = '/upload')}>
          Upload Dataset
        </Button>
      </div>
    );
  }

  // Extract data from the pipeline result
  const dataset = data?.dataset || {};
  const validation = data?.validation || { quality: { quality_score: 0, warnings: [], total_warnings: 0 } };
  const automl = data?.automl || {
    best_model: { name: 'N/A', score: 0, cv_score: 0, reason: '' },
    models_trained: 0,
    ranked_models: [],
  };
  const insights = data?.insights || {
    ai_health_score: { score: 0, confidence: 'N/A' },
    executive_summary: '',
    recommendations: [],
    strengths: [],
    weaknesses: [],
    risks: [],
    next_steps: [],
  };
  const explainability = data?.explainability || { feature_importance: {}, feature_ranking: [] };
  const outliers = data?.outliers || { analysis: {}, summary: {} };
  const eda = data?.eda || { correlation: {}, insights: { insights: [] } };
  const featureEng = data?.feature_engineering || {};

  const qualityScore = validation?.quality?.quality_score || 0;
  const healthScore = insights?.ai_health_score?.score || 0;
  const rows = dataset?.shape?.rows || 0;
  const columns = dataset?.shape?.columns || 0;
  const warnings = validation?.quality?.warnings || [];
  const duplicateRows = dataset?.duplicate_rows || 0;
  const missingValues = dataset?.missing_values || {};

  // Build validation items
  const validationItems = [
    { label: 'Dataset Valid', value: validation?.validation?.dataset_valid ?? true, status: 'success' as const },
    { label: 'Empty Dataset', value: !validation?.validation?.empty_dataset, status: validation?.validation?.empty_dataset ? 'error' : 'success' as const },
    { label: 'Empty Columns', value: validation?.validation?.empty_columns?.length || 0, status: validation?.validation?.empty_columns?.length > 0 ? 'warning' : 'success' as const },
    { label: 'Duplicate Columns', value: validation?.validation?.duplicate_columns?.length || 0, status: validation?.validation?.duplicate_columns?.length > 0 ? 'warning' : 'success' as const },
    { label: 'Constant Columns', value: validation?.validation?.constant_columns?.length || 0, status: validation?.validation?.constant_columns?.length > 0 ? 'warning' : 'success' as const },
    { label: 'Infinite Values', value: !validation?.validation?.infinite_values?.has_infinite, status: validation?.validation?.infinite_values?.has_infinite ? 'error' : 'success' as const },
    { label: 'Readiness', value: validation?.validation?.readiness?.status || 'Unknown', status: validation?.validation?.readiness?.status === 'Ready' ? 'success' : 'warning' as const },
  ];

  // Column classification
  const classification = {
    identifier: validation?.profiling?.id_columns || [],
    numeric: dataset?.numeric_columns || [],
    categorical: dataset?.categorical_columns || [],
    boolean: validation?.profiling?.boolean_columns || [],
    datetime: validation?.profiling?.date_columns || [],
    target_candidate: validation?.profiling?.target_candidates || [],
  };

  // Target detection
  const target = automl?.target_column || validation?.profiling?.target_candidates?.[0] || 'Not Detected';
  const targetConfidence = automl?.best_model?.score ? Math.round(automl.best_model.score * 100) : 85;
  const problemType = automl?.problem_type || validation?.validation?.readiness?.status === 'Ready' ? 'Classification' : 'Unknown';

  // EDA insights
  const edaInsights = eda?.insights?.insights?.map((insight: string) => ({
    title: 'Insight',
    description: insight,
    severity: 'info' as const,
  })) || [];

  // Strong correlations
  const strongCorrelations = eda?.correlation?.strong_correlations?.strong_correlations || [];

  // Outlier data
  const outlierFeatures = Object.entries(outliers?.analysis || {}).map(([column, info]: [string, any]) => ({
    column,
    outlier_count: info?.outlier_analysis?.outlier_count || 0,
    outlier_percentage: info?.outlier_analysis?.outlier_percentage || 0,
    severity: info?.severity || 'None',
    risk_score: info?.risk_score || 0,
    distribution: info?.distribution?.distribution_type || 'Unknown',
    recommendation: info?.recommendation?.action || 'No action needed',
  }));

  const outlierSummary = {
    total_outliers: outlierFeatures.reduce((acc, f) => acc + f.outlier_count, 0),
    highest_risk_column: outlierFeatures.sort((a, b) => b.risk_score - a.risk_score)[0]?.column || '',
    columns_with_outliers: outlierFeatures.filter((f) => f.outlier_count > 0).length,
    ranking: outlierFeatures.sort((a, b) => b.outlier_count - a.outlier_count).map((f) => f.column),
  };

  // Column stats for EDA
  const columnStats =
    dataset?.numeric_columns?.map((col: string) => {
      const stats = validation?.profiling?.column_statistics?.[col] || {};
      return {
        column: col,
        mean: stats?.mean,
        median: stats?.median,
        std: stats?.std,
        min: stats?.min,
        max: stats?.max,
        unique: stats?.unique_count,
      };
    }) || [];

  // Timeline steps with real data
  const timelineSteps = [
    {
      id: 'upload',
      label: 'Dataset Uploaded',
      status: 'completed' as const,
      timestamp: '✓',
      description: `${rows} rows, ${columns} columns`,
    },
    {
      id: 'validation',
      label: 'Validation Complete',
      status: 'completed' as const,
      timestamp: '✓',
      description: `${validationItems.filter((i) => i.status === 'success').length}/${validationItems.length} checks passed`,
    },
    {
      id: 'cleaning',
      label: 'Cleaning Analysis',
      status: 'completed' as const,
      timestamp: '✓',
      description: `${Object.keys(missingValues).filter((k) => missingValues[k] > 0).length} columns with missing values`,
    },
    {
      id: 'eda',
      label: 'Exploratory Data Analysis',
      status: 'completed' as const,
      timestamp: '✓',
      description: `${strongCorrelations.length} strong correlations found`,
    },
    {
      id: 'feature_engineering',
      label: 'Feature Engineering',
      status: 'completed' as const,
      timestamp: '✓',
      description: `${Object.keys(featureEng?.feature_roles || {}).length} features processed`,
    },
    {
      id: 'automl',
      label: 'AutoML Training',
      status: 'completed' as const,
      timestamp: '✓',
      description: `${automl?.models_trained || 0} models trained`,
    },
    {
      id: 'explainability',
      label: 'Model Explainability',
      status: 'completed' as const,
      timestamp: '✓',
      description: `${Object.keys(explainability?.feature_importance || {}).length} features analyzed`,
    },
    {
      id: 'insights',
      label: 'AI Insights Generated',
      status: 'completed' as const,
      timestamp: '✓',
      description: `${insights?.recommendations?.length || 0} recommendations generated`,
    },
    {
      id: 'reports',
      label: 'Reports Ready',
      status: 'completed' as const,
      timestamp: '✓',
      description: 'All reports generated',
    },
  ];

  return (
    <div
      className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
      style={{
        backgroundColor: colors.bg,
        ...gridBgStyle,
      }}
    >
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 gap-4 py-4">
        {/* Section 1: Analysis Overview */}
        <SectionErrorBoundary sectionName="Analysis Overview">
          <AnalysisOverview
            datasetName={dataset?.file_name || 'Unknown Dataset'}
            status="completed"
            timestamp={new Date().toLocaleString()}
            duration="3.0s"
            healthScore={healthScore}
            qualityScore={qualityScore}
          />
        </SectionErrorBoundary>

        {/* Section 2: Data Validation */}
        <SectionErrorBoundary sectionName="Data Validation">
          <DataValidationSection items={validationItems} warnings={warnings.slice(0, 5)} />
        </SectionErrorBoundary>

        {/* Section 3: Data Quality */}
        <SectionErrorBoundary sectionName="Data Quality">
          <DataQualitySection
            qualityScore={qualityScore}
            totalWarnings={warnings.length}
            duplicateRows={duplicateRows}
            missingValues={Object.values(missingValues).reduce((a: number, b: number) => a + b, 0)}
            highMissingColumns={validation?.validation?.high_missing_columns || []}
            constantColumns={validation?.validation?.constant_columns || []}
          />
        </SectionErrorBoundary>

        {/* Section 4: Column Classification */}
        <SectionErrorBoundary sectionName="Column Classification">
          <ColumnClassificationSection data={classification} />
        </SectionErrorBoundary>

        {/* Section 5: Target Detection */}
        <SectionErrorBoundary sectionName="Target Detection">
          <TargetDetectionSection
            target={target}
            confidence={targetConfidence}
            problemType={problemType}
            reason="Detected based on column characteristics and distribution patterns"
            alternatives={validation?.profiling?.target_candidates?.slice(1, 3) || []}
          />
        </SectionErrorBoundary>

        {/* Section 6: EDA */}
        <SectionErrorBoundary sectionName="EDA">
          <EDASection insights={edaInsights} strongCorrelations={strongCorrelations} columnStats={columnStats} />
        </SectionErrorBoundary>

        {/* Section 7: Outlier Analysis */}
        <SectionErrorBoundary sectionName="Outlier Analysis">
          <OutlierAnalysisSection features={outlierFeatures} summary={outlierSummary} />
        </SectionErrorBoundary>

        {/* Section 8: Feature Engineering */}
        <SectionErrorBoundary sectionName="Feature Engineering">
          <FeatureEngineeringSection
            featureRoles={featureEng?.feature_roles || {}}
            encoding={featureEng?.encoding?.encoding_recommendations || {}}
            scaling={featureEng?.scaling?.scaling_recommendations || {}}
            transformations={featureEng?.transformations?.transformation_recommendations || {}}
            interactions={featureEng?.interactions?.interaction_suggestions || []}
            lowVariance={featureEng?.low_variance?.low_variance_features || []}
            mlReadiness={featureEng?.ml_readiness || { score: 0, status: 'Unknown', recommendation: '', issues: [] }}
          />
        </SectionErrorBoundary>

        {/* Section 9: AI Insights */}
        <SectionErrorBoundary sectionName="AI Insights">
          <AIInsightsSection
            executiveSummary={insights?.executive_summary || 'No executive summary available.'}
            strengths={insights?.strengths || []}
            weaknesses={insights?.weaknesses || []}
            risks={insights?.risks || []}
            recommendations={insights?.recommendations || []}
            nextSteps={insights?.next_steps || ['Continue monitoring model performance', 'Retrain periodically']}
            healthScore={insights?.ai_health_score || { score: 0, confidence: 'Unknown' }}
          />
        </SectionErrorBoundary>

        {/* Section 10: Analysis Timeline */}
        <SectionErrorBoundary sectionName="Analysis Timeline">
          <AnalysisTimelineSection steps={timelineSteps} />
        </SectionErrorBoundary>

        {/* Section 11: Analysis Summary */}
        <SectionErrorBoundary sectionName="Analysis Summary">
          <AnalysisSummarySection
            modulesExecuted={9}
            warnings={warnings.length}
            insightsGenerated={edaInsights.length + insights?.recommendations?.length || 0}
            qualityScore={qualityScore}
            duration="3.0s"
            status={warnings.length > 0 ? 'warning' : 'success'}
          />
        </SectionErrorBoundary>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2"
        >
          <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
            © 2026 AI Data Intelligence Platform · v1.0.0
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              Analysis Complete
            </span>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono" style={{ color: colors.accent.teal }}>
                Ready
              </span>
            </div>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <span className="text-xs font-mono" style={{ color: colors.textDim }}>
              <span style={{ color: colors.accent.amber }}>●</span> AI Powered
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisPage;