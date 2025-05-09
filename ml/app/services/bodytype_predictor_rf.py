import pandas as pd
import pickle
import os

# Paths to saved model and encoder
MODEL_PATH = "training/models/body_type_model.pkl"
ENCODER_PATH = "training/models/body_type_label_encoder.pkl"

def predict_body_type_from_input(height, weight, age):
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)

        with open(ENCODER_PATH, 'rb') as f:
            label_encoder = pickle.load(f)

        if not (5 <= age <= 80):
            raise ValueError("Age must be between 5 and 80 (inclusive).")
        if age < 18 and not (100 <= height <= 180):
            raise ValueError("For age < 18, height must be between 100 and 180 cm.")
        if age >= 18 and not (120 <= height <= 210):
            raise ValueError("For age >= 18, height must be between 120 and 210 cm.")
        if age < 18 and not (20 <= weight <= 80):
            raise ValueError("For age < 18, weight must be between 20 and 80 kg.")
        if age >= 18 and not (40 <= weight <= 200):
            raise ValueError("For age >= 18, weight must be between 40 and 200 kg.")

        df_input = pd.DataFrame([[height, weight, age]], columns=['Height', 'Weight', 'Age'])
        prediction_index = model.predict(df_input)[0]
        prediction_label = label_encoder.inverse_transform([prediction_index])[0]

        return {
            "BodyTypeIndex": int(prediction_index),
            "BodyTypeDescription": prediction_label
        }

    except Exception as e:
        return {"error": str(e)}
