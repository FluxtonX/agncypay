"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Workspace, getVerificationTrack } from "@/shared/types/workspace";
import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials, switchWorkspaceAction } from "@/lib/store/slices/authSlice";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "brand" | "agency" | "talent";
  walletId: string | null;
}

interface AppState {
  user: AuthUser | null;
  token: string | null;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
}

interface AppContextType {
  state: AppState;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  switchWorkspace: (workspaceId: string) => void;
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [state, setState] = useState<AppState>({
    user: null,
    token: null,
    workspaces: [],
    activeWorkspaceId: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("agncypay_token");
      const storedUser = localStorage.getItem("agncypay_user");
      const storedWorkspaces = localStorage.getItem("agncypay_workspaces");
      const storedActiveWs = localStorage.getItem("agncypay_active_ws");

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);
        const workspaces = storedWorkspaces ? JSON.parse(storedWorkspaces) : [];
        const activeWorkspaceId = storedActiveWs || null;

        setState({
          token: storedToken,
          user,
          workspaces,
          activeWorkspaceId,
        });
      }
    } catch (e) {
      console.error("Failed to load auth state from local storage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save session state to localStorage on state changes
  const login = (token: string, user: AuthUser) => {
    // Generate default workspace for user
    const wsType = user.role === "talent" ? "talent_independent" : user.role;
    const wsName = user.role === "talent" ? user.fullName : `${user.fullName}'s Workspace`;
    const defaultWs: Workspace = {
      id: `ws-${user.id}`,
      name: wsName,
      type: wsType,
      agncyId: user.walletId || "ORG-000000",
      verificationTrack: getVerificationTrack(wsType),
      verificationStatus: "approved", // auto approved for demo/auth flow
    };

    localStorage.setItem("agncypay_token", token);
    localStorage.setItem("agncypay_user", JSON.stringify(user));
    localStorage.setItem("agncypay_workspaces", JSON.stringify([defaultWs]));
    localStorage.setItem("agncypay_active_ws", defaultWs.id);

    dispatch(setCredentials({ token, user, workspaces: [defaultWs] }));

    setState({
      token,
      user,
      workspaces: [defaultWs],
      activeWorkspaceId: defaultWs.id,
    });
  };

  const logout = () => {
    localStorage.removeItem("agncypay_token");
    localStorage.removeItem("agncypay_user");
    localStorage.removeItem("agncypay_workspaces");
    localStorage.removeItem("agncypay_active_ws");

    dispatch(clearCredentials());

    setState({
      token: null,
      user: null,
      workspaces: [],
      activeWorkspaceId: null,
    });
    router.push("/auth/login");
  };

  const switchWorkspace = (workspaceId: string) => {
    localStorage.setItem("agncypay_active_ws", workspaceId);
    dispatch(switchWorkspaceAction(workspaceId));
    setState((prev) => ({
      ...prev,
      activeWorkspaceId: workspaceId,
    }));
  };

  return (
    <AppContext.Provider value={{ state, login, logout, switchWorkspace, isInitialized }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
