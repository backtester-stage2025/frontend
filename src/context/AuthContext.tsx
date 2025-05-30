import {createContext, ReactNode, useContext, useMemo, useState} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    username?: string;
    email?: string;
    userId?: string;
    picture?: string
    currencyPreference?: string;
    setCurrencyPreference: (currency: string) => void;
    setAuthState: (isAuthenticated: boolean, username?: string, email?: string, userId?: string,
                   picture?: string, currencyPreference?: string) => void;
    clearAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [picture, setPicture] = useState<string | undefined>(undefined);
    const [currencyPreference, setCurrencyPreference] = useState<string | undefined>(undefined);

    const setAuthState = (isAuthenticated: boolean, username?: string, email?: string, userId?: string,
                          picture?: string, currencyPreference?: string) => {
        setIsAuthenticated(isAuthenticated);
        setUsername(username);
        setEmail(email);
        setUserId(userId);
        setPicture(picture);
        setCurrencyPreference(currencyPreference);
    };

    const clearAuthState = () => {
        setIsAuthenticated(false);
        setUsername(undefined);
        setEmail(undefined);
        setUserId(undefined);
        setPicture(undefined);
        setCurrencyPreference(undefined);
    };

    const value = useMemo(() => ({
        isAuthenticated,
        username,
        email,
        userId,
        picture,
        currencyPreference,
        setCurrencyPreference,
        setAuthState,
        clearAuthState,
    }), [isAuthenticated, username, email, userId, picture, currencyPreference]);

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
