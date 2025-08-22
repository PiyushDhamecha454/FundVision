from .load_model import load_model
import shap 
import pandas as pd 
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "comprehensive_mutual_funds_data.csv")

def get_shap_explainer(input_data=None):
    model, feature_names = load_model()
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

    if input_data:
        input_df = pd.DataFrame([input_data])
        for col in feature_names:
            if col not in input_df.columns:
                input_df[col] = 0
        input_df = input_df[feature_names]
        shap_values = explainer.shap_values(input_df)

        return explainer, shap_values, input_df   
    else:
        return explainer, None, X
