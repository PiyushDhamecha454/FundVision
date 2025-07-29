import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">FundVision</h1>
          </div>

          {/* Right side - Theme toggle and auth buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="h-9 w-9 relative"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Login
              </Button>
              <Button size="sm">Sign Up</Button>
            </div>

            {/* Mobile auth buttons */}
            <div className="flex sm:hidden">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}