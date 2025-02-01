import { useState, useEffect, useCallback, createContext, useContext } from "react";
import axiosInstance from "../axiosInstance";


export const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // New state for loading
  // Verify token validity
  const verifyToken = useCallback(async () => {
    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        await axiosInstance.post("token/verify/", { token });
        setIsAuthenticated(true);
    } catch {
        setIsAuthenticated(false);
    } finally {
        setLoading(false);
    }
}, []);

// Refresh token periodically
const refreshToken = useCallback(async () => {
    try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) {
            setIsAuthenticated(false);
            return;
        }

        const response = await axiosInstance.post("token/refresh/", { refresh });
        localStorage.setItem("access_token", response.data.access);
        setIsAuthenticated(true);
    } catch {
        setIsAuthenticated(false);
    }
}, []);

    // Initial verification and refresh every 23 hour
    useEffect(() => {
        verifyToken(); // Verify token on initial load
        const interval = setInterval(() => {
            refreshToken();
        }, 23 * 60 * 60 * 1000); // Refresh every 23 hour

        refreshToken(); // Initial Refresh on load

        return () => clearInterval(interval);
    }, [verifyToken , refreshToken]);

    return (
        <AuthContext.Provider value={{isAuthenticated, loading, setIsAuthenticated ,refreshToken, verifyToken }}>
            {children}
        </AuthContext.Provider>
    );
};

