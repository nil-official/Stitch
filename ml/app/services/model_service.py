import pandas as pd
from models.body_type_model import load_model_and_encoder

class BodyTypeService:
    def __init__(self, model_path, encoder_path):
        self.model, self.label_encoder = load_model_and_encoder(model_path, encoder_path)

    def predict_body_type(self, height, weight, age):
        if self.model is None or self.label_encoder is None:
            return {"error": "Model or label encoder not loaded."}
        try:
            df_input = pd.DataFrame([[height, weight, age]], columns=['Height', 'Weight', 'Age'])
            prediction_index = self.model.predict(df_input)[0]
            prediction_label = self.label_encoder.inverse_transform([prediction_index])[0]
            return {
                "BodyTypeIndex": int(prediction_index),
                "BodyTypeDescription": prediction_label
            }
        except Exception as e:
            return {"error": f"Prediction error: {e}"}

if __name__ == "__main__":
    try:
        from google.colab import drive
        drive.mount('/content/drive')
        model_path = '/content/drive/My Drive/body_type_model_rf_encoded.pkl'
        encoder_path = '/content/drive/My Drive/body_type_label_encoder_rf_encoded.pkl'
    except ImportError:
        model_path = 'body_type_model_rf_encoded.pkl'
        encoder_path = 'body_type_label_encoder_rf_encoded.pkl'

    service = BodyTypeService(model_path, encoder_path)
    prediction_result = service.predict_body_type(170, 70, 30)
    print(prediction_result)

    service_not_loaded = BodyTypeService("non_existent_model.pkl", "non_existent_encoder.pkl")
    prediction_not_loaded = service_not_loaded.predict_body_type(150, 50, 20)
    print(prediction_not_loaded)