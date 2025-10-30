# xai_service/live_insights.py
import os
import requests
from tavily import TavilyClient
from transformers import pipeline

try:
    summarizer = pipeline(
        "summarization",
        model="t5-small",
        tokenizer="t5-small",
        framework="pt",   
        device=-1
    )
except Exception as e:
    print(f" Warning: Summarizer initialization failed: {e}")
    summarizer = None

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

if not TAVILY_API_KEY:
    print(" Warning: Tavily API key not found! Live insights feature will be limited.")
    client = None
else:
    client = TavilyClient(api_key=TAVILY_API_KEY)


def fetch_live_articles(fund_name: str):
    """Fetch top live articles using Tavily"""
    if not client:
        return [{"error": "Tavily API key not configured. Please check .env file."}]

    query = f"{fund_name} mutual fund India performance 2025"
    try:
        results = client.search(query=query, max_results=5)
        return [
            {
                "title": r.get("title"),
                "url": r.get("url"),
                "snippet": r.get("content", "No snippet available")
            }
            for r in results.get("results", [])
        ]
    except Exception as e:
        return [{"error": str(e)}]

def summarize_snippets(snippets):
    """Summarize multiple snippets into a concise paragraph."""
    if not summarizer:
        return "Summarizer not available. Install Transformers or check model download."
    
    text = " ".join(snippets)
    if not text.strip():
        return "No relevant data found."
    
    try:
        summary = summarizer(text, max_length=100, min_length=30, do_sample=False)
        return summary[0]["summary_text"]
    except Exception as e:
        return f"Error while summarizing: {e}"


def get_live_insights(fund_name: str):
    """Fetch and summarize live mutual fund news."""
    articles = fetch_live_articles(fund_name)

    if not articles or "error" in articles[0]:
        return {"error": "No live insights available right now."}

    snippets = [a["snippet"] for a in articles if a.get("snippet")]
    summary = summarize_snippets(snippets)

    return {
        "fund_name": fund_name,
        "summary": summary,
        "top_articles": [
            {"title": a["title"], "url": a["url"]}
            for a in articles if a.get("title") and a.get("url")
        ],
        "total_articles": len(articles)
    }
