"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { SEED_USERS } from "@/lib/api/seedData";

interface RoleContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  availableUsers: UserProfile[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(SEED_USERS[0]);

  useEffect(() => {
    CaseBridgeStore.init();
    setCurrentUserState(CaseBridgeStore.getCurrentUser());

    const handleUpdate = () => {
      setCurrentUserState(CaseBridgeStore.getCurrentUser());
    };
    window.addEventListener("casebridge_store_updated", handleUpdate);
    return () => window.removeEventListener("casebridge_store_updated", handleUpdate);
  }, []);

  const setCurrentUser = (user: UserProfile) => {
    CaseBridgeStore.setCurrentUser(user);
    setCurrentUserState(user);
  };

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: SEED_USERS,
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
