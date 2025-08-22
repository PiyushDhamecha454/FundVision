import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# Absolute path to project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "comprehensive_mutual_funds_data.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "rf_model_with_features.pkl")

def train_model():
    # Load dataset
    df = pd.read_csv(DATA_PATH)

    # Drop rows with NaN target
    df = df.dropna(subset=['returns_5yr'])

    # Features and target
    X = df.drop(columns=['scheme_name', 'fund_manager', 'amc_name',
                         'category', 'sub_category', 'returns_5yr'])
    X = pd.get_dummies(X)
    y = df['returns_5yr']

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save model with features
    joblib.dump({"model": model, "features": X.columns.tolist()}, MODEL_PATH)
    print(f"Model with features saved at {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
