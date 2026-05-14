import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];
const protectedRoutes = [
  "/dashboard",
  "/inventory",
  "/orders",
  "/warehouse",
  "/customers",
  "/products",
  "/reports",
  "/settings",
  "/stocktake",
  "/suppliers",
  "/logout",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  console.log(">>> Proxy hit:", pathname, token ? "Token found" : "No token");

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  ) || pathname === "/";

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*$).*)"],
};
