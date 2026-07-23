# 🚀 AI Data Intelligence Engine

> An end-to-end AI-powered data analysis platform that automatically profiles datasets, detects data quality issues, generates statistical summaries, and prepares structured insights for machine learning workflows.

---
![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Pandas](https://img.shields.io/badge/Pandas-Data%20Processing-purple)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-orange)
---
## 📌 Overview

AI Data Intelligence Engine is a backend platform designed to automate the first stage of every data science project—**understanding the dataset**.

Instead of manually inspecting CSV or Excel files using notebooks, users simply upload a dataset through a REST API. The engine automatically performs data validation, profiling, statistical analysis, and quality checks before returning structured JSON responses.

The project follows a modular architecture inspired by production-grade data platforms, making it easy to extend with visualization, machine learning, and AI capabilities.

---

## ✨ Features

### 📂 Dataset Processing
- CSV Upload
- Excel Upload
- Automatic file validation
- Schema detection
- Data type identification

### 📊 Data Profiling
- Dataset dimensions
- Column information
- Numeric & categorical separation
- Memory usage analysis
- Dataset overview

### 🧹 Data Quality Checks
- Missing value detection
- Missing value percentage
- Duplicate row detection
- Invalid data detection
- Data consistency validation

### 📈 Statistical Analysis
- Mean
- Median
- Standard Deviation
- Variance
- Quartiles
- Minimum / Maximum
- Count
- Distribution Summary

### ⚡ REST API
- FastAPI backend
- Swagger Documentation
- JSON responses
- Modular service architecture

---

# 🏗 System Architecture

```
                    +-------------------+
                    |    User / Client  |
                    +---------+---------+
                              |
                       Upload CSV/Excel
                              |
                              ▼
                    +-------------------+
                    |      FastAPI      |
                    +---------+---------+
                              |
                    Dataset Processing Engine
                              |
      +-----------+-----------+------------+-------------+
      |           |           |            |             |
 Validation   Profiling   Statistics   Data Quality   Reports
      |           |           |            |             |
      +-----------+-----------+------------+-------------+
                              |
                       JSON Response
```

---

# 📁 Project Structure

```
AI-Data-Intelligence
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   │   ├── dataset_inspector.py
│   │   │   └── upload_service.py
│   │   ├── utils
│   │   └── main.py
│   │
│   ├── uploads
│   ├── reports
│   ├── tests
│   ├── requirements.txt
│   └── README.md
│
├── datasets
├── docs
├── frontend              (Coming Soon)
└── README.md
```

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Backend | FastAPI |
| Language | Python 3.8+ |
| Data Processing | Pandas |
| Numerical Computing | NumPy |
| Validation | Pydantic |
| Visualization | Matplotlib *(Upcoming)* |
| Interactive Charts | Plotly *(Upcoming)* |
| Machine Learning | Scikit-learn *(Upcoming)* |
| Explainability | SHAP *(Upcoming)* |

---

# 🚀 Getting Started

## Prerequisites

- Python 3.8+
- pip

---

## Installation

Clone the repository

```bash
git clone https://github.com/raghuviranturkar/AI-Data-Intelligence.git
```

```bash
cd AI-Data-Intelligence/backend
```

Create virtual environment

```bash
python -m venv venv
```

Activate

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run server

```bash
uvicorn app.main:app --reload
```

---

# 🌐 API

Once the server starts:

| Endpoint | URL |
|----------|------|
| API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

---

# 📤 Upload Dataset

Using cURL

```bash
curl -X POST http://localhost:8000/upload \
-F "file=@dataset.csv"
```

Using Python

```python
import requests

url="http://localhost:8000/upload"

files={
    "file":open("dataset.csv","rb")
}

response=requests.post(url,files=files)

print(response.json())
```

---

# 📄 API Response

```json
{
  "status":"success",
  "message":"File processed successfully",
  "data":{
      "shape":{
          "rows":1000,
          "columns":10
      },
      "missing_values":{},
      "duplicate_rows":0,
      "memory_usage":{},
      "basic_statistics":{}
  }
}
```

---

# 📡 REST Endpoints

## POST `/upload`

Uploads and analyzes datasets.

Supports:

- CSV
- XLS
- XLSX

Returns

- Dataset Profile
- Missing Values
- Statistics
- Duplicate Count
- Memory Usage

---

## GET `/health`

Returns service status.

```json
{
    "status":"healthy"
}
```

---

## GET `/`

Returns API information.

---

# 🧪 Testing

Run

```bash
cd backend

python tests/test_inspector.py
```

---

# 📊 Sample Datasets

Included inside

```
datasets/
```

Examples

- sales_data.csv
- heights_weights.csv

Generate additional sample datasets

```bash
python generate_sample_data.py
```

---

# 🗺 Roadmap

## ✅ Phase 1 — Core Engine

- Dataset Upload
- Data Profiling
- Statistics
- Missing Values
- Duplicate Detection

---

## 🚧 Phase 2 — Visualization

- Correlation Heatmaps
- Distribution Charts
- Interactive Dashboards
- Plot Generation

---

## 🚧 Phase 3 — AI & Machine Learning

- Automated Feature Engineering
- Model Training
- Model Comparison
- Explainability using SHAP

---

## 🚧 Phase 4 — SaaS Platform

- Authentication
- Workspaces
- Report Generation
- Cloud Deployment
- Team Collaboration

---

# 💡 Future Enhancements

- PDF Insight Reports
- SQL Database Connector
- AutoML Pipelines
- AI-powered Dataset Recommendations
- LLM-based Natural Language Querying
- Data Drift Detection
- Time-Series Analysis
- Data Cleaning Suggestions

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Raghuvir Anturkar**

📧 raghuanturkar8@gmail.com

GitHub:
https://github.com/raghuviranturkar

---

⭐ If you found this project useful, consider giving it a star.