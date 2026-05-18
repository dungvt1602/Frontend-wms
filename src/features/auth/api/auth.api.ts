import { login as loginApi, register as registerApi } from "@/lib/generated/auth-controller/auth-controller";
import type { LoginRequest, RegisterRequest } from "@/lib/generated/model";

export const authApi = {
  login(payload: LoginRequest) {
    return loginApi(payload);
  },
  register(payload: RegisterRequest) {
    return registerApi(payload);
  },
};
