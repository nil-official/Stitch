import os, warnings, random, pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

def create_dataset(n=2000):
    data = []
    for _ in range(n):
        age = random.randint(5, 80)
        height = random.randint(100, 180) if age < 18 else random.randint(120, 210)
        weight = random.randint(20, 80) if age < 18 else random.randint(40, 200)
        bmi = weight / (height / 100)**2 + (1 if age > 60 else -1 if age < 18 else 0)
        if bmi < 16: label = "Extremely Weak"
        elif bmi < 18.5: label = "Weak"
        elif bmi < 25: label = "Normal"
        elif bmi < 30: label = "Overweight"
        elif bmi < 35: label = "Obesity"
        else: label = "Extreme Obesity"
        data.append([height, weight, age, label])
    return pd.DataFrame(data, columns=["Height", "Weight", "Age", "BodyType"])

df = create_dataset(2000)
encoder = LabelEncoder()
df['BodyTypeIndex'] = encoder.fit_transform(df['BodyType'])

df.to_csv(os.path.join(DATA_DIR, "bmiagedataset_encoded.csv"), index=False)

X, y = df[['Height', 'Weight', 'Age']], df['BodyTypeIndex']
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5)

model = LogisticRegression(multi_class='multinomial', solver='lbfgs', max_iter=1000)
model.fit(X_train, y_train)

print("Validation Accuracy:", accuracy_score(y_val, model.predict(X_val)))
print("Test Accuracy:", accuracy_score(y_test, model.predict(X_test)))
print("Classification Report:\n", classification_report(y_test, model.predict(X_test), target_names=encoder.classes_))

with open(os.path.join(MODEL_DIR, "body_type_model.pkl"), "wb") as f:
    pickle.dump(model, f)
with open(os.path.join(MODEL_DIR, "body_type_label_encoder.pkl"), "wb") as f:
    pickle.dump(encoder, f)