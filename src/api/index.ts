import axios from "axios";
import { AuthResponse } from "../views/login/types";

export const $api = axios.create({
  baseURL: "http://localhost:3052",
  withCredentials: true,
});

$api.interceptors.request.use((config) => {
  (config.headers ??= {}).Authorization = `Bearer ${localStorage.getItem(
    "token"
  )}`;
  (config.headers ??= {})["x-user-id"] = `${localStorage.getItem("userId")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.config &&
      !originalRequest.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await $api.get<AuthResponse>(`/auth/refresh`);
        localStorage.setItem("token", response.data.token);
        return $api.request(originalRequest);
      } catch (error) {
        console.log("Не авторизован");
      }
    }
  }
);
