import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.multioutput import MultiOutputRegressor
import joblib

# Load dataset
data = pd.read_csv('dataset.csv')

# Prepare features and targets
features = data[['Energy Intensity (kWh/ton)', 'Water Usage (L)', 'SOx Emissions (kg)', 'NOx Emissions (kg)', 'Recycled Content (%)', 'Resource Efficiency (%)', 'Reuse/Recycling Potential (%)']]
targets = data[['CO2 Emissions (kg CO2e)', 'Circularity Score (/100)']]

# Split data
X_train, X_test, y_train, y_test = train_test_split(features, targets, test_size=0.2, random_state=42)

# Train multi-output model
model = MultiOutputRegressor(LinearRegression())
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'lca_model.joblib')

print("Multi-output model trained and saved successfully.")
