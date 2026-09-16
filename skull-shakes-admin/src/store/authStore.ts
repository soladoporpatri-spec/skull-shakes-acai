import { create } from "zustand";

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/lib/auth";

import { AuthTokens } from "@/types";



interface AuthState {

  accessToken: string | null;

  refreshToken: string | null;

  isAuthenticated: boolean;

  hydrated: boolean;

  setAuth: (tokens: AuthTokens) => void;

  clear: () => void;

  hydrate: () => void;

}



export const useAuthStore = create<AuthState>((set) => ({

  accessToken: null,

  refreshToken: null,

  isAuthenticated: false,

  hydrated: false,



  setAuth: (tokens: AuthTokens) => {

    setTokens(tokens);

    set({

      accessToken: tokens.accessToken,

      refreshToken: tokens.refreshToken,

      isAuthenticated: true,

    });

  },



  clear: () => {

    clearTokens();

    set({

      accessToken: null,

      refreshToken: null,

      isAuthenticated: false,

    });

  },



  hydrate: () => {

    const accessToken = getAccessToken();

    const refreshToken = getRefreshToken();

    set({

      accessToken,

      refreshToken,

      isAuthenticated: !!accessToken,

      hydrated: true,

    });

  },

}));
