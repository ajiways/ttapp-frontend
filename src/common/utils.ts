/* eslint-disable no-useless-escape */

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
