import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    username?: string;
    email?: string;
    userId?: string;
    setAuthState: (isAuthenticated: boolean, username?: string, email?: string, userId?: string) => void;
    clearAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [userId, setUserId] = useState<string | undefined>(undefined);

    const setAuthState = (isAuthenticated: boolean, username?: string, email?: string, userId?: string) => {
        setIsAuthenticated(isAuthenticated);
        setUsername(username);
        setEmail(email);
        setUserId(userId);
    };

    const clearAuthState = () => {
        setIsAuthenticated(false);
        setUsername(undefined);
        setEmail(undefined);
        setUserId(undefined);
    };

    const value = useMemo(() => ({
        isAuthenticated,
        username,
        email,
        userId,
        setAuthState,
        clearAuthState,
    }), [isAuthenticated, username, email, userId]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};