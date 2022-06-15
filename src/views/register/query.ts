import { AxiosError } from "axios";
import { $api } from "../../api";
import { EResponseType } from "../../common/enums";
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

    return {
      type: EResponseType.SUCCESS,
      message: "Добро пожаловать!",
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response && e.response.status === 400) {
        return {
          type: EResponseType.ERROR,
          message: "Этот логин занят",
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
