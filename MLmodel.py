import numpy as np
import tensorflow as tf
from tensorflow import keras
from flask import Flask, jsonify
import joblib

# Load pre-trained model or train a new one
try:
    model = keras.models.load_model("predictive_maintenance_model.h5")
except:
    model = keras.Sequential([
        keras.layers.Dense(16, activation='relu', input_shape=(2,)),
        keras.layers.Dense(8, activation='relu'),
        keras.layers.Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    # Generate sample training data
    np.random.seed(42)
    X_train = np.random.rand(1000, 2) * 100  # Random temperature and power output values
    y_train = (X_train[:, 0] + X_train[:, 1] > 100).astype(int)  # Simple failure condition

    # Train model
    model.fit(X_train, y_train, epochs=10, batch_size=16)
    model.save("predictive_maintenance_model.h5")

# Flask API for predictions
app = Flask(__name__)

@app.route("/predict", methods=["GET"])
def predict():
    # Simulated input data
    sample_data = np.array([[75, 20]])  # Example: temperature=75, power_output=20
    risk = model.predict(sample_data)[0][0] * 100  # Convert to percentage
    return jsonify({"risk": round(risk, 2)})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
