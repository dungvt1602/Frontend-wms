"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { RegisterRequest } from "@/lib/generated/model";

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      try {
        const result: any = await authApi.register(payload);
        console.log(">>> API Response:", result);

        // Nếu Backend trả về code không phải 200/201, coi đó là lỗi
        if (result.code && result.code !== 200 && result.code !== 201) {
          throw new Error(result.message || "Đăng ký thất bại");
        }

        return result.data;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Đăng ký thất bại";
        throw new Error(message);
      }
    },
    onSuccess: (data: any) => {
      if (data?.accessToken) {
        const maxAge = 7 * 24 * 60 * 60; // 7 days
        document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${maxAge}; SameSite=Strict`;
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${maxAge}; SameSite=Strict`;
        }
        console.log(">>> Hook: Đã lưu token đăng ký vào cookie");
      }
    },
  });
}
