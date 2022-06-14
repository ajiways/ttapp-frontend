import { $api } from "../../api";
import store from "../../store";
import { AuthResponse } from "../login/types";

export const registrationQuery = async (
  login: string,
  password: string,
  passwordConfirm: string,
  groupId: string
) => {
  try {
    const res = await $api.post<AuthResponse>("/auth/registration", {
      login,
      password,
      confirmPassword: passwordConfirm,
      groupId,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("groupId", res.data.groupId);

    store.commit("setAuth", true);
    store.commit("setUserRoles", res.data.userRoles);
    store.dispatch("setUserId", res.data.userId);
    store.dispatch("setGroupId", res.data.groupId);

    return true;
  } catch (error) {
    return error as Error;
  }
};
