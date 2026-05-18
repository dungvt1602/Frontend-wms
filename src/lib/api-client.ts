import axios, { AxiosError, AxiosRequestConfig } from "axios";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }

  return null;
};

const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Tự động đính kèm accessToken vào Header
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

// Variables for handling refresh token race conditions
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response Interceptor: Xử lý lỗi 401 & Auto Refresh Token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Nếu lỗi 401 (Hết hạn Token) và chưa từng retry
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang có 1 request khác làm nhiệm vụ refresh rồi, thì request này chui vào Queue nằm chờ
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest); // Gọi lại request sau khi đã có token mới
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Đánh dấu request này là đã retry để tránh lặp vô hạn
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie("refreshToken");

      if (!refreshToken) {
        // Nếu không có refreshToken, bắt buộc logout
        deleteCookie("accessToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh trực tiếp bằng axios (không dùng apiClient để tránh lặp vòng interceptor)
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error("Invalid token refresh response");
        }

        // Lưu tokens mới vào Cookie (Mặc định set lại 7 ngày)
        const maxAge = 7 * 24 * 60 * 60;
        setCookie("accessToken", newAccessToken, maxAge);
        if (newRefreshToken) {
          setCookie("refreshToken", newRefreshToken, maxAge);
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Giải phóng Queue (đánh thức các request đang nằm chờ)
        processQueue(null, newAccessToken);

        // Chạy lại request ban đầu (bị 401)
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (Ví dụ: refreshToken cũng hết hạn)
        processQueue(refreshError, null);
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login"; // Văng ra màn đăng nhập
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Kết thúc quá trình refresh
      }
    }

    return Promise.reject(error);
  }
);

// Orval Custom Mutator: Ép Orval dùng instance này thay vì axios mặc định
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = apiClient({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
