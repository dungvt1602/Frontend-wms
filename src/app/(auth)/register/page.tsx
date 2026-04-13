import type { Metadata } from "next";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký | WMS",
  description: "Tạo tài khoản mới để truy cập hệ thống quản lý kho WMS",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
