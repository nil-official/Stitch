import pandas as pd
import joblib

# Define valid input ranges
MIN_HEIGHT = 140
MAX_HEIGHT = 200
MIN_WEIGHT = 30
MAX_WEIGHT = 120

MODEL_PATH = 'training/models/size_prediction_model2.pkl'
SHIRT_ENCODER = 'training/models/shirt_size_encoder2.pkl'
TROUSER_ENCODER = 'training/models/trouser_size_encoder2.pkl'

def predict_size(weight, height):
    try:
        # Validate input ranges
        if not (MIN_HEIGHT <= height <= MAX_HEIGHT):
            raise ValueError(f"Invalid height: {height}. Height must be between {MIN_HEIGHT} cm and {MAX_HEIGHT} cm.")

        if not (MIN_WEIGHT <= weight <= MAX_WEIGHT):
            raise ValueError(f"Invalid weight: {weight}. Weight must be between {MIN_WEIGHT} kg and {MAX_WEIGHT} kg.")

        # Load model and encoders
        model = joblib.load(MODEL_PATH)
        le_shirt = joblib.load(SHIRT_ENCODER)
        le_trouser = joblib.load(TROUSER_ENCODER)

        # Prepare input and make prediction
        input_df = pd.DataFrame([[height, weight]], columns=["Height", "Weight"])
        prediction = model.predict(input_df)[0]

        shirt = le_shirt.inverse_transform([prediction[0]])[0]
        trouser = le_trouser.inverse_transform([prediction[1]])[0]

        return {
            "shirt_size": shirt,
            "trouser_size": int(trouser)
        }

    except ValueError as ve:
        return {
            "index": -1,
            "error": str(ve)
        }

    except Exception as e:
        return {
            "index": -1,
            "error": f"Unexpected error: {str(e)}"
        }
