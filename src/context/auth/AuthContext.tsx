import React, { createContext, useContext, useState } from 'react';
import { LoginRequest, LoginResponse } from '../../interfaces/common-interfaces';

const COCKPIT_API_URL: string = import.meta.env.VITE_COCKPIT_API_URL ?? '';
const AUTH_RESOURCE: string = `${COCKPIT_API_URL}/api/auth/login`;
const TOKEN_KEY = 'djescape_access_token';

interface AuthContextType {
    token: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

    const login = async (credentials: LoginRequest): Promise<void> => {
        const response = await fetch(AUTH_RESOURCE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const data: LoginResponse = await response.json();
        localStorage.setItem(TOKEN_KEY, data.tokens.accessToken);
        setToken(data.tokens.accessToken);
    };

    const logout = (): void => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
