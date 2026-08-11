export interface DatasetShape {
  rows: number;
  columns: number;
}

export interface DatasetSummary {
  file_name: string;
  shape: DatasetShape;
  columns: string[];
  numeric_columns: string[];
  categorical_columns: string[];
  dtypes: Record<string, string>;
  missing_values: Record<string, number>;
  missing_percentage: Record<string, number>;
  duplicate_rows: number;
  memory_usage: {
    bytes: number;
    kilobytes: number;
    megabytes: number;
  };
}

export interface QualityMetrics {
  quality_score: number;
  warnings: string[];
  total_warnings: number;
}

export interface ValidationResult {
  quality: QualityMetrics;
  validation: {
    dataset_valid: boolean;
    empty_dataset: boolean;
    empty_columns: string[];
    duplicate_columns: string[];
    constant_columns: string[];
    high_missing_columns: string[];
    infinite_values?: {
      has_infinite: boolean;
      has_positive_inf: boolean;
      has_negative_inf: boolean;
      infinite_columns: string[];
    };
    readiness: {
      status: string;
      confidence: number;
      reason: string;
    };
  };
  profiling?: {
    id_columns: string[];
    boolean_columns: string[];
    date_columns: string[];
    target_candidates: string[];
    column_statistics?: Record<string, any>;
  };
}

export interface BestModel {
  name: string;
  score: number;
  cv_score: number;
  reason: string;
  training_time?: number;
}

export interface RankedModel {
  rank: number;
  model_name: string;
  score: number;
  cv_score: number;
}

export interface AutoMLResult {
  best_model: BestModel;
  models_trained: number;
  ranked_models: RankedModel[];
  problem_type?: string;
  target_column?: string;
  dataset_split?: {
    train_size: number;
    validation_size: number;
    test_size: number;
    total_size: number;
    train_ratio: number;
    validation_ratio: number;
    test_ratio: number;
    random_seed: number;
  };
}

export interface ExplainabilityResult {
  feature_importance: Record<string, number>;
  feature_ranking: Array<{
    rank: number;
    feature: string;
    importance: number;
    percentage: number;
  }>;
  shap_available?: boolean;
  global_explanation?: {
    summary: string[];
    insights: string[];
  };
  local_explanation?: {
    prediction: string;
    reasons: string[];
    summary: string;
    feature_contributions?: Array<{
      feature: string;
      shap_value: number;
      contribution: number;
      direction: string;
    }>;
  };
  insights?: {
    explanations: string[];
    insights: string[];
  };
  confidence?: {
    level: string;
    score: number;
    reason: string;
  };
}

export interface InsightResult {
  ai_health_score: {
    score: number;
    confidence: string;
  };
  executive_summary: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  next_steps?: string[];
  quality_insights?: string[];
  eda_insights?: string[];
  model_insights?: string[];
  explainability_insights?: string[];
}

export interface PipelineResult {
  dataset: DatasetSummary;
  validation: ValidationResult;
  automl: AutoMLResult;
  explainability: ExplainabilityResult;
  insights: InsightResult;
  session_id?: string;
  cleaning?: any;
  outliers?: any;
  eda?: any;
  feature_engineering?: any;
}

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at: string;
  updated_at?: string;
}

export interface WorkspaceCreate {
  name: string;
  description?: string;
}

export interface WorkspaceUpdate {
  name?: string;
  description?: string;
}

export interface DatasetHistory {
  id: number;
  workspace_id: number;
  original_filename: string;
  row_count: number;
  column_count: number;
  file_size: number;
  quality_score?: number;
  ai_health_score?: number;
  best_model?: string;
  processing_status: string;
  uploaded_at: string;
  processed_at?: string;
}

export interface SavedReport {
  id: number;
  workspace_id: number;
  dataset_id?: number;
  name: string;
  format: string;
  file_size: number;
  created_at: string;
}
