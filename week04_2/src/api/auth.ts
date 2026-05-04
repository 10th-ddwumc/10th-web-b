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

  const responseData = response.data.data;

  const accessToken =
    responseData.accessToken ??
    responseData.access_token ??
    responseData.accessTokenExpiresIn;

  const refreshToken =
    responseData.refreshToken ??
    responseData.refresh_token;

  if (accessToken && refreshToken) {
    setTokens(accessToken, refreshToken);
  }

  return response.data;
};

export const signup = async (data: SignupRequest) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};