import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting if not logged in
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Dashboard from './Dashboard';
import { useAuth } from "@/context/AuthContext"; // ✅ Import Context

const Explain = () => {
    const { user, loading: authLoading } = useAuth(); // ✅ Get Auth State
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [formData, setFormData] = useState({
        aum: "",
        rating: 0,
        expenseRatio: 0.0,
    });

    // ✅ Redirect if not logged in (Optional UX improvement)
    useEffect(() => {
        if (!authLoading && !user) {
            // Uncomment the line below if you want to force redirect
            // navigate("/login");
        }
    }, [user, authLoading, navigate]);

    const handleSubmitExplain = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("You must be logged in to use this feature.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ Still required to send the HttpOnly cookie
                body: JSON.stringify({
                    expense_ratio: Number(formData.expenseRatio),
                    aum: Number(formData.aum),
                    rating: Number(formData.rating)
                })
            });

            if (res.status === 401) {
                alert("Session expired. Please login again.");
                // create a logout function in context or just redirect
                navigate("/login"); 
                return;
            }

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Explain API failed");
            }

            const data = await res.json();
            console.log("Explain Response:", data);
            setApiResponse(data.result);
        } catch (err) {
            console.error("Error:", err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (authLoading) return <div>Loading user...</div>;

    return (
        <>
            <Card className="bg-background/30 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Explain Fund Behavior</CardTitle>
                    <CardDescription>
                        {user ? `Welcome, ${user.name || user.email}. ` : ""} 
                        Enter fund metrics to analyze stock behavior.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitExplain} className="space-y-6">

                        {/* AUM */}
                        <div>
                            <Label>AUM</Label>
                            <Input
                                type="number"
                                placeholder="Enter AUM"
                                value={formData.aum}
                                onChange={(e) => setFormData(prev => ({ ...prev, aum: e.target.value }))}
                                required
                                className="mt-2"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <Label>Rating</Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[formData.rating]}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value[0] }))}
                                    min={0}
                                    max={5}
                                    step={1}
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="1"
                                    value={formData.rating}
                                    onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                                    className="w-20 text-center"
                                />
                            </div>
                        </div>

                        {/* Expense Ratio */}
                        <div>
                            <Label>Expense Ratio</Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[formData.expenseRatio]}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, expenseRatio: value[0] }))}
                                    min={0}
                                    max={5}
                                    step={0.01}
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.01"
                                    value={formData.expenseRatio}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, expenseRatio: parseFloat(e.target.value) || 0 }))
                                    }
                                    className="w-20 text-center"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={!formData.aum || loading}>
                            {loading ? "Explaining..." : "Explain"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Show Dashboard if API returned data */}
            {apiResponse && <Dashboard data={{ ...formData, ...apiResponse }} />}
        </>
    )
}

export default Explain;