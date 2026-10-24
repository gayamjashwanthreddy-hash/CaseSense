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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(SEED_USERS[0]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    CaseBridgeStore.init();
    const stored = CaseBridgeStore.getCurrentUser();
    if (stored) {
      setCurrentUserState(stored);
    }
    const t = getStoredAuthToken();
    setToken(t);

    const handleUpdate = () => {
      setCurrentUserState(CaseBridgeStore.getCurrentUser());
      setToken(getStoredAuthToken());
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
      setToken(mockToken);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await loginOfficialApi(email, password);
    if (res.success && res.user && res.token) {
      setCurrentUserState(res.user);
      setToken(res.token);
      return { success: true };
    }
    return { success: false, error: res.error || "Authentication failed" };
  };

  const logout = () => {
    clearStoredAuth();
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
