import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMounted(true)
    // Detect initial theme from html class
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark")
      setTheme("dark")
    } else {
      document.documentElement.classList.remove("dark")
      setTheme("light")
    }
  }

  if (!mounted) return null

  const isActive = (href) => location.pathname === href

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 fixed w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link to="/">
              <span className="text-xl font-bold cursor-pointer">FundVision</span>
            </Link>
          </div>

          {/* Right side - Theme toggle and auth buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="h-9 w-9 relative"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Link to="/login">
                <Button variant={isActive("/login") ? "default" : "ghost"} size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant={isActive("/signup") ? "default" : "ghost"} size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile auth buttons */}
            <div className="flex sm:hidden">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}