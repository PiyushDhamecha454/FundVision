import { useState } from "react"
import { Link } from "react-router-dom" // ✅ React Router
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InteractiveBackground from "../components/ui/InteractiveBackground"
import { loginUser } from "../api/auth"

const isDark = document.documentElement.classList.contains("dark");

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });

      const token = res.access_token;

      // You should store token in memory or in context (NOT localStorage ideally)
      sessionStorage.setItem("token", token);

      alert("Login successful!");
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
      console.log(err.response.data)
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <InteractiveBackground
        gradientColors={["#FFA500", "#FFD700"]}
        gradientColorsDark={["#0f0bef", "#ed021a"]}
        angle={40}
        noise={0.3}
        blindCount={64}
        blindMinWidth={5}
        spotlightRadius={0.8}
        spotlightSoftness={1}
        spotlightOpacity={0.6}
        mouseDampening={0.15}
        distortAmount={6}
        shineDirection="left"
      />
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                key={isDark ? 'dark' : 'light'}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 text-black dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}