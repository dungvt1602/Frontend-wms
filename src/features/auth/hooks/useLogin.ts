"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { LoginPayload, LoginResponseData } from "../types/auth.types";

interface LoginMutationParams extends LoginPayload {
  remember: boolean;
}

export function useLogin() {
  return useMutation<LoginResponseData, Error, LoginMutationParams>({
    mutationFn: async ({ email, password }) => {
      try {
        const response = await authApi.login({ email, password });
        
        // Nếu Backend trả về code không phải 200, coi đó là lỗi
        const result = response.data;
        if (result.code && result.code !== 200) {
          throw new Error(result.message || "Đăng nhập thất bại");
        }
        
        return result.data || (result as LoginResponseData);
      } catch (error: unknown) {
        // Chuyển đổi tin nhắn lỗi sang tiếng Việt cho thân thiện
        let message = error instanceof Error ? error.message : "Đăng nhập thất bại";
        throw new Error(message);
      }
    },
    onSuccess: (data, variables) => {
      if (data?.tokens) {
        const { accessToken, refreshToken } = data.tokens;
        // Nếu chọn remember thì lưu 30 ngày, ngược lại 7 ngày
        const maxAge = variables.remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

        document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
        console.log(">>> Hook: Đã lưu token vào cookie");
      }
    },
  });
}
