import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
}

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && typeof window !== "undefined") {
      const code = error.response?.data?.code;

      if (code === "TERMS_REQUIRED") {
        window.location.href = "/onboard";
        return Promise.reject(error);
      }

      if (code === "GUEST_FORBIDDEN") {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      const code = error.response?.data?.code;

      if (code === "MISSING_TOKEN" || code === "INVALID_TOKEN") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await axios.post<{ access_token: string }>(
            `${baseURL}auth/reissue`,
            null,
            { withCredentials: true },
          );

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", data.access_token);
          }
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return apiClient(originalRequest);
        } catch {
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  },
);
