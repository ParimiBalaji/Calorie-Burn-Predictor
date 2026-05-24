import os
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'calorie_model.pkl')
model = None

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "ML Model is not loaded"}), 500
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        # Extract features
        gender = data.get('gender')
        age = data.get('age')
        height = data.get('height')
        weight = data.get('weight')
        duration = data.get('duration')
        heart_rate = data.get('heart_rate')
        body_temp = data.get('body_temp')
        
        # Validate inputs are present
        if None in [gender, age, height, weight, duration, heart_rate, body_temp]:
            return jsonify({"error": "Missing one or more required input parameters"}), 400
            
        # Map gender string to numeric (male: 0, female: 1)
        if isinstance(gender, str):
            gender_val = 0 if gender.lower() == 'male' else 1
        else:
            gender_val = int(gender)
            
        # Create input DataFrame with correct column names and order
        input_data = pd.DataFrame([{
            'Gender': gender_val,
            'Age': float(age),
            'Height': float(height),
            'Weight': float(weight),
            'Duration': float(duration),
            'Heart_Rate': float(heart_rate),
            'Body_Temp': float(body_temp)
        }])
        
        # Run prediction
        prediction = model.predict(input_data)
        calories_burnt = float(prediction[0])
        
        # Safe clip to 0 in case of anomalous negative outputs (standard ML sanity check)
        calories_burnt = max(0.0, round(calories_burnt, 2))
        
        return jsonify({
            "success": True,
            "calories_burnt": calories_burnt
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run locally on default port 5000
    app.run(debug=True, host='127.0.0.1', port=5000)
