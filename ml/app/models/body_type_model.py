import pandas as pd
import random
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, log_loss
from sklearn.preprocessing import LabelEncoder
from google.colab import drive  # Import for Colab

def create_body_type_dataset(num_samples=2000):
    heights, weights, ages, body_types = [], [], [], []

    index_to_bodytype = {
        0: "Extremely Weak",
        1: "Weak",
        2: "Normal",
        3: "Overweight",
        4: "Obesity",
        5: "Extreme Obesity"
    }

    for _ in range(num_samples):
        age = random.randint(5, 80)

        if age < 18:
            height = random.randint(100, 180)
            weight = random.randint(20, 80)
        else:
            height = random.randint(120, 210)
            weight = random.randint(40, 200)

        bmi = weight / (height / 100)**2

        if bmi < 16:
            body_type = index_to_bodytype[0]
        elif 16 <= bmi < 18.5:
            body_type = index_to_bodytype[1]
        elif 18.5 <= bmi < 25:
            body_type = index_to_bodytype[2]
        elif 25 <= bmi < 30:
            body_type = index_to_bodytype[3]
        elif 30 <= bmi < 35:
            body_type = index_to_bodytype[4]
        else:
            body_type = index_to_bodytype[5]

        heights.append(height)
        weights.append(weight)
        ages.append(age)
        body_types.append(body_type)

    return pd.DataFrame({
        'Height': heights,
        'Weight': weights,
        'Age': ages,
        'BodyType': body_types
    })

def train_model():
    df = create_body_type_dataset(2000)
    le = LabelEncoder()
    df['BodyTypeIndex'] = le.fit_transform(df['BodyType'])

    X = df[['Height', 'Weight', 'Age']]
    y = df['BodyTypeIndex']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    y_test_pred = rf_model.predict(X_test)
    y_test_proba = rf_model.predict_proba(X_test)

    val_accuracy = accuracy_score(y_test, y_test_pred)
    val_loss = log_loss(y_test, y_test_proba)

    print("Training the RandomForestClassifier model...")
    print(f"Validation Accuracy: {val_accuracy:.4f}")
    print(f"Validation Log Loss: {val_loss:.4f}")
    print("Classification Report:\n", classification_report(y_test, y_test_pred, target_names=le.classes_))

    return rf_model, le

def save_model_and_encoder(model, encoder, model_path, encoder_path):
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    with open(encoder_path, 'wb') as f:
        pickle.dump(encoder, f)
    print(f"Model saved to: {model_path}")
    print(f"Label encoder saved to: {encoder_path}")

def load_model_and_encoder(model_path, encoder_path):
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        with open(encoder_path, 'rb') as f:
            encoder = pickle.load(f)
        return model, encoder
    except FileNotFoundError:
        return None, None

if __name__ == "__main__":
    try:
        drive.mount('/content/drive')
        model_path = '/content/drive/My Drive/body_type_model_rf_encoded.pkl'
        encoder_path = '/content/drive/My Drive/body_type_label_encoder_rf_encoded.pkl'
    except ImportError:
        model_path = 'body_type_model_rf_encoded.pkl'
        encoder_path = 'body_type_label_encoder_rf_encoded.pkl'

    rf_model, le = train_model()
    save_model_and_encoder(rf_model, le, model_path, encoder_path)

    print("\n Download paths:")
    print(f"Model: {model_path}")
    print(f"Label Encoder: {encoder_path}")