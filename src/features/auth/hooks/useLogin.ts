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
        const result: any = await authApi.login({ username: email, password });
        console.log(">>> API Response:", result);
        if (result.code && result.code !== 200) {
          throw new Error(result.message || "Đăng nhập thất bại");
        }

        const authData: any = result.data;
        if (!authData?.accessToken) {
          throw new Error("Đăng nhập thất bại: thiếu token trả về");
        }

        return {
          user: {
            id: authData.username ?? email,
            email,
            fullName: authData.username ?? email,
            role: "USER",
          },
          tokens: {
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
          },
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Đăng nhập thất bại";
        throw new Error(message);
      }
    },
    onSuccess: (data, variables) => {
      if (data?.tokens) {
        const { accessToken, refreshToken } = data.tokens;
        const maxAge = variables.remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

        document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}; SameSite=Strict`;
        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Strict`;
        }
        console.log(">>> Hook: Đã lưu token vào cookie");
      }
    },
  });
}
