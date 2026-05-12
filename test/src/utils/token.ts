// src/utils/token.ts
export const getAccessToken = () => localStorage.getItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const getUserName = () => localStorage.getItem("userName");

export const getUserId = () => {
  const value = localStorage.getItem("userId");
  return value ? Number(value) : null;
};

export const setTokens = (
  accessToken: string,
  refreshToken?: string,
  userName?: string,
  userId?: number
) => {
  localStorage.setItem("accessToken", accessToken);

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (userName) {
    localStorage.setItem("userName", userName);
  }

  if (userId) {
    localStorage.setItem("userId", String(userId));
  }

  window.dispatchEvent(new Event("auth-change"));
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("userId");

  window.dispatchEvent(new Event("auth-change"));
};