import GoogleLoginButton from './components/GoogleLoginButton';
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee } from "lucide-react"
import { ThemeProvider } from "next-themes"
import { Navbar } from './components/Navbar';
import InteractiveBackground from './components/ui/InteractiveBackground'
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { fundNames } from '../../converter/data/fundNames';
import Dashboard from './components/Dashboard';

function App() {
  const [tab, setTab] = useState("explain");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const [formData, setFormData] = useState({
    aum: "",
    rating: 0,
    expenseRatio: 0.0,
  });

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

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          
          {/* Tabs UI */}
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="explain">Explain</TabsTrigger>
              <TabsTrigger value="recommend">Recommend</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

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

            {/* ✅ OTHER TABS PLACEHOLDERS */}
            <TabsContent value="recommend">
              <Card className="p-6 text-center">Recommendation model coming soon…</Card>
            </TabsContent>

            <TabsContent value="summary">
              <Card className="p-6 text-center">Summary of fund metrics will show here</Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card className="p-6 text-center">AI Insights dashboard coming soon…</Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
