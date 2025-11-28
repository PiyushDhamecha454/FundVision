import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch("http://localhost:8000/auth/check", {
                method: "GET",
                credentials: "include", // This allows the browser to send the HttpOnly cookie
            });

            if (!res.ok) {
                setUser(null);
                return;
            }

            const data = await res.json();
            setUser(data.user); 
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:8000/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("Logout error", e);
        }
        setUser(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);