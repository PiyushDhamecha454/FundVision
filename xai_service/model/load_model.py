import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "rf_model_with_features.pkl")

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    data = joblib.load(MODEL_PATH)
    model = data["model"]
    feature_names = data["features"]
    return model, feature_names
