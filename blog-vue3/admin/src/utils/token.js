import Cookies from "js-cookie";

const TokenKey = "Token";

// token前缀
export const token_prefix = "sulinye ";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
