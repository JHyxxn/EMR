import { createContext, useContext, useMemo, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function useAuthStore() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthStore must be used within <AuthStoreProvider>");
    return ctx;
}

export function AuthStoreProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // 초기에 로딩 상태로 시작

    const login = useCallback(async (username, password) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || '로그인 실패');
            }

            const data = await response.json();
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            setLoading(false);
            return { success: true };
        } catch (error) {
            setLoading(false);
            return { success: false, error: error.message };
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        setLoading(false);
    }, []);

    const checkAuth = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return false;
        }
        
        try {
            const response = await fetch('http://localhost:4000/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
                setLoading(false);
                return false;
            }

            const userData = await response.json();
            setUser(userData);
            setLoading(false);
            return true;
        } catch (error) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            setLoading(false);
            return false;
        }
    }, [token]);

    const isAuthenticated = !!user && !!token;

    const api = useMemo(() => ({
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
    }), [user, token, loading, isAuthenticated, checkAuth]);

    return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}
