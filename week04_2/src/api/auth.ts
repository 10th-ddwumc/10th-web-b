// src/api/auth.ts
import axiosInstance from "./axiosInstance";
import { setTokens } from "../utils/token";

type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const response = await axiosInstance.post("/auth/login", data);

  setTokens(response.data.accessToken, response.data.refreshToken);

  return response.data;
};