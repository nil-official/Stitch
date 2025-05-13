import os, warnings, pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, log_loss

warnings.filterwarnings("ignore")

DATA_PATH = "ml/app/training/data/bmiagedataset_encoded.csv"
MODEL_PATH = "ml/app/training/models/body_type_model_log.pkl"
LABEL_MAPPING_PATH = "ml/app/training/models/body_type_label_mapping_log.pkl"

# Label Mapping
BODY_TYPE_LABELS = {
    0: "Extremely Weak",
    1: "Weak",
    2: "Normal",
    3: "Overweight",
    4: "Obesity",
    5: "Extreme Obesity"
}

# Load dataset
df = pd.read_csv(DATA_PATH)

# Ensure required columns
required_columns = {'Height', 'Weight', 'Age', 'BodyTypeIndex'}
assert required_columns.issubset(df.columns), f"Dataset must include {required_columns}"

# Train/Test split
X = df[['Height', 'Weight', 'Age']]
y = df['BodyTypeIndex']
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5)

# Train model
model = LogisticRegression(multi_class='multinomial', solver='lbfgs', max_iter=1000)
model.fit(X_train, y_train)

# Evaluation
print("📊 Validation Accuracy:", accuracy_score(y_val, model.predict(X_val)))
print("📊 Test Accuracy:", accuracy_score(y_test, model.predict(X_test)))
print("\n📋 Classification Report:\n", classification_report(y_test, model.predict(X_test), target_names=list(BODY_TYPE_LABELS.values())))

# Save model and label mapping
with open(MODEL_PATH, "wb") as f:
    pickle.dump(model, f)
with open(LABEL_MAPPING_PATH, "wb") as f:
    pickle.dump(BODY_TYPE_LABELS, f)

print("✅ Model and label mapping saved.")
