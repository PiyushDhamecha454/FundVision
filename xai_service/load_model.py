import joblib
import os

def load_model():
    MODEL_PATH = os.path.join(
        os.path.dirname(__file__),
        "models",
        "xai_model.pkl"
    )

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f" Model not found at {MODEL_PATH}. Please run train_model.py first.")
    loaded_obj = joblib.load(MODEL_PATH)

    if isinstance(loaded_obj, dict):
        model = loaded_obj.get("model")
        features = loaded_obj.get("features")
    else:
        model, features = loaded_obj  
    return model, features
