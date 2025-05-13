import os, warnings, pickle
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, log_loss

warnings.filterwarnings("ignore")

DATA_PATH = "ml/app/training/data/bmiagedataset_encoded.csv"
MODEL_DIR = "ml/app/training/models"
os.makedirs(MODEL_DIR, exist_ok=True)

# Manual label mapping
index_to_bodytype = {
    0: "Extremely Weak",
    1: "Weak",
    2: "Normal",
    3: "Overweight",
    4: "Obesity",
    5: "Extreme Obesity"
}

# === Load dataset
df = pd.read_csv(DATA_PATH)
X, y = df[['Height', 'Weight', 'Age']], df['BodyTypeIndex']

X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# === Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# === Evaluate
print("Validation Accuracy:", accuracy_score( y_val, model.predict(X_val)))
print("Test Accuracy:", accuracy_score( y_test, model.predict(X_test)))
print("Classification Report:\n", classification_report(y_test, model.predict(X_test), target_names=[index_to_bodytype[i] for i in sorted(index_to_bodytype.keys())]))

# === Save model and label map
with open(os.path.join(MODEL_DIR, "body_type_model_rf.pkl"), "wb") as f:
    pickle.dump(model, f)

with open(os.path.join(MODEL_DIR, "body_type_label_map_rf.pkl"), "wb") as f:
    pickle.dump(index_to_bodytype, f)

print("✅ Random Forest model and label map saved.")