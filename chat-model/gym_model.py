import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Step 1: Load Dataset
file_path = "./gymdiet.csv"  # Ensure correct path
df = pd.read_csv(file_path)

# Step 2: Drop unnecessary columns (ID and text-based data like Exercises & Diet)
df = df.drop(columns=['ID'])

# Step 3: Encode Categorical Variables
label_encoders = {}
categorical_columns = ['Sex', 'Hypertension', 'Diabetes', 'Level', 'Fitness Goal', 'Fitness Type', 'Exercises', 'Diet']

for column in categorical_columns:
    le = LabelEncoder()
    df[column] = le.fit_transform(df[column])
    label_encoders[column] = le  # Store encoders for later use

# Step 4: Define Features (X) and Target (y)
target_columns = ['Fitness Type', 'Exercises', 'Diet']  # Multiple targets for prediction
X = df.drop(columns=target_columns)
y = df[target_columns]

# Step 5: Split Data into Train & Test Sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 6: Train Model
# Use MultiOutputClassifier to predict multiple targets
from sklearn.multioutput import MultiOutputClassifier

model = RandomForestClassifier(n_estimators=100, random_state=42)
multi_target_model = MultiOutputClassifier(model, n_jobs=-1)
multi_target_model.fit(X_train, y_train)

# Step 7: Evaluate Model
y_pred = multi_target_model.predict(X_test)

# Calculate accuracy for each target individually
fitness_type_accuracy = accuracy_score(y_test['Fitness Type'], y_pred[:, 0])
exercises_accuracy = accuracy_score(y_test['Exercises'], y_pred[:, 1])
diet_accuracy = accuracy_score(y_test['Diet'], y_pred[:, 2])

# Print individual accuracies
print(f"Fitness Type Accuracy: {fitness_type_accuracy:.2f}")
print(f"Exercises Accuracy: {exercises_accuracy:.2f}")
print(f"Diet Accuracy: {diet_accuracy:.2f}")

# Optionally, calculate the average accuracy
average_accuracy = (fitness_type_accuracy + exercises_accuracy + diet_accuracy) / 3
print(f"Average Accuracy: {average_accuracy:.2f}")

# Step 8: Save Model and Encoders
joblib.dump(multi_target_model, "multi_target_model.pkl")
joblib.dump(label_encoders, "label_encoders.pkl")

print("Model and encoders saved successfully.")

