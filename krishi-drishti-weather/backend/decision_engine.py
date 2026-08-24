from typing import Dict, Any, List

# Decision Engine Threshold Constants
RAIN_PROBABILITY_HIGH = 80
RAIN_PROBABILITY_MODERATE = 50

RAINFALL_SIGNIFICANT = 10
RAINFALL_HEAVY = 25

WIND_HIGH = 20
WIND_VERY_HIGH = 35

HEAT_WARNING = 38
SEVERE_HEAT = 40

HUMIDITY_HIGH = 85
HUMIDITY_VERY_HIGH = 90


def _extract_summary_data(weather_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Helper function to slice and extract relevant 24h and 6h metrics from Open-Meteo hourly response.
    """
    hourly = weather_data.get("hourly", {})
    
    # Slices for next 24 hours (fallback to empty list if key missing)
    temp_24h = hourly.get("temperature_2m", [])[:24]
    humidity_24h = hourly.get("relative_humidity_2m", [])[:24]
    precip_24h = hourly.get("precipitation", [])[:24]
    rain_prob_24h = hourly.get("precipitation_probability", [])[:24]
    wind_24h = hourly.get("wind_speed_10m", [])[:24]

    # Slices for next 6 hours
    precip_6h = precip_24h[:6]
    rain_prob_6h = rain_prob_24h[:6]

    return {
        # 24-hour aggregations
        "max_rain_prob_24h": max(rain_prob_24h) if rain_prob_24h else 0,
        "total_rain_24h": round(sum(precip_24h), 2) if precip_24h else 0.0,
        "max_hourly_rain_24h": max(precip_24h) if precip_24h else 0.0,
        "max_wind_24h": max(wind_24h) if wind_24h else 0.0,
        "max_temp_24h": max(temp_24h) if temp_24h else 0.0,
        "min_temp_24h": min(temp_24h) if temp_24h else 0.0,
        "max_humidity_24h": max(humidity_24h) if humidity_24h else 0,

        # 6-hour aggregations
        "max_rain_prob_6h": max(rain_prob_6h) if rain_prob_6h else 0,
        "total_rain_6h": round(sum(precip_6h), 2) if precip_6h else 0.0,
        
        # Current metrics (first hour reading)
        "current_temp": temp_24h[0] if temp_24h else 0.0,
        "current_humidity": humidity_24h[0] if humidity_24h else 0,
        "current_wind": wind_24h[0] if wind_24h else 0.0,
    }


def irrigation_advice(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates irrigation suitability based on next 24-hour weather predictions.
    """
    max_prob = metrics["max_rain_prob_24h"]
    total_rain = metrics["total_rain_24h"]

    if max_prob >= RAIN_PROBABILITY_HIGH and total_rain >= RAINFALL_SIGNIFICANT:
        return {
            "action": "POSTPONE IRRIGATION",
            "priority": "HIGH",
            "reason": "Significant rainfall is expected within the next 24 hours."
        }
    elif total_rain >= RAINFALL_HEAVY:
        return {
            "action": "DO NOT IRRIGATE",
            "priority": "CRITICAL",
            "reason": "Heavy rainfall expected within the next 24 hours."
        }
    elif max_prob >= RAIN_PROBABILITY_MODERATE:
        return {
            "action": "MONITOR BEFORE IRRIGATING",
            "priority": "MEDIUM",
            "reason": "Moderate probability of rain within the next 24 hours."
        }
    else:
        return {
            "action": "IRRIGATION CAN BE CONSIDERED",
            "priority": "LOW",
            "reason": "Low rainfall probability in the next 24 hours."
        }


def fertilizer_advice(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates fertilizer application suitability based on 6h and 24h forecasts.
    """
    total_rain_24h = metrics["total_rain_24h"]
    max_prob_24h = metrics["max_rain_prob_24h"]
    max_prob_6h = metrics["max_rain_prob_6h"]
    total_rain_6h = metrics["total_rain_6h"]

    if total_rain_24h >= RAINFALL_HEAVY:
        return {
            "action": "DELAY FERTILIZER",
            "priority": "CRITICAL",
            "reason": "Heavy rainfall is expected and fertilizer may be lost through runoff or leaching."
        }
    elif max_prob_24h >= RAIN_PROBABILITY_HIGH and total_rain_24h >= RAINFALL_SIGNIFICANT:
        return {
            "action": "DELAY FERTILIZER",
            "priority": "HIGH",
            "reason": "High probability of significant rainfall which can wash away fertilizer."
        }
    elif max_prob_6h >= RAIN_PROBABILITY_HIGH and total_rain_6h > 0:
        return {
            "action": "WAIT BEFORE APPLYING FERTILIZER",
            "priority": "HIGH",
            "reason": "Imminent rain expected within the next 6 hours."
        }
    elif max_prob_24h >= RAIN_PROBABILITY_MODERATE:
        return {
            "action": "MONITOR WEATHER BEFORE FERTILIZING",
            "priority": "MEDIUM",
            "reason": "Moderate chance of rainfall in the next 24 hours."
        }
    else:
        return {
            "action": "WEATHER CONDITIONS FAVORABLE",
            "priority": "LOW",
            "reason": "Favorable weather conditions for fertilizer application."
        }


def spraying_advice(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates crop spraying suitability based on wind speed, temperature, and rain.
    Does NOT recommend specific chemicals or dosages.
    """
    max_prob_6h = metrics["max_rain_prob_6h"]
    total_rain_6h = metrics["total_rain_6h"]
    max_wind_24h = metrics["max_wind_24h"]
    total_rain_24h = metrics["total_rain_24h"]
    max_temp_24h = metrics["max_temp_24h"]
    max_prob_24h = metrics["max_rain_prob_24h"]

    if max_prob_6h >= RAIN_PROBABILITY_HIGH and total_rain_6h > 0:
        return {
            "action": "DO NOT SPRAY NOW",
            "priority": "CRITICAL",
            "reason": "High rain probability and rainfall expected within next 6 hours."
        }
    elif max_wind_24h >= WIND_VERY_HIGH:
        return {
            "action": "DO NOT SPRAY",
            "priority": "CRITICAL",
            "reason": f"Maximum wind speed ({max_wind_24h} km/h) exceeds safe limits, causing severe spray drift."
        }
    elif max_wind_24h >= WIND_HIGH:
        return {
            "action": "POSTPONE SPRAYING",
            "priority": "HIGH",
            "reason": f"High wind speed ({max_wind_24h} km/h) increases risk of spray drift."
        }
    elif total_rain_24h >= RAINFALL_HEAVY:
        return {
            "action": "POSTPONE SPRAYING",
            "priority": "HIGH",
            "reason": "Heavy rainfall expected in next 24 hours will wash away sprays."
        }
    elif max_temp_24h >= SEVERE_HEAT:
        return {
            "action": "AVOID SPRAYING DURING HOT CONDITIONS",
            "priority": "HIGH",
            "reason": f"Maximum temperature ({max_temp_24h}°C) causes rapid spray evaporation."
        }
    elif max_prob_24h >= RAIN_PROBABILITY_MODERATE:
        return {
            "action": "CHECK WEATHER BEFORE SPRAYING",
            "priority": "MEDIUM",
            "reason": "Moderate chance of rain in the next 24 hours."
        }
    else:
        return {
            "action": "WEATHER CONDITIONS GENERALLY FAVORABLE",
            "priority": "LOW",
            "reason": "Low wind, suitable temperatures, and low rain probability."
        }


def heat_stress_advice(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates thermal stress risk for crops in the next 24 hours.
    """
    max_temp_24h = metrics["max_temp_24h"]

    if max_temp_24h >= SEVERE_HEAT:
        return {
            "status": "SEVERE HEAT WARNING",
            "priority": "CRITICAL",
            "reason": f"Extreme high temperature ({max_temp_24h}°C) expected.",
            "recommendations": [
                "Monitor soil moisture frequently.",
                "Monitor crops for signs of heat stress.",
                "Follow crop-specific irrigation recommendations.",
                "Avoid unnecessary field work during the hottest period."
            ]
        }
    elif max_temp_24h >= HEAT_WARNING:
        return {
            "status": "HEAT STRESS WARNING",
            "priority": "HIGH",
            "reason": f"Elevated temperature ({max_temp_24h}°C) expected.",
            "recommendations": [
                "Monitor soil moisture.",
                "Check vulnerable crops for heat stress.",
                "Avoid unnecessary field operations during peak heat."
            ]
        }
    else:
        return {
            "status": "NO SIGNIFICANT HEAT WARNING",
            "priority": "LOW",
            "reason": "Temperatures are expected to stay within normal ranges.",
            "recommendations": [
                "Continue normal monitoring."
            ]
        }


def disease_risk_advice(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates weather suitability for crop disease development (e.g. fungal risks).
    Note: Weather-based indicator only, not direct disease diagnosis.
    """
    max_humidity = metrics["max_humidity_24h"]
    total_rain = metrics["total_rain_24h"]
    min_temp = metrics["min_temp_24h"]
    max_temp = metrics["max_temp_24h"]

    # HIGH RISK
    if (max_humidity >= HUMIDITY_VERY_HIGH and 
        total_rain >= RAINFALL_SIGNIFICANT and 
        min_temp >= 20.0 and 
        max_temp <= 32.0):
        return {
            "risk": "HIGH",
            "priority": "HIGH",
            "reason": "Very high humidity, rainfall and moderate temperatures may favor some fungal diseases.",
            "recommendations": [
                "Inspect crops regularly for disease symptoms.",
                "Monitor leaves for spots, lesions or unusual discoloration.",
                "Avoid unnecessary leaf wetting.",
                "Use crop-specific disease management guidance if symptoms appear."
            ]
        }
    # MEDIUM RISK
    elif max_humidity >= HUMIDITY_HIGH and total_rain >= 5.0:
        return {
            "risk": "MEDIUM",
            "priority": "MEDIUM",
            "reason": "High humidity and rainfall increase fungal disease risk.",
            "recommendations": [
                "Increase crop monitoring.",
                "Inspect leaves and stems for early disease symptoms."
            ]
        }
    # LOW RISK
    else:
        return {
            "risk": "LOW",
            "priority": "LOW",
            "reason": "Weather conditions do not favor significant fungal disease development.",
            "recommendations": [
                "Continue normal crop monitoring."
            ]
        }


def krishi_drishti_advisor(weather_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Aggregates metrics and runs all 5 decision sub-engines.
    Returns full advisory dictionary.
    """
    metrics = _extract_summary_data(weather_data)

    return {
        "summary_metrics": metrics,
        "advisory": {
            "irrigation": irrigation_advice(metrics),
            "fertilizer": fertilizer_advice(metrics),
            "spraying": spraying_advice(metrics),
            "heat": heat_stress_advice(metrics),
            "disease": disease_risk_advice(metrics)
        }
    }
