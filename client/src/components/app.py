# from flask import Flask, request, jsonify
# import numpy as np
# import pandas as pd
# import xgboost as xgb
# from sklearn.model_selection import train_test_split, GridSearchCV
# from sklearn.preprocessing import StandardScaler
# from imblearn.over_sampling import SMOTE
# from flask_cors import CORS  # Import for enabling CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Load and preprocess the data
# data = pd.read_csv('C:/Users/jahna/Desktop/heart.csv')

# # Feature selection
# X = data[['age', 'sex', 'cp', 'trtbps', 'thalachh', 'oldpeak']]
# y = data['output']

# # Scale the features
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)

# # Handle class imbalance with SMOTE
# smote = SMOTE(random_state=42)
# X_resampled, y_resampled = smote.fit_resample(X_scaled, y)

# # Split the data into training and testing sets
# X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# # Train the XGBoost model with hyperparameter tuning
# model = xgb.XGBClassifier(random_state=42)
# param_grid = {
#     'n_estimators': [100, 200],
#     'learning_rate': [0.01, 0.1, 0.2],
#     'max_depth': [3, 4, 5, 6],
#     'subsample': [0.8, 1.0]
# }

# grid_search = GridSearchCV(model, param_grid, scoring='accuracy', cv=5)
# grid_search.fit(X_train, y_train)

# # Best model from grid search
# best_model = grid_search.best_estimator_

# # Function to predict future heart disease risk
# def predict_future_heart_disease(model, patient_data, scaler, future_years=5):
#     patient_data_df = pd.DataFrame([patient_data], columns=['age', 'sex', 'cp', 'trtbps', 'thalachh', 'oldpeak'])
#     patient_data_scaled = scaler.transform(patient_data_df)
    
#     future_predictions = []
#     current_data = patient_data_scaled[0].copy()
#     disease_present = model.predict([current_data])[0]
#     future_predictions.append({'year': 2024, 'risk': int(disease_present)})

#     for year in range(1, future_years):
#         current_data[0] += 1  # Increase age
#         # Simulate health improvements after the first year
#         if year == 1:
#             current_data[3] -= 20  # Decrease blood pressure
#             current_data[4] += 20  # Increase max heart rate
#             current_data[5] -= 1.0  # Decrease oldpeak

#         # Predict heart disease risk for the updated features
#         prediction = model.predict([current_data])
#         future_predictions.append({'year': 2024 + year, 'risk': int(prediction[0])})

#     return future_predictions

# @app.route('/predict', methods=['POST'])
# def predict_heart_attack():
#     data = request.json
#     user_input = [
#         data['age'], data['sex'], data['cp'], data['trtbps'], 
#         data['thalachh'], data['oldpeak']
#     ]

#     # Predict heart disease risk for the next 5 years
#     predictions = predict_future_heart_disease(best_model, user_input, scaler, future_years=5)

#     return jsonify(predictions)

# if __name__ == '__main__':
#     app.run(debug=True)


# app.py
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load and preprocess the data
data = pd.read_csv('C:/Users/jahna/Desktop/heart.csv')
X = data[['age', 'sex', 'cp', 'trtbps', 'thalachh', 'oldpeak']]
y = data['output']

# Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Handle class imbalance with SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_scaled, y)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# Train the XGBoost model with hyperparameter tuning
model = xgb.XGBClassifier(random_state=42)
param_grid = {
    'n_estimators': [100, 200],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 4, 5, 6],
    'subsample': [0.8, 1.0]
}
grid_search = GridSearchCV(model, param_grid, scoring='accuracy', cv=5)
grid_search.fit(X_train, y_train)
best_model = grid_search.best_estimator_

def predict_future_heart_disease(model, patient_data, scaler, future_years=5):
    patient_data_df = pd.DataFrame([patient_data], columns=['age', 'sex', 'cp', 'trtbps', 'thalachh', 'oldpeak'])
    patient_data_scaled = scaler.transform(patient_data_df)
    
    future_predictions = []
    current_data = patient_data_scaled[0].copy()
    disease_present = model.predict([current_data])[0]
    future_predictions.append({'year': 2024, 'risk': int(disease_present)})

    for year in range(1, future_years):
        current_data[0] += 1
        if year == 1:
            current_data[3] -= 20
            current_data[4] += 20
            current_data[5] -= 1.0

        prediction = model.predict([current_data])
        future_predictions.append({'year': 2024 + year, 'risk': int(prediction[0])})

    return future_predictions

@app.route('/predict', methods=['POST'])
def predict_heart_attack():
    data = request.json
    print("Received data in Flask:", data)

    user_input = [
        data['age'], data['sex'], data['cp'], data['trtbps'], 
        data['thalachh'], data['oldpeak']
    ]

    predictions = predict_future_heart_disease(best_model, user_input, scaler, future_years=5)
    print("successfully sent")
    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)
