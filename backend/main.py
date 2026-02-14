from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import tensorflow as tf
import io

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "disease.keras"
model = None

# Load model on startup
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")

CLASS_NAMES = [
    "Banana Black Sigatoka Disease",
    "Banana Bract Mosaic Virus Disease",
    "Banana Healthy Leaf",
    "Banana Insect Pest Disease",
    "Banana Moko Disease",
    "Banana Panama Disease",
    "Banana Yellow Sigatoka Disease",
    "Black Gram_anthracnose",
    "Black Gram_healthy",
    "Black Gram_leaf crinckle",
    "Black Gram_powdery mildew",
    "Black Gram_yellow mosaic",
    "Broccoli_healthy",
    "Cabbage_healthy",
    "Cardamom_Blight1000",
    "Cardamom_Healthy_1000",
    "Cardamom_Phylosticta_LS_1000",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Eggplant Healthy Leaf",
    "Eggplant Insect Pest Disease",
    "Eggplant Leaf Spot Disease",
    "Eggplant Mosaic Virus Disease",
    "Eggplant Small Leaf Disease",
    "Eggplant White Mold Disease",
    "Eggplant Wilt Disease",
    "Ginger_Bacterial_Wilt",
    "Ginger_Healthy",
    "Jackfruit_Algal_Leaf_Spot",
    "Jackfruit_Black_Spot",
    "Jackfruit_Healthy_Leaf",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Potato___Early_blight",
    "Potato___Late_blight_",
    "Potato___healthy",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "groundnut_healthy",
    "tomato-healthy"
]

def preprocess_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        img = np.array(img) / 255.0
        img = np.expand_dims(img, axis=0)
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

@app.get("/health")
def health_check():
    return {"status": "Backend is running", "model_loaded": model is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    contents = await file.read()
    processed_image = preprocess_image(contents)
    
    predictions = model.predict(processed_image)
    class_index = np.argmax(predictions[0])
    confidence = float(np.max(predictions[0]))
    
    predicted_class = CLASS_NAMES[class_index]
    
    # Generate cure recommendation based on disease name
    cure = "Consult a local agricultural expert for verification."
    disease_lower = predicted_class.lower()

    if "healthy" in disease_lower:
        cure = "Plant looks healthy. Maintain regular care and monitoring."
    
    # Fungal & Bacterial
    elif any(x in disease_lower for x in ["blight", "spot", "rust", "mold", "mildew", "rot", "scorch"]):
        cure = "Fungal/Bacterial issue detected. Remove infected parts, improve airflow, and define a fungicide/bactericide schedule."
    
    # Viral
    elif any(x in disease_lower for x in ["virus", "mosaic", "crinckle", "curl", "wilt"]):
        cure = "Viral infection suspected. Remove and destroy infected plants immediately to prevent spread. Control vector insects."
    
    # Pests
    elif any(x in disease_lower for x in ["mite", "insect", "pest"]):
        cure = "Pest infestation detected. Use appropriate insecticides or biological controls like neem oil."

    return {
        "disease": predicted_class,
        "confidence": f"{confidence * 100:.2f}%",
        "cure": cure
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
