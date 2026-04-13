import type { Metadata } from "next";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {    //thông tin hiện lên url khi người dùng truy cập vào trang đăng nhập
  title: "Đăng nhập | WMS",           //Cho chức năng SEO
  description: "Đăng nhập vào hệ thống quản lý kho WMS",
};

export default function LoginPage() {
  return <LoginForm />;
}
