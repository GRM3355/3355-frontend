// src/api/apiClient.js
import axios from "axios";

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true, // refreshToken 쿠키 포함
});

// 요청 인터셉터 - Authorization 자동 설정
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 401 처리 및 재발급
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // AccessToken 만료 → refresh 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 refresh 요청 중이면 기다렸다 재요청
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        //RefreshToken으로 새 AccessToken 발급
        const refreshResponse = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.data.accessToken;

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 대기 중 요청 처리
        processQueue(null, newAccessToken);

        // Authorization 갱신 후 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        // refreshToken도 만료됨 → 강제 로그아웃
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
