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

function App() {
  const [formData, setFormData] = useState({
    username: "",
    riskAppetite: "",
    investmentHorizon: "",
    investmentAmount: "",
    preferredFundTypes: [],
    sectorPreferences: [],
  })

  const fundTypes = [
    "Equity Funds",
    "Bond Funds",
    "Money Market Funds",
    "Index Funds",
    "ETFs",
    "Mutual Funds",
    "Hedge Funds",
    "Real Estate Funds",
  ]

  const sectors = [
    "Technology",
    "Healthcare",
    "Financial Services",
    "Consumer Goods",
    "Energy",
    "Real Estate",
    "Utilities",
    "Materials",
    "Industrials",
    "Telecommunications",
  ]

  const handleCheckboxChange = (value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Will handle form submission here
  }
  return (
    <div>
      {/* <GoogleLoginButton />  */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            {/* Investment Form */}

            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Investment Portfolio Setup</CardTitle>
                  <CardDescription>
                    Help us understand your investment preferences to create a personalized portfolio.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Risk Appetite and Investment Horizon - Side by side on desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="risk-appetite">Risk Appetite</Label>
                        <Select
                          value={formData.riskAppetite}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, riskAppetite: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low Risk</SelectItem>
                            <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                            <SelectItem value="HIGH">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="investment-horizon">Investment Horizon</Label>
                        <Select
                          value={formData.investmentHorizon}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, investmentHorizon: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time horizon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SHORT_TERM">Short Term (1-3 years)</SelectItem>
                            <SelectItem value="MEDIUM_TERM">Medium Term (3-7 years)</SelectItem>
                            <SelectItem value="LONG_TERM">Long Term (7+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Investment Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="investment-amount">Investment Amount (₹)</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <IndianRupee className="h-4 w-4" />
                        </div>
                        <Input
                          id="investment-amount"
                          type="number"
                          placeholder="Enter investment amount"
                          min="0"
                          step="1000"
                          value={formData.investmentAmount}
                          onChange={(e) => setFormData((prev) => ({ ...prev, investmentAmount: e.target.value }))}
                          className="pl-10 pr-4 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          required
                        />
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
                          <button
                            type="button"
                            onClick={() => {
                              const currentValue = Number.parseInt(formData.investmentAmount) || 0
                              setFormData((prev) => ({ ...prev, investmentAmount: (currentValue + 1000).toString() }))
                            }}
                            className="h-4 w-6 flex items-center justify-center text-xs bg-muted hover:bg-muted-foreground/20 rounded-t border border-b-0 transition-colors"
                            aria-label="Increase amount"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const currentValue = Number.parseInt(formData.investmentAmount) || 0
                              if (currentValue >= 1000) {
                                setFormData((prev) => ({ ...prev, investmentAmount: (currentValue - 1000).toString() }))
                              }
                            }}
                            className="h-4 w-6 flex items-center justify-center text-xs bg-muted hover:bg-muted-foreground/20 rounded-b border border-t-0 transition-colors"
                            aria-label="Decrease amount"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Minimum investment: ₹1,000</p>
                    </div>

                    {/* Preferred Fund Types */}
                    <div className="space-y-3">
                      <Label>Preferred Fund Types</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {fundTypes.map((fundType) => (
                          <div key={fundType} className="flex items-center space-x-2">
                            <Checkbox
                              id={`fund-${fundType}`}
                              checked={formData.preferredFundTypes.includes(fundType)}
                              onCheckedChange={() => handleCheckboxChange(fundType, "preferredFundTypes")}
                            />
                            <Label htmlFor={`fund-${fundType}`} className="text-sm font-normal cursor-pointer">
                              {fundType}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sector Preferences */}
                    <div className="space-y-3">
                      <Label>Sector Preferences</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sectors.map((sector) => (
                          <div key={sector} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sector-${sector}`}
                              checked={formData.sectorPreferences.includes(sector)}
                              onCheckedChange={() => handleCheckboxChange(sector, "sectorPreferences")}
                            />
                            <Label htmlFor={`sector-${sector}`} className="text-sm font-normal cursor-pointer">
                              {sector}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button type="submit" className="w-full sm:w-auto">
                        Create Portfolio
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

          </main>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;