from datetime import datetime, timezone
from fastapi import FastAPI, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from weather import get_weather_forecast, WeatherAPIError
from decision_engine import krishi_drishti_advisor

app = FastAPI(
    title="Krishi Drishti API",
    description="Weather-based Agricultural Advisory Service Proof-of-Concept",
    version="1.0.0"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", summary="Health Check Endpoint")
def health_check():
    """
    Returns system status to verify backend is running.
    """
    return {"status": "ok"}


@app.get("/api/advisory", summary="Get Live Agricultural Advisory")
def get_advisory(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="Latitude between -90 and 90"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="Longitude between -180 and 180")
):
    """
    Fetches live weather forecast from Open-Meteo, evaluates rule-based agricultural decisions,
    and returns weather summary + advisory recommendations.
    """
    # 1. Fetch live weather forecast
    try:
        raw_weather = get_weather_forecast(latitude, longitude)
    except WeatherAPIError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Weather service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected internal server error: {str(e)}"
        )

    # 2. Pass weather forecast through Decision Engine
    evaluated = krishi_drishti_advisor(raw_weather)
    metrics = evaluated["summary_metrics"]
    advisory_output = evaluated["advisory"]

    # 3. Format structured JSON response
    response_payload = {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "weather": {
            "temperature": metrics["current_temp"],
            "humidity": metrics["current_humidity"],
            "rainfall_24h": metrics["total_rain_24h"],
            "rain_probability": metrics["max_rain_prob_24h"],
            "wind_speed": metrics["current_wind"]
        },
        "advisory": advisory_output,
        "generated_at": datetime.now(timezone.utc).isoformat()
    }

    return response_payload
