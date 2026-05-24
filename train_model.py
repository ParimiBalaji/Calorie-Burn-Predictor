import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn import metrics
import pickle

def train():
    print("Loading datasets...")
    # Load the datasets from local path
    calories = pd.read_csv('calories.csv')
    exercise = pd.read_csv('exercise.csv')

    print("Preprocessing data...")
    # Combining the two Dataframes as in the original notebook
    calories_data = pd.concat([exercise, calories['Calories']], axis=1)

    # Encode Gender (male: 0, female: 1)
    calories_data.replace({"Gender": {'male': 0, 'female': 1}}, inplace=True)

    # Features (drop User_ID and target Calories)
    X = calories_data.drop(columns=['User_ID', 'Calories'], axis=1)
    Y = calories_data['Calories']

    print(f"Features: {list(X.columns)}")

    # Split into Train & Test (80% train, 20% test, random_state=2)
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=2)

    print("Training XGBoost Regressor model...")
    # Exact default XGBRegressor used in the notebook
    model = XGBRegressor()
    model.fit(X_train, Y_train)

    # Prediction on Test Data to verify accuracy
    test_data_prediction = model.predict(X_test)
    mae = metrics.mean_absolute_error(Y_test, test_data_prediction)
    print(f"Mean Absolute Error: {mae:.6f} calories")

    # Serialize model
    print("Saving model to calorie_model.pkl...")
    with open('calorie_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("Model trained and saved successfully!")

if __name__ == "__main__":
    train()
