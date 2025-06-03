import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
df = pd.read_csv("data/sized_dataset.csv")  # Ensure it has 'height', 'weight', 'shirt_size', 'trouser_size'

# Feature matrix
X = df[['Height', 'Weight']]

# Label encoders
le_shirt = LabelEncoder()
le_trouser = LabelEncoder()

# Target matrix
y = pd.DataFrame({
    'shirt_size': le_shirt.fit_transform(df['shirt_size']),
    'trouser_size': le_trouser.fit_transform(df['trouser_size'])
})

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = MultiOutputClassifier(RandomForestClassifier(n_estimators=100, random_state=42))
model.fit(X_train, y_train)

# Save model and encoders
joblib.dump(model, "models/size_prediction_model2.pkl")
joblib.dump(le_shirt, "models/shirt_size_encoder2.pkl")
joblib.dump(le_trouser, "models/trouser_size_encoder2.pkl")

print("Model and encoders saved successfully.")