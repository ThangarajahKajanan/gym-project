from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)

CORS(app)

# Load the trained model and encoders
model = joblib.load("multi_target_model.pkl")
label_encoders = joblib.load("label_encoders.pkl")

# Features used for prediction (ensure these are the same as the ones used for training)
feature_columns = ['Sex', 'Age', 'Height', 'Weight', 'Hypertension', 'Diabetes', 'BMI', 'Level', 'Fitness Goal']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        # Ensure all required fields are present
        required_fields = ["Sex", "Age", "Height", "Weight", "Hypertension", "Diabetes", "BMI", "Level", "FitnessGoal"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400
        
        # Rename the "FitnessGoal" field to "Fitness Goal"
        if "FitnessGoal" in data:
            data["Fitness Goal"] = data.pop("FitnessGoal")
        
        # Convert data to DataFrame
        df = pd.DataFrame([data])

        # Encode categorical variables
        for column in label_encoders:
            if column in df:
                df[column] = label_encoders[column].transform(df[column])

        # Ensure correct column order
        df = df[feature_columns]

        # Make prediction for all targets: Fitness Type, Exercises, and Diet
        prediction = model.predict(df)

        # Decode the predictions (convert back to original category)
        fitness_type = label_encoders['Fitness Type'].inverse_transform([prediction[0][0]])[0]
        exercises = label_encoders['Exercises'].inverse_transform([prediction[0][1]])[0]
        diet = label_encoders['Diet'].inverse_transform([prediction[0][2]])[0]

        # Return the predictions as a JSON response
        return jsonify({
            "fitness_type": fitness_type,
            "exercises": exercises,
            "diet": diet
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

