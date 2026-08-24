import requests
from typing import Dict, Any

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

class WeatherAPIError(Exception):
    """Custom exception raised when fetching weather forecast fails."""
    pass

def get_weather_forecast(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Fetches 7-day weather forecast from Open-Meteo API for given latitude and longitude.
    
    Args:
        latitude (float): Latitude of the location (-90 to 90)
        longitude (float): Longitude of the location (-180 to 180)
        
    Returns:
        Dict[str, Any]: Parsed JSON response containing hourly and daily forecast data.
        
    Raises:
        WeatherAPIError: If parameters are invalid, connection fails, or response is invalid.
    """
    # Validate coordinate ranges
    if not (-90.0 <= latitude <= 90.0):
        raise WeatherAPIError(f"Invalid latitude {latitude}. Must be between -90 and 90.")
    if not (-180.0 <= longitude <= 180.0):
        raise WeatherAPIError(f"Invalid longitude {longitude}. Must be between -180 and 180.")

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "rain",
            "precipitation_probability",
            "wind_speed_10m",
            "wind_gusts_10m",
            "wind_direction_10m",
            "dew_point_2m",
            "soil_moisture_0_to_1cm",
            "et0_fao_evapotranspiration"
        ],
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "precipitation_probability_max",
            "wind_speed_10m_max",
            "wind_gusts_10m_max"
        ],
        "forecast_days": 7,
        "timezone": "auto"
    }

    try:
        response = requests.get(OPEN_METEO_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.Timeout:
        raise WeatherAPIError("Connection to Open-Meteo API timed out.")
    except requests.exceptions.RequestException as e:
        raise WeatherAPIError(f"Failed to connect to Open-Meteo API: {str(e)}")
    except ValueError as e:
        raise WeatherAPIError("Invalid JSON response received from Open-Meteo API.")

    # Validate essential fields
    if "hourly" not in data or "daily" not in data:
        raise WeatherAPIError("Missing hourly or daily forecast data in Open-Meteo API response.")

    return data
