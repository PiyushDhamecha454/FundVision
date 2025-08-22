from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from model.shap_explainer import get_shap_explainer
from model.load_model import load_model
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import shap
import os

app = FastAPI(title="Mutual Funds XAI API")

# Load model once
model, feature_names = load_model()

# Absolute path to dataset
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "comprehensive_mutual_funds_data.csv")

# Input schema
class FundInput(BaseModel):
    expense_ratio: float
    aum: float
    rating: float

@app.get("/")
def root():
    return {"message": "Mutual Funds XAI API is running!"}


@app.post("/explain")
def explain_fund(data: FundInput):
    explainer, shap_values, features = get_shap_explainer(data.dict())

    # Get SHAP values for the first prediction
    shap_dict = dict(zip(features.columns, shap_values[0]))

    # Filter only the input features you passed (so response is readable)
    filtered_shap = {k: shap_dict[k] for k in data.dict().keys() if k in shap_dict}

    return {
        "input": data.dict(),
        "shap_values": filtered_shap
    }


@app.get("/summary_plot")
def summary_plot():

    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=['returns_5yr'])
    X = df.drop(columns=['scheme_name', 'fund_manager', 'amc_name',
                         'category', 'sub_category', 'returns_5yr'])
    X = pd.get_dummies(X)
    for col in feature_names:
        if col not in X.columns:
            X[col] = 0
    X = X[feature_names]
    explainer = shap.TreeExplainer(model)
    shap_values_full = explainer(X)
    plt.figure()
    shap.summary_plot(shap_values_full, X, show=False)
    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches='tight')
    plt.close()
    buf.seek(0)
    img_bytes = buf.getvalue()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')

    return {"summary_plot_base64": img_base64}
