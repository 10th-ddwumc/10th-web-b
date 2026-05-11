// src/utils/token.ts
export const getAccessToken = () => localStorage.getItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const getUserName = () => localStorage.getItem("userName");

export const setTokens = (
  accessToken: string,
  refreshToken?: string,
  userName?: string
) => {
  localStorage.setItem("accessToken", accessToken);

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (userName) {
    localStorage.setItem("userName", userName);
  }

  window.dispatchEvent(new Event("auth-change"));
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userName");

  window.dispatchEvent(new Event("auth-change"));
};