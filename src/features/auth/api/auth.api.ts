import { login as loginApi } from "@/lib/generated/auth-controller/auth-controller";
import type { LoginRequest } from "@/lib/generated/model";

export const authApi = {
  login(payload: LoginRequest) {
    return loginApi(payload, {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: { "Content-Type": "application/json" },
    });
  },
};
