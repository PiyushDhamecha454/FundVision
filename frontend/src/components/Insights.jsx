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
        try {
            const res = await fetch(`http://127.0.0.1:8000/live_insights/${fundName}`);
            const data = await res.json();
            console.log("Insights:", data);
            setInsightsData(data);
        } catch {
            alert("Error fetching insights");
        }
        setLoading(false);
    }

    return (
        <>
            <Card className="bg-background/30 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Live Fund Insights</CardTitle>
                    <CardDescription>Get real-time market insights for a mutual fund</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                    {/* FUND INPUT */}
                    <div className="space-y-2">
                        <Label>Enter Fund Name</Label>
                        <Input
                            placeholder="e.g., SBI Bluechip Fund"
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
            <div className='mt-9'></div>
            {/* DISPLAY RESULTS */}
            {insightsData && !insightsData.error && (
                <div className="space-y-6 text-lg">

                    {/* SUMMARY */}
                    <Card className="p-5 border">
                        <h4 className="font-semibold text-3xl text-black">Summary</h4>
                        <p className="text-gray-700">{insightsData.summary || "No summary available"}</p>
                    </Card>

                    {/* ARTICLES */}
                    <div className='ml-3'>
                        <h4 className="font-semibold text-lg mb-2">Top News Articles</h4>
                        <ul className="space-y-2">
                            {insightsData.top_articles?.map((article, index) => (
                                <li key={index}>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        🔗 {article.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="text-sm text-gray-500 mt-2 ml-2">
                            Total Articles: {insightsData.total_articles}
                        </p>
                    </div>
                </div>
            )}

            {insightsData?.error && (
                <p className="text-red-500 mt-4 font-medium">
                    ⚠️ {insightsData.error}
                </p>
            )}
        </>
    )
}

export default Insights