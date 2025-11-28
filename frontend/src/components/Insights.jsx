import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Insights = () => {
    const [loading, setLoading] = useState(false);
    const [fundName, setFundName] = useState("");
    const [insightsData, setInsightsData] = useState(null);

    const findInsights = async () => {
        setLoading(true);
        setInsightsData(null); // Clear previous results
        try {
            const res = await fetch(`http://localhost:8000/live_insights/${fundName}`, {
                method: "GET",
                credentials: "include" // Important for HttpOnly cookie
            });
            
            const apiResponse = await res.json();
            console.log("Raw API Response:", apiResponse);

            if (apiResponse.error) {
                setInsightsData({ error: apiResponse.error });
            } 
            // ✅ FIX: Check if the data is wrapped in a 'data' key (which it is in main.py)
            else if (apiResponse.data) {
                setInsightsData(apiResponse.data); 
            } 
            // Fallback: If backend structure changes and sends data directly
            else {
                setInsightsData(apiResponse); 
            }

        } catch (err) {
            console.error(err);
            setInsightsData({ error: "Failed to connect to server" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Card className="bg-background/30 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Live Fund Insights</CardTitle>
                    <CardDescription>Get real-time market insights for a mutual fund</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Enter Fund Name</Label>
                        <Input
                            placeholder="e.g., Tata Digital India Fund"
                            value={fundName}
                            onChange={(e) => setFundName(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full"
                        disabled={!fundName || loading}
                        onClick={findInsights}
                    >
                        {loading ? "Fetching Insights..." : "Fetch Live Insights"}
                    </Button>
                </CardContent>
            </Card>
            
            <div className='mt-8'></div>

            {/* DISPLAY RESULTS */}
            {/* We check insightsData?.summary to ensure we have the actual data content */}
            {insightsData && !insightsData.error && (
                <div className="space-y-6 text-lg animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* SUMMARY */}
                    <Card className="p-6 border shadow-sm text-black dark:text-white">
                        <h4 className="font-semibold text-2xl mb-4">Summary</h4>
                        <div className="text-black dark:text-white leading-relaxed">
                            {insightsData.summary || "No summary available"}
                        </div>
                    </Card>

                    {/* ARTICLES */}
                    <Card className="p-6 border shadow-sm">
                        <h4 className="font-semibold text-xl mb-4">Top News Articles</h4>
                        <ul className="space-y-3">
                            {insightsData.top_articles?.map((article, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="mt-1">📰</span>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                    >
                                        {article.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="text-sm text-muted-foreground mt-4 border-t pt-2">
                            Total Sources: {insightsData.total_articles}
                        </p>
                    </Card>
                </div>
            )}

            {insightsData?.error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive font-medium mt-4">
                    ⚠️ {insightsData.error}
                </div>
            )}
        </>
    )
}

export default Insights