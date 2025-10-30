from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import os
import joblib
from xai_service.load_model import load_model
from xai_service.shap_explainer import explain_prediction, generate_summary_plot
from xai_service.live_insights import get_live_insights
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="FundVision XAI API")
origins = [
    "http://localhost:3000",  # Frontend local dev
    "http://127.0.0.1:3000",  # Alternate local
    "https://fundvision.vercel.app",  # Example production frontend (change as needed)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Allow these frontend domains
    allow_credentials=True,
    allow_methods=["*"],             # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],             # Allow all headers
)

MODEL, FEATURES = load_model()
DATA_PATH = os.path.join(os.path.dirname(__file__), "data/comprehensive_mutual_funds_data.csv")

# ---------------- Schema ----------------
class PredictInput(BaseModel):
    expense_ratio: float
    aum: float
    rating: float

class RecommendInput(BaseModel):
    risk_appetite: str = None
    preferred_category: str = None
    expense_preference: str = None
    rating_threshold: float = 0
    aum_preference: str = None

# ---------------- Routes ----------------
@app.get("/")
def home():
    return {"message": "Welcome to FundVision XAI API"}

@app.post("/predict")
def predict(data: PredictInput):
    """Predict and explain a single mutual fund"""
    input_dict = {
        "expense_ratio": data.expense_ratio,
        "fund_size_cr": data.aum,
        "rating": data.rating
    }
    return explain_prediction(input_dict)

@app.post("/recommend")
def recommend(preference: RecommendInput):
    """Recommend top mutual funds based on user preferences"""
    df = pd.read_csv(os.path.join(os.path.dirname(__file__), "data/preprocessed_funds.csv"))

    # Filter by risk_level (numerical 1–6)
    if preference.risk_appetite:
        try:
            risk_level = int(preference.risk_appetite)
            df = df[df["risk_level"] == risk_level]
        except ValueError:
            pass  # ignore invalid inputs

    # Filter by rating threshold
    if preference.rating_threshold > 0:
        df = df[df["rating"] >= preference.rating_threshold]

    # Expense ratio preference
    if preference.expense_preference:
        if preference.expense_preference.lower() == "low":
            df = df[df["expense_ratio"] <= df["expense_ratio"].quantile(0.33)]
        elif preference.expense_preference.lower() == "medium":
            df = df[(df["expense_ratio"] > df["expense_ratio"].quantile(0.33)) &
                    (df["expense_ratio"] <= df["expense_ratio"].quantile(0.66))]
        elif preference.expense_preference.lower() == "high":
            df = df[df["expense_ratio"] > df["expense_ratio"].quantile(0.66)]

    # AUM (fund size) preference
    if preference.aum_preference:
        if preference.aum_preference.lower() == "large":
            df = df[df["fund_size_cr"] >= df["fund_size_cr"].quantile(0.66)]
        elif preference.aum_preference.lower() == "medium":
            df = df[(df["fund_size_cr"] > df["fund_size_cr"].quantile(0.33)) &
                    (df["fund_size_cr"] <= df["fund_size_cr"].quantile(0.66))]
        elif preference.aum_preference.lower() == "small":
            df = df[df["fund_size_cr"] <= df["fund_size_cr"].quantile(0.33)]

    # If all filters removed everything
    if df.empty:
        return {"message": "No funds match your preferences."}

    # Predict expected returns using trained model
    model, features = load_model()
    X = df.drop(columns=["returns_5yr"], errors="ignore")
    X = X.reindex(columns=features, fill_value=0)
    df["predicted_return"] = model.predict(X)

    # Sort and return top 5 recommendations with fund names
    columns_to_show = [
        "scheme_name", "expense_ratio", "fund_size_cr", "rating", "risk_level", "predicted_return"
    ]

    available_cols = [col for col in columns_to_show if col in df.columns]
    top5 = df.nlargest(5, "predicted_return")[available_cols]

    return {
        "recommended_funds": top5.to_dict(orient="records"),
        "count": len(df)
    }

@app.get("/summary_plot")
def shap_summary():
    return {"summary_plot_base64": generate_summary_plot()}

@app.get("/live_insights/{fund_name}")
def live_insights(fund_name: str):
    print(f" Fetching live insights for: {fund_name}")
    try:
        response = get_live_insights(fund_name)
        print(" Response generated successfully")
        return response
    except Exception as e:
        import traceback
        print(" Error in live_insights:", str(e))
        print(traceback.format_exc())
        return {"error": str(e)}
