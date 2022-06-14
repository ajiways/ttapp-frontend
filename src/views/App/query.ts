import { $api } from "../../api";
import store from "../../store";
import { AuthResponse } from "../login/types";

export const refreshQuery = async () => {
  try {
    const response = await $api.get<
      Omit<AuthResponse, "refreshToken" | "userId" | "groupId">
    >(`/auth/refresh`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "x-user-id": localStorage.getItem("userId") || "",
      },
    });
    localStorage.setItem("token", response.data.token);
    store.commit("setAuth", true);
    store.commit("setUserRoles", response.data.userRoles);
    store.dispatch("setUserId", localStorage.getItem("userId") || "");
    store.dispatch("setGroupId", localStorage.getItem("groupId") || "");
  } catch (error) {
    return error;
  }
};

export const logoutQuery = async () => {
  try {
    const res = await $api.get<boolean>("/auth/logout");

    if (res.data) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("groupId");
    }
    return true;
  } catch (e) {
    return e as Error;
  }
};
