import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workspace } from '@/shared/types/workspace';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "brand" | "agency" | "talent";
  walletId: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  isInitialized: boolean;
}

const getSafeLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const getInitialState = (): AuthState => {
  try {
    const storedToken = getSafeLocalStorage("agncypay_token");
    const storedUser = getSafeLocalStorage("agncypay_user");
    const storedWorkspaces = getSafeLocalStorage("agncypay_workspaces");
    const storedActiveWs = getSafeLocalStorage("agncypay_active_ws");

    return {
      token: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null,
      workspaces: storedWorkspaces ? JSON.parse(storedWorkspaces) : [],
      activeWorkspaceId: storedActiveWs || null,
      isInitialized: !!storedToken,
    };
  } catch (e) {
    return {
      token: null,
      user: null,
      workspaces: [],
      activeWorkspaceId: null,
      isInitialized: false,
    };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthUser; workspaces: Workspace[] }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.workspaces = action.payload.workspaces;
      const defaultWsId = action.payload.workspaces[0]?.id || null;
      state.activeWorkspaceId = defaultWsId;
      state.isInitialized = true;

      if (typeof window !== 'undefined') {
        localStorage.setItem("agncypay_token", action.payload.token);
        localStorage.setItem("agncypay_user", JSON.stringify(action.payload.user));
        localStorage.setItem("agncypay_workspaces", JSON.stringify(action.payload.workspaces));
        if (defaultWsId) localStorage.setItem("agncypay_active_ws", defaultWsId);
      }
    },
    switchWorkspaceAction: (state, action: PayloadAction<string>) => {
      state.activeWorkspaceId = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem("agncypay_active_ws", action.payload);
      }
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.workspaces = [];
      state.activeWorkspaceId = null;
      state.isInitialized = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem("agncypay_token");
        localStorage.removeItem("agncypay_user");
        localStorage.removeItem("agncypay_workspaces");
        localStorage.removeItem("agncypay_active_ws");
      }
    }
  }
});

export const { setCredentials, switchWorkspaceAction, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectActiveWorkspaceId = (state: { auth: AuthState }) => state.auth.activeWorkspaceId;
export const selectWorkspaces = (state: { auth: AuthState }) => state.auth.workspaces;
