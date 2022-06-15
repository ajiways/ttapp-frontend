import { AxiosError } from "axios";
import { $api } from "../../api";
import { EResponseType } from "../../common/enums";
import store from "../../store";
import { AuthResponse } from "./types";

export const loginQuery = async (login: string, password: string) => {
  try {
    const res = await $api.post<AuthResponse>("/auth/login", {
      login,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("groupId", res.data.groupId);

    store.dispatch("setAuth", true);
    store.dispatch("setUserRoles", res.data.userRoles);
    store.dispatch("setUserId", res.data.userId);
    store.dispatch("setGroupId", res.data.groupId);

    return {
      type: EResponseType.SUCCESS,
      message: "Добро пожаловать!",
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response && e.response.status === 400) {
        return {
          type: EResponseType.ERROR,
          message: "Неправильный логин или пароль",
        };
      }

      if (e.response && e.response.status === 500) {
        return {
          type: EResponseType.ERROR,
          message: "Произошла непредвиенная ошибка",
        };
      }
    }
  }
};
