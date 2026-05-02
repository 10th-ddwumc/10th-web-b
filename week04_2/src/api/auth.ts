// src/api/auth.ts
import axiosInstance from "./axiosInstance";
import { setTokens } from "../utils/token";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  name: string;
};

export const login = async (data: LoginRequest) => {
  const response = await axiosInstance.post("/auth/signin", data);

  const accessToken =
    response.data.accessToken ??
    response.data.access_token ??
    response.data.token ??
    response.data.result?.accessToken ??
    response.data.result?.access_token;

  const refreshToken =
    response.data.refreshToken ??
    response.data.refresh_token ??
    response.data.result?.refreshToken ??
    response.data.result?.refresh_token;

  if (accessToken) {
    setTokens(accessToken, refreshToken);
  }

  return response.data;
};

export const signup = async (data: SignupRequest) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};