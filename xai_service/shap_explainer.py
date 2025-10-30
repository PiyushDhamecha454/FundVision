import shap
import pandas as pd
import base64
import matplotlib.pyplot as plt
from io import BytesIO
import joblib
import os
import numpy as np
from xai_service.load_model import load_model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "comprehensive_mutual_funds_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "data", "model", "xai_model.pkl")

def explain_prediction(input_dict):
    """Explain single prediction using SHAP values."""
    model, feature_names = load_model()

    df_input = pd.DataFrame([input_dict])
    for col in feature_names:
        if col not in df_input.columns:
            df_input[col] = 0

    df_input = df_input[feature_names]
    df_input = df_input.apply(pd.to_numeric, errors="coerce").fillna(0)

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(df_input)

    prediction = model.predict(df_input)[0]

    shap_impact = {}
    for i, col in enumerate(feature_names):
        value = float(shap_values[0][i])
        if not np.isfinite(value):  # filter out inf/nan
            value = 0.0
        shap_impact[col] = value

    top_features = dict(
        sorted(shap_impact.items(), key=lambda x: abs(x[1]), reverse=True)[:10]
    )

    return {
        "predicted_return": float(prediction),
        "top_feature_impact": top_features,
    }

def generate_summary_plot():
    """Generate SHAP global summary plot and return as base64 string."""
    model, feature_names = load_model()
    df = pd.read_csv(DATA_PATH)

    drop_cols = ["scheme_name", "fund_manager", "amc_name", "returns_5yr"]
    X = df.drop(columns=[c for c in drop_cols if c in df.columns], errors="ignore")
    X = pd.get_dummies(X)
    X = X.fillna(X.mean())
    X = X.reindex(columns=feature_names, fill_value=0)
    X = X.apply(pd.to_numeric, errors="coerce").fillna(0)

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)

    plt.figure(figsize=(8, 6))
    shap.summary_plot(shap_values, X, show=False, max_display=15)
    buf = BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png", bbox_inches="tight", dpi=120)
    buf.seek(0)
    plt.close()
    return base64.b64encode(buf.getvalue()).decode("utf-8")
