// src/api/auth.ts
import axiosInstance from "./axiosInstance";
import { setTokens } from "../utils/token";

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const response = await axiosInstance.post("/users/log-in", data);

  const accessToken =
    response.data.accessToken ?? response.data.access_token ?? response.data.token;

  const refreshToken =
    response.data.refreshToken ?? response.data.refresh_token;

  if (accessToken) {
    setTokens(accessToken, refreshToken);
  }

  return response.data;
};