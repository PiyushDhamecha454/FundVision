import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "next-themes"
import { Navbar } from './components/Navbar';
import InteractiveBackground from './components/ui/InteractiveBackground'
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Dashboard from './components/Dashboard';
import shapPlot from "@/assets/image.png";


function App() {
  const [tab, setTab] = useState("explain");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const [formData, setFormData] = useState({
    aum: "",
    rating: 0,
    expenseRatio: 0.0,
  });

  const [recommendForm, setRecommendForm] = useState({
    risk_appetite: "",
    preferred_category: "",
    expense_preference: "",
    rating_threshold: 0,
    aum_preference: "",
  });

  const [recommendResponse, setRecommendResponse] = useState(null);

  const [fundName, setFundName] = useState("");
  const [insightsData, setInsightsData] = useState(null);


  const handleSubmitExplain = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expense_ratio: Number(formData.expenseRatio),
          aum: Number(formData.aum),
          rating: Number(formData.rating)
        })
      });

      const data = await res.json();
      console.log("Explain Response:", data);
      setApiResponse(data);
    } catch (err) {
      console.error("Error:", err);
      alert("Explain API failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <div className="min-h-screen bg-background/5 relative">
        <InteractiveBackground />
        <Navbar />
        {/* Landing Page */}
        <h1 className="flex justify-center text-9xl pt-40 pb-30 glow-yellow font-semibold">
          FundVision
        </h1>

        {/* Functions */}
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Tabs UI */}
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <div className="flex justify-center">
              <TabsList className='flex gap-32 mb-6 flex-wrap'>
                <TabsTrigger value="explain">Explain</TabsTrigger>
                <TabsTrigger value="recommend">Recommend</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
            </div>
            {/* ✅ EXPLAIN TAB */}
            <TabsContent value="explain">
              <Card className="bg-background/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Explain Fund Behavior</CardTitle>
                  <CardDescription>Enter fund metrics to analyze stock behavior.</CardDescription>
                </CardHeader>
                <CardContent>

                  <form onSubmit={handleSubmitExplain} className="space-y-6">

                    {/* AUM */}
                    <div>
                      <Label>AUM</Label>
                      <div className='mt-2'></div>
                      <Input
                        type="number"
                        placeholder="Enter AUM"
                        value={formData.aum}
                        onChange={(e) => setFormData(prev => ({ ...prev, aum: e.target.value }))}
                        required
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

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Explaining..." : "Explain"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Show Dashboard if API returned data */}
              {apiResponse && (
                <Dashboard data={{ ...formData, ...apiResponse }} />
              )}
            </TabsContent>

            <TabsContent value="recommend">
              <Card className="bg-background/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Fund Recommendation</CardTitle>
                  <CardDescription>Tell us your investment preferences</CardDescription>
                </CardHeader>

                <CardContent>
                  <form
                    className="space-y-6"
                    onSubmit={async (e) => {
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
                    }}
                  >

                    {/* RISK APPETITE */}
                    <div>
                      <Label>Risk Appetite</Label>
                      <div className='mt-2'></div>
                      <Select
                        onValueChange={(v) => setRecommendForm(prev => ({ ...prev, risk_appetite: v }))}
                      >
                        <SelectTrigger><SelectValue placeholder="Select risk level" /></SelectTrigger>
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

                    {/* RATING THRESHOLD (Slider) */}
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

                    <Button type="submit" className="w-full" disabled={loading}>
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
            </TabsContent>

            <TabsContent value="summary">
              <div className="space-y-6">

                {/* IMAGE */}
                <Card className="p-6 flex flex-col items-center bg-background">
                  <img src={shapPlot} />
                </Card>

                {/* LLM SUMMARY */}
                <Card className="p-6 space-y-3 bg-background backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-center">Model Feature Impact Summary</h3>

                  <p>
                    The plot shows how mutual fund features influence the model's prediction. Higher bars reflect
                    stronger impact on fund score/performance.
                  </p>

                  <table className="w-full text-sm border rounded-lg overflow-hidden">
                    <thead className="font-medium">
                      <tr>
                        <th className="p-2 text-left">Feature</th>
                        <th className="p-2 text-left">Behavior</th>
                        <th className="p-2 text-left">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="p-2 font-medium">3-Year Returns</td><td className="p-2">High variation</td><td className="p-2 text-green-600">Strong positive</td></tr>
                      <tr><td className="p-2 font-medium">Fund Age</td><td className="p-2">Older funds outperform</td><td className="p-2 text-green-600">Positive</td></tr>
                      <tr><td className="p-2 font-medium">Rating</td><td className="p-2">1–5 stars</td><td className="p-2 text-green-600">Higher = Better</td></tr>
                      <tr><td className="p-2 font-medium">Expense Ratio</td><td className="p-2">0.1%–2%+</td><td className="p-2 text-red-600">Lower = Better</td></tr>
                      <tr><td className="p-2 font-medium">1-Year Returns</td><td className="p-2">More unstable</td><td className="p-2 text-green-600">Positive <p className='text-red-600'>(weaker)</p></td></tr>
                      <tr><td className="p-2 font-medium">Fund Size (AUM)</td><td className="p-2">Small → Large</td><td className="p-2 text-green-600">Slight edge large</td></tr>
                      <tr><td className="p-2 font-medium">Risk Level</td><td className="p-2">Low → High</td><td className="p-2 text-green-600">Higher = Better</td></tr>
                      <tr><td className="p-2 font-medium">Min SIP/Lumpsum</td><td className="p-2">₹100–₹10k+</td><td className="p-2 text-red-600">Lower = Better</td></tr>
                    </tbody>
                  </table>

                  <p className="text-sm text-gray-600 italic text-center">
                    Worst-scoring categories include FoFs, Gilt, Credit Risk, and Low-Duration funds.
                  </p>

                  <p className="font-semibold text-center text-green-500">
                    🔎 Top-performing funds: high 3-year returns, low expenses, high ratings, older age, higher risk.
                  </p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights">
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
                    onClick={async () => {
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
                    }}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
