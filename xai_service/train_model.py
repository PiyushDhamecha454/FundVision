# xai_service/train_model.py
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "data/comprehensive_mutual_funds_data.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models/xai_model.pkl")
PREPROCESSED_PATH = os.path.join(os.path.dirname(__file__), "data/preprocessed_funds.csv")

def train_and_save_model():
    
    df = pd.read_csv(DATA_PATH)
    if "scheme_name" not in df.columns:
        raise ValueError(" 'scheme_name' column not found in dataset!")

    drop_cols = ['fund_manager', 'amc_name']
    df = df.drop(columns=[c for c in drop_cols if c in df.columns], errors='ignore')

    y = df['returns_5yr']
    X = df.drop(columns=['returns_5yr', 'scheme_name'], errors='ignore')

    numeric_cols = X.select_dtypes(include=['number']).columns
    X[numeric_cols] = X[numeric_cols].apply(pd.to_numeric, errors='coerce')

    categorical_cols = X.select_dtypes(exclude=['number']).columns
    X = pd.get_dummies(X, columns=categorical_cols, drop_first=True)

    X = X.fillna(X.mean())
    y = y.fillna(y.mean())

    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X, y)
 
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump({"model": model, "features": X.columns.tolist()}, MODEL_PATH)
    print(f" Model saved at {MODEL_PATH}")

    df_preprocessed = df[['scheme_name']].copy()
    df_preprocessed = pd.concat([df_preprocessed, X], axis=1)
    df_preprocessed["returns_5yr"] = y

    os.makedirs(os.path.dirname(PREPROCESSED_PATH), exist_ok=True)
    df_preprocessed.to_csv(PREPROCESSED_PATH, index=False)
    print(f" Preprocessed data saved at {PREPROCESSED_PATH}")


if __name__ == "__main__":
    train_and_save_model()
