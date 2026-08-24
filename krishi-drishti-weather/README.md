# 🌾 KRISHI DRISHTI – WEATHER-BASED FARM ADVISOR

A simple, clean, rule-based proof-of-concept for weather-based agricultural advisories.

## 🚀 Data Flow Architecture

```
USER ──► FRONTEND (HTML/CSS/JS) ──► FASTAPI BACKEND ──► OPEN-METEO API
                                                            │
                                                     WEATHER FORECAST DATA
                                                            │
                                                            ▼
JSON RESPONSE ◄── FRONTEND RECOMMENDATIONS ◄── DECISION ENGINE (RULES)
```

---

## 🛠️ Project Structure

```text
krishi-drishti-weather/
│
├── backend/
│   ├── main.py              # FastAPI app & endpoints (/api/health, /api/advisory)
│   ├── weather.py           # Open-Meteo API integration & error handling
│   ├── decision_engine.py   # Rule-based decision sub-engines
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── index.html           # Main user interface
│   ├── style.css            # Styles & priority badge theme
│   └── script.js            # API fetching & DOM rendering
│
└── README.md
```

---

## ⚡ How to Run

### 1. Backend Setup (FastAPI)

Navigate to the `backend` directory:
```bash
cd backend
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the FastAPI backend server:
```bash
uvicorn main:app --reload
```

The backend server will run at:
`http://127.0.0.1:8000`

#### Verify Backend Endpoints:
- **Health Check**: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
- **Sample Advisory API**: [http://127.0.0.1:8000/api/advisory?latitude=22.6726&longitude=88.3476](http://127.0.0.1:8000/api/advisory?latitude=22.6726&longitude=88.3476)

---

### 2. Frontend Setup

In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend
```

Serve the frontend files using Python's built-in HTTP server:
```bash
python -m http.server 5500
```

Open your browser and navigate to:
[http://127.0.0.1:5500](http://127.0.0.1:5500)

Click **GET LIVE FARM ADVISORY** to retrieve real-time weather forecasts and agricultural advisories!
