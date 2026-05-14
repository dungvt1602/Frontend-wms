import { publicClient } from "@/lib/api-client";
import type { LoginPayload, LoginResponse } from "../types/auth.types";

export const authApi = {
  login(payload: LoginPayload) {
    return publicClient.post<LoginResponse>("/auth/login", {
      username: payload.email,
      password: payload.password,
    });
  },
};
