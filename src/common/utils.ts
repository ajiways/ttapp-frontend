/* eslint-disable no-useless-escape */

import { EResponseType } from "./enums";

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export const loginRegex = new RegExp(
  /(?!-)(?!.*__)(?!.*-_)(?!.*_-)(?!.*--)^[_a-zA-Z0-9-]+$/
);

export const passwordRegex = new RegExp(
  /^[~`!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-]+$/
);

export const secondPasswordRegex = new RegExp(
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
);

export function getCurrentWeekType() {
  const d0 = new Date().getTime(),
    d = new Date(new Date().getFullYear(), 0, 1),
    d1 = d.getTime(),
    dd = d.getDay(),
    re = Math.floor((d0 - d1) / 8.64e7) + (dd ? dd - 1 : 6);
  return Math.floor(re / 7) % 2 ? true : false;
}

export function useSnackbar(
  res:
    | {
        type: EResponseType;
        message: string;
        [key: string]: unknown;
      }
    | undefined,
  key?: string
): [type: EResponseType, message: string, show: boolean, arg?: unknown] {
  let type = EResponseType.ERROR;
  let show = false;
  let message = "";

  if (!res || (key && !res[key])) {
    type = EResponseType.ERROR;
    message = "Произошла непредвиенная ошибка, попробуйте позже";
    show = true;
    return [type, message, show];
  }

  if (res.type === EResponseType.ERROR) {
    type = EResponseType.ERROR;
    message = res.message;
    show = true;
    return [type, message, show];
  }

  type = EResponseType.SUCCESS;
  message = res.message;
  show = true;
  return [type, message, show, res.updatedLessons];
}
