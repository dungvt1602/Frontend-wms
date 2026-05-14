import type { ApiResponse } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginResponseData {
  user: AuthUser;
  tokens: AuthTokens;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
