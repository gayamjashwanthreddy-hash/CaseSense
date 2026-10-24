"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { SEED_USERS } from "@/lib/api/seedData";
import { loginOfficialApi, clearStoredAuth, getStoredAuthToken } from "@/lib/api/remoteClient";

interface RoleContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  availableUsers: UserProfile[];
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(SEED_USERS[0]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    CaseBridgeStore.init();
    const storedToken = getStoredAuthToken();
    setToken(storedToken);

    if (storedToken) {
      const stored = CaseBridgeStore.getCurrentUser();
      if (stored) {
        setCurrentUserState(stored);
      }
    }
    setIsLoadingAuth(false);

    const handleUpdate = () => {
      const updatedToken = getStoredAuthToken();
      setToken(updatedToken);
      if (updatedToken) {
        setCurrentUserState(CaseBridgeStore.getCurrentUser());
      }
    };

    window.addEventListener("casebridge_store_updated", handleUpdate);
    return () => window.removeEventListener("casebridge_store_updated", handleUpdate);
  }, []);

  const setCurrentUser = (user: UserProfile) => {
    CaseBridgeStore.setCurrentUser(user);
    setCurrentUserState(user);
    if (typeof window !== "undefined") {
      const mockToken = "token_" + user.id;
      localStorage.setItem("casebridge_jwt_token", mockToken);
      document.cookie = `casebridge_auth_session=${mockToken}; path=/; max-age=86400; SameSite=Lax`;
      setToken(mockToken);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await loginOfficialApi(email, password);
    if (res.success && res.user && res.token) {
      setCurrentUserState(res.user);
      setToken(res.token);
      if (typeof window !== "undefined") {
        document.cookie = `casebridge_auth_session=${res.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      return { success: true };
    }
    return { success: false, error: res.error || "Authentication failed" };
  };

  const logout = () => {
    clearStoredAuth();
    if (typeof window !== "undefined") {
      document.cookie = "casebridge_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "casebridge_inst_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setToken(null);
  };

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: SEED_USERS,
        token,
        isAuthenticated: Boolean(token),
        isLoadingAuth,
        login,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
