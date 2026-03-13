import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/router";
import type { User, UserRole } from "@/types";
import { api } from "@/lib/api";
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  getUserFromToken,
  isTokenExpired,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerEmployee: (data: {
    name: string;
    email: string;
    password: string;
    department?: string;
    job_title?: string;
  }) => Promise<void>;
  registerAdmin: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken && !isTokenExpired(storedToken)) {
      const userData = getUserFromToken(storedToken);
      setToken(storedToken);
      setUser(userData);
    } else if (storedToken) {
      clearStoredToken();
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = useCallback(
    (newToken: string, role: UserRole) => {
      setStoredToken(newToken);
      setToken(newToken);
      const userData = getUserFromToken(newToken);
      setUser(userData);
      router.push(role === "admin" ? "/admin" : "/chat");
    },
    [router]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.auth.login(email, password);
      handleAuthSuccess(response.token, response.role);
    },
    [handleAuthSuccess]
  );

  const registerEmployee = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      department?: string;
      job_title?: string;
    }) => {
      const response = await api.auth.registerEmployee(data);
      handleAuthSuccess(response.token, response.role);
    },
    [handleAuthSuccess]
  );

  const registerAdmin = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      const response = await api.auth.registerAdmin(data);
      handleAuthSuccess(response.token, response.role);
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        registerEmployee,
        registerAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
