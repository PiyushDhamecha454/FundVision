import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

const Recommend = () => {

    const [loading, setLoading] = useState(false);

    const [recommendForm, setRecommendForm] = useState({
        risk_appetite: "",
        preferred_category: "",
        expense_preference: "",
        rating_threshold: 0,
        aum_preference: "",
    });

    const [recommendResponse, setRecommendResponse] = useState(null);

    const recommend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(recommendForm),
            });

            const data = await res.json();
            console.log("Recommend Response:", data);
            setRecommendResponse(data);
        } catch (e) {
            alert("Recommendation API failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card className="bg-background/30 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Fund Recommendation</CardTitle>
                    <CardDescription>Tell us your investment preferences</CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="space-y-6" onSubmit={recommend}>
                        {/* RISK APPETITE */}
                        <div>
                            <Label>Risk Appetite</Label>
                            <div className='mt-2'></div>
                            <Select
                                onValueChange={(v) => setRecommendForm(prev => ({ ...prev, risk_appetite: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* PREFERRED CATEGORY */}
                        <div>
                            <Label>Preferred Category</Label>
                            <div className='mt-2'></div>
                            <Select
                                onValueChange={(v) => setRecommendForm(prev => ({ ...prev, preferred_category: v }))}
                            >
                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="debt">Debt</SelectItem>
                                    <SelectItem value="equity">Equity</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="solution_oriented">Solution Oriented</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* EXPENSE PREFERENCE */}
                        <div>
                            <Label>Expense Preference</Label>
                            <div className='mt-2'></div>
                            <Select
                                onValueChange={(v) => setRecommendForm(prev => ({ ...prev, expense_preference: v }))}
                            >
                                <SelectTrigger><SelectValue placeholder="Select expense preference" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* RATING THRESHOLD */}
                        <div>
                            <Label>Rating Threshold</Label>
                            <div className='mt-2'></div>
                            <div className='flex'>
                                <Slider
                                    value={[recommendForm.rating_threshold]}
                                    min={0}
                                    max={5}
                                    step={1}
                                    onValueChange={(v) =>
                                        setRecommendForm(prev => ({ ...prev, rating_threshold: v[0] }))
                                    }
                                />
                                <div className='mr-3'></div>
                                <Input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="1"
                                    value={recommendForm.rating_threshold}
                                    onChange={(e) =>
                                        setRecommendForm(prev => ({
                                            ...prev,
                                            rating_threshold: Number(e.target.value)
                                        }))
                                    }
                                    className="w-20 text-center"
                                />
                            </div>
                        </div>

                        {/* AUM PREFERENCE */}
                        <div>
                            <Label>AUM Preference</Label>
                            <div className='mt-2'></div>
                            <Select
                                onValueChange={(v) => setRecommendForm(prev => ({ ...prev, aum_preference: v }))}
                            >
                                <SelectTrigger><SelectValue placeholder="Select AUM size" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full" disabled={!(recommendForm.risk_appetite && recommendForm.preferred_category && recommendForm.aum_preference && recommendForm.expense_preference) || loading}>
                            {loading ? "Recommending..." : "Get Recommendations"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {recommendResponse && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Recommended Funds</h3>
                    {recommendResponse.recommended_funds?.map((fund, i) => (
                        <Card key={i} className="p-4 mb-4">
                            <p><strong>Scheme Name:</strong> {fund.scheme_name}</p>
                            <p><strong>Expense Ratio:</strong> {fund.expense_ratio}</p>
                            <p><strong>Fund Size (Cr):</strong> {fund.fund_size_cr}</p>
                            <p><strong>Rating:</strong> {fund.rating}</p>
                            <p><strong>Risk Level:</strong> {fund.risk_level}</p>
                            <p><strong>Predicted Return:</strong> {fund.predicted_return}%</p>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
};

export default Recommend;