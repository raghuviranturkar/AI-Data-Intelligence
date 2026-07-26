export type DatasetShape = {
  rows: number;
  columns: number;
};

export type DatasetSummary = {
  file_name: string;
  shape: DatasetShape;
  columns: string[];
  numeric_columns: string[];
  categorical_columns: string[];
  missing_values: Record<string, number>;
  duplicate_rows: number;
  memory_usage: {
    bytes: number;
    kilobytes: number;
    megabytes: number;
  };
};

export type QualityMetrics = {
  quality_score: number;
  warnings: string[];
  total_warnings: number;
};

export type ValidationResult = {
  dataset: {
    file_name: string;
    rows: number;
    columns: number;
  };
  validation: {
    dataset_valid: boolean;
    empty_dataset: boolean;
    empty_columns: string[];
    duplicate_columns: string[];
    constant_columns: string[];
    high_missing_columns: string[];
    readiness: {
      status: string;
      confidence: number;
      reason: string;
    };
  };
  quality: QualityMetrics;
};

export type BestModel = {
  name: string;
  score: number;
  cv_score: number;
  reason: string;
};

export type RankedModel = {
  rank: number;
  model_name: string;
  score: number;
  cv_score: number;
  training_time: number;
};

export type AutoMLResult = {
  problem_type: string;
  target_column: string;
  models_trained: number;
  best_model: BestModel;
  ranked_models: RankedModel[];
};

export type ExplainabilityResult = {
  shap_available: boolean;
  feature_importance: Record<string, number>;
  feature_ranking: Array<{
    rank: number;
    feature: string;
    importance: number;
    percentage: number;
  }>;
};

export type InsightResult = {
  dataset_summary: {
    rows: number;
    columns: number;
    quality_score: number;
    best_model: string;
  };
  executive_summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  recommendations: string[];
  next_steps: string[];
  ai_health_score: {
    score: number;
    confidence: string;
  };
};

export type PipelineResult = {
  dataset: DatasetSummary;
  validation: ValidationResult;
  cleaning: any;
  outliers: any;
  eda: any;
  feature_engineering: any;
  automl: AutoMLResult;
  explainability: ExplainabilityResult;
  insights: InsightResult;
};
