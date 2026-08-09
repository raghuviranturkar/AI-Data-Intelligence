"""
AutoML Engine - Fixed target detection and model ranking
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.preprocessing import LabelEncoder, StandardScaler, RobustScaler
from sklearn.model_selection import train_test_split
import traceback

from .model_selector import ModelSelector, ProblemType
from .trainer import ModelTrainer
from .evaluator import ModelEvaluator
from .ranking import ModelRanker

class AutoMLEngine:
    def __init__(self, context: Dict[str, Any]):
        self.context = context
        self.df = context.get("dataframe", pd.DataFrame())
        self.validation = context.get("validation", {})
        self.target_column = None
        self.problem_type = None
        self.model_selector = ModelSelector()
        self.trainer = ModelTrainer()
        self.evaluator = ModelEvaluator()
        self.ranker = ModelRanker()
        self.results = {}
        self.random_seed = 42
        self.trained_models = {}
        self.preprocessor = None

    def run(self) -> Dict[str, Any]:
        print("🚀 Starting AutoML Engine...")
        try:
            self._identify_target()
            self._detect_problem_type()
            X, y, feature_names = self._prepare_data()
            X = self._clean_infinite_values(X)
            self._create_preprocessor(X, feature_names)
            X_processed = self._apply_preprocessing(X)
            feature_counts = self._get_feature_counts(X_processed, feature_names)
            split_info = self._split_data(X_processed, y)
            models = self._select_models()
            trained_models = self._train_models(models, split_info)
            self._store_trained_models(trained_models)
            evaluated_models = self._evaluate_models(trained_models, split_info)
            ranked_models = self._rank_models(evaluated_models)
            best_model = self._select_best(ranked_models)

            self.results = {
                "problem_type": self.problem_type,
                "target_column": self.target_column,
                "feature_columns": [col for col in self.df.columns if col != self.target_column],
                "models_trained": len([m for m in trained_models if "error" not in m]),
                "candidate_models": [m["name"] for m in models],
                "training_summary": self._generate_training_summary(trained_models),
                "ranked_models": ranked_models,
                "best_model": best_model,
                "feature_counts": feature_counts,
                "dataset_split": split_info,
                "random_seed": self.random_seed,
                "preprocessor": self.preprocessor,
                "feature_names": feature_names,
                "trained_models": {k: v for k, v in self.trained_models.items() if k}
            }
            print(f"✅ AutoML complete! Trained {len(trained_models)} models")
            return self.results
        except Exception as e:
            print(f"❌ AutoML failed: {str(e)}")
            traceback.print_exc()
            return {"error": str(e), "models_trained": 0, "ranked_models": [], "best_model": {}}

    def _identify_target(self):
        """Identify target column from validation or fallback to last numeric column."""
        # 1. Try validation profiling
        profiling = self.validation.get("profiling", {})
        candidates = profiling.get("target_candidates", [])
        if candidates:
            self.target_column = candidates[0]
            print(f"   Target from validation: {self.target_column}")
            return

        # 2. Fallback: Use last numeric column
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns.tolist()
        if numeric_cols:
            self.target_column = numeric_cols[-1]
            print(f"   Fallback target: {self.target_column}")
            return

        # 3. Last resort: Use last column
        self.target_column = self.df.columns[-1]
        print(f"   Last resort target: {self.target_column}")

    def _detect_problem_type(self):
        if self.target_column is None:
            raise ValueError("No target column found")
        y = self.df[self.target_column].dropna().values
        problem_info = self.model_selector.detect_problem_type(y)
        self.problem_type = problem_info["problem_type"]
        print(f"   Problem type: {self.problem_type}")

    def _clean_infinite_values(self, X: np.ndarray) -> np.ndarray:
        return np.where(np.isinf(X), np.nan, X)

    def _prepare_data(self) -> tuple:
        feature_cols = [col for col in self.df.columns if col != self.target_column]
        numeric_cols = self.df[feature_cols].select_dtypes(include=[np.number]).columns.tolist()
        X = self.df[numeric_cols].fillna(0).values
        y = self.df[self.target_column].values
        feature_names = numeric_cols

        if self.problem_type in [ProblemType.CLASSIFICATION.value, ProblemType.BINARY_CLASSIFICATION.value]:
            le = LabelEncoder()
            y = le.fit_transform(y)
            self.target_encoder = le
        return X, y, feature_names

    def _create_preprocessor(self, X: np.ndarray, feature_names: List[str]):
        try:
            q1, q3 = np.percentile(X, [25, 75], axis=0)
            iqr = q3 - q1
            has_outliers = ((X < (q1 - 1.5 * iqr)) | (X > (q3 + 1.5 * iqr))).any()
        except:
            has_outliers = False
        self.preprocessor = {"scaler": RobustScaler() if has_outliers else StandardScaler(), "feature_names": feature_names, "is_fitted": False}

    def _apply_preprocessing(self, X: np.ndarray) -> np.ndarray:
        if not self.preprocessor["is_fitted"]:
            self.preprocessor["scaler"].fit(X)
            self.preprocessor["is_fitted"] = True
        return self.preprocessor["scaler"].transform(X)

    def _get_feature_counts(self, X: np.ndarray, feature_names: List[str]) -> Dict[str, Any]:
        return {"original_features": len(self.df.columns) - 1, "encoded_features": len(feature_names), "final_features": len(feature_names)}

    def _split_data(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=self.random_seed)
        X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=self.random_seed)
        return {
            "train_size": len(X_train), "validation_size": len(X_val), "test_size": len(X_test),
            "X_train": X_train, "X_val": X_val, "X_test": X_test,
            "y_train": y_train, "y_val": y_val, "y_test": y_test,
            "random_seed": self.random_seed
        }

    def _select_models(self) -> List[Dict[str, Any]]:
        return self.model_selector.select_models(self.problem_type)

    def _train_models(self, models: List[Dict[str, Any]], split_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        trained_models = []
        for model_config in models:
            try:
                result = self.trainer.train_model(model_config, split_info["X_train"], split_info["y_train"])
                result.update({"split_info": {"train_size": split_info["train_size"], "random_seed": self.random_seed}})
                trained_models.append(result)
                print(f"   ✅ Trained {model_config['name']}")
            except Exception as e:
                print(f"   ❌ Failed to train {model_config['name']}: {str(e)}")
                trained_models.append({"model_name": model_config["name"], "error": str(e)})
        return trained_models

    def _store_trained_models(self, trained_models: List[Dict[str, Any]]):
        for result in trained_models:
            if "error" not in result and "model_instance" in result:
                self.trained_models[result["model_name"]] = {
                    "model": result["model_instance"],
                    "training_time": result.get("training_time", 0),
                    "cv_results": result.get("cv_results", {}),
                    "model_config": result.get("model_config", {})
                }

    def _evaluate_models(self, trained_models: List[Dict[str, Any]], split_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        evaluated_models = []
        for result in trained_models:
            if "error" in result:
                evaluated_models.append(result)
                continue
            try:
                evaluation = self.evaluator.evaluate_model(result["model_instance"], split_info["X_test"], split_info["y_test"], self.problem_type)
                result.update({"evaluation": evaluation, "split_info": {"test_size": split_info["test_size"], "random_seed": self.random_seed}})
                evaluated_models.append(result)
                print(f"   ✅ Evaluated {result['model_name']}")
            except Exception as e:
                print(f"   ❌ Failed to evaluate {result['model_name']}: {str(e)}")
                result["error"] = str(e)
                evaluated_models.append(result)
        return evaluated_models

    def _rank_models(self, evaluated_models: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return self.ranker.rank_models(evaluated_models, self.problem_type)

    def _select_best(self, ranked_models: List[Dict[str, Any]]) -> Dict[str, Any]:
        return self.ranker.select_best_model(ranked_models) if ranked_models else {}

    def _generate_training_summary(self, trained_models: List[Dict[str, Any]]) -> Dict[str, Any]:
        successful = [m for m in trained_models if "error" not in m]
        return {
            "models_trained": len(successful),
            "models_failed": len(trained_models) - len(successful),
            "total_time": sum(m.get("training_time", 0) for m in successful),
            "problem_type": self.problem_type,
            "target": self.target_column
        }

def run_automl(context: Dict[str, Any]) -> Dict[str, Any]:
    engine = AutoMLEngine(context)
    return engine.run()
