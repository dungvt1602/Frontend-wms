import axios from "axios";

// Helper để lấy cookie ở phía Client
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

// 1. Client dành cho API công khai (Không cần Token)
export const publicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Debug Interceptor cho Public Client
publicClient.interceptors.response.use(
  (response) => {
    console.log(">>> API Success:", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error(">>> API Error Detail:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// 2. Client dành cho API cần xác thực (Tự động gắn Token)
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor để tự động gắn Bearer Token vào mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
