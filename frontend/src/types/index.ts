export type DatasetShape = {
  rows: number
  columns: number
}

export type DatasetSummary = {
  file_name: string
  shape: DatasetShape
  columns: string[]
  numeric_columns: string[]
  categorical_columns: string[]
  dtypes: Record<string, string>
  missing_values: Record<string, number>
  missing_percentage: Record<string, number>
  duplicate_rows: number
  memory_usage: {
    bytes: number
    kilobytes: number
    megabytes: number
  }
}

export type QualityMetrics = {
  quality_score: number
  warnings: string[]
  total_warnings: number
}

export type ValidationResult = {
  quality: QualityMetrics
  validation: {
    dataset_valid: boolean
    empty_dataset: boolean
    empty_columns: string[]
    duplicate_columns: string[]
    constant_columns: string[]
    high_missing_columns: string[]
    readiness: {
      status: string
      confidence: number
      reason: string
    }
  }
}

export type BestModel = {
  name: string
  score: number
  cv_score: number
  reason: string
}

export type RankedModel = {
  rank: number
  model_name: string
  score: number
  cv_score: number
}

export type AutoMLResult = {
  best_model: BestModel
  models_trained: number
  ranked_models: RankedModel[]
  problem_type?: string
  target_column?: string
}

export type ExplainabilityResult = {
  feature_importance: Record<string, number>
  feature_ranking: Array<{
    rank: number
    feature: string
    importance: number
    percentage: number
  }>
  shap_available?: boolean
}

export type InsightResult = {
  ai_health_score: {
    score: number
    confidence: string
  }
  executive_summary: string
  recommendations: string[]
  strengths: string[]
  weaknesses: string[]
  risks: string[]
  next_steps?: string[]
}

export type PipelineResult = {
  dataset: DatasetSummary
  validation: ValidationResult
  automl: AutoMLResult
  explainability: ExplainabilityResult
  insights: InsightResult
  session_id?: string
  cleaning?: any
  outliers?: any
  eda?: any
  feature_engineering?: any
}
