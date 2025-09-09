from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
import pandas as pd
from io import StringIO

app = FastAPI(title="AI-Powered LCA Tool")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5180", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175", "http://127.0.0.1:5176", "http://127.0.0.1:5180"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model_path = "lca_model.joblib"
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None

# Global dataset variable
dataset_path = "dataset.csv"
if os.path.exists(dataset_path):
    dataset_df = pd.read_csv(dataset_path)
else:
    dataset_df = pd.DataFrame()

@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV and Excel files are supported.")
    try:
        contents = await file.read()
        if file.filename.endswith(".csv"):
            new_data = pd.read_csv(StringIO(contents.decode("utf-8")))
        else:
            import io
            new_data = pd.read_excel(io.BytesIO(contents))
        global dataset_df
        # Simple merge: append new data
        dataset_df = pd.concat([dataset_df, new_data], ignore_index=True)
        # Save updated dataset
        dataset_df.to_csv(dataset_path, index=False)
        return {"message": "Dataset uploaded and merged successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

# New endpoint to serve dataset as JSON
@app.get("/dataset")
def get_dataset():
    global dataset_df
    if dataset_df.empty:
        return {"error": "Dataset is empty or not loaded."}
    return dataset_df.to_dict(orient="records")

class InputData(BaseModel):
    energy_use: float = 0.0
    recycled_content: float
    material_type: str
    route: str
    energy_source: str
    transport_mode: str
    end_of_life: str
    quantity: float
    distance: float

@app.options("/predict")
def options_predict():
    return {"message": "OK"}

@app.post("/predict")
def predict(data: InputData):
    if model is None:
        return {"error": "Model not trained yet. Run train_model.py first."}

    # Calculate features from input
    energy_intensity = data.energy_use / data.quantity if data.quantity > 0 else 0

    # Water usage factors based on energy source
    water_factors = {"coal": 50, "gas": 30, "hydro": 10, "solar": 5, "wind": 5}
    water_usage = data.energy_use * water_factors.get(data.energy_source.lower(), 20)

    # SOx emissions factors
    sox_factors = {"coal": 0.004, "gas": 0.001, "hydro": 0.0001, "solar": 0.00005, "wind": 0.00008}
    sox_emissions = data.energy_use * sox_factors.get(data.energy_source.lower(), 0.002)

    # NOx emissions factors
    nox_factors = {"coal": 0.006, "gas": 0.004, "hydro": 0.0002, "solar": 0.0001, "wind": 0.00015}
    nox_emissions = data.energy_use * nox_factors.get(data.energy_source.lower(), 0.003)

    recycled_content = data.recycled_content

    # Resource efficiency based on route
    resource_efficiency = 80 if data.route.lower() == "recycled" else 50

    # Reuse/Recycling potential based on end_of_life
    reuse_recycling_potential = 90 if data.end_of_life.lower() == "recycle" else 60 if data.end_of_life.lower() == "reuse" else 30

    # Prepare input features for model with correct column names and order
    import pandas as pd
    input_df = pd.DataFrame([[
        energy_intensity,
        water_usage,
        sox_emissions,
        nox_emissions,
        recycled_content,
        resource_efficiency,
        reuse_recycling_potential
    ]], columns=[
        'Energy Intensity (kWh/ton)',
        'Water Usage (L)',
        'SOx Emissions (kg)',
        'NOx Emissions (kg)',
        'Recycled Content (%)',
        'Resource Efficiency (%)',
        'Reuse/Recycling Potential (%)'
    ])

    predictions = model.predict(input_df)[0]
    predicted_co2 = predictions[0]
    predicted_circularity = predictions[1]

    # Debug: print input features and predictions
    print(f"Input features: {input_df.to_dict(orient='records')[0]}")
    print(f"Predicted CO2: {predicted_co2}, Predicted Circularity: {predicted_circularity}")

    # Apply bounds checking for realistic values
    # CO2 emissions should be positive and within reasonable ranges
    predicted_co2 = max(0.1, min(predicted_co2, 1000))  # 0.1 to 1000 kg CO2e

    # Circularity score should be between 0 and 100
    predicted_circularity = max(0, min(predicted_circularity, 100))

    # Use calculated values for others
    predicted_energy_intensity = energy_intensity
    predicted_water_usage = water_usage
    predicted_sox = sox_emissions
    predicted_nox = nox_emissions
    predicted_recycled_content = recycled_content
    predicted_resource_efficiency = resource_efficiency
    predicted_reuse_recycling = reuse_recycling_potential

    # Format and round predictions
    predicted_co2 = round(float(predicted_co2), 2)
    predicted_circularity = round(float(predicted_circularity), 2)
    predicted_energy_intensity = round(float(predicted_energy_intensity), 2)
    predicted_water_usage = round(float(predicted_water_usage), 2)
    predicted_sox = round(float(predicted_sox), 3)
    predicted_nox = round(float(predicted_nox), 3)
    predicted_recycled_content = round(float(predicted_recycled_content), 2)
    predicted_resource_efficiency = round(float(predicted_resource_efficiency), 2)
    predicted_reuse_recycling = round(float(predicted_reuse_recycling), 2)

    # Recommendation based on circularity score and recycled content
    recommendation = "Increase recycling to improve circularity" if predicted_recycled_content < 50 else "System is circular enough"
    if data.energy_source.lower() in ["solar", "wind"]:
        recommendation += " Good choice of renewable energy."
    if data.transport_mode.lower() == "rail":
        recommendation += " Efficient transport mode."

    # Fix output formatting with commas between fields and correct JSON syntax
    return {
        "predicted_emissions": round(predicted_co2, 2),
        "circularity_score": round(predicted_circularity, 2),
        "energy_intensity": round(predicted_energy_intensity, 3),
        "water_use": round(predicted_water_usage, 2),
        "sox_emissions": round(predicted_sox, 3),
        "nox_emissions": round(predicted_nox, 3),
        "recycled_content_pct": round(predicted_recycled_content, 2),
        "resource_efficiency": round(predicted_resource_efficiency, 2),
        "reuse_recycling_potential": round(predicted_reuse_recycling, 2),
        "recommendation": recommendation
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
