import { AuthTokens } from "@/types";



const ACCESS_TOKEN_KEY = "skull_access_token";

const REFRESH_TOKEN_KEY = "skull_refresh_token";

const ACCESS_EXPIRY_KEY = "skull_access_expiry";

const REFRESH_EXPIRY_KEY = "skull_refresh_expiry";



export function getAccessToken(): string | null {

  if (typeof window === "undefined") return null;

  return localStorage.getItem(ACCESS_TOKEN_KEY);

}



export function getRefreshToken(): string | null {

  if (typeof window === "undefined") return null;

  return localStorage.getItem(REFRESH_TOKEN_KEY);

}



export function setTokens(tokens: AuthTokens): void {

  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

  localStorage.setItem(ACCESS_EXPIRY_KEY, tokens.accessTokenExpiry);

  localStorage.setItem(REFRESH_EXPIRY_KEY, tokens.refreshTokenExpiry);

}



export function clearTokens(): void {

  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);

  localStorage.removeItem(REFRESH_TOKEN_KEY);

  localStorage.removeItem(ACCESS_EXPIRY_KEY);

  localStorage.removeItem(REFRESH_EXPIRY_KEY);

}



export function isTokenExpired(): boolean {

  if (typeof window === "undefined") return true;

  const expiry = localStorage.getItem(ACCESS_EXPIRY_KEY);

  if (!expiry) return true;

  return new Date(expiry) <= new Date();

}
