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
  setTokens(
    responseData.accessToken,
    responseData.refreshToken,
    responseData.name
  );

  return response.data;
};

export const signup = async (data: SignupRequest) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/signout");
  return response.data;
};

export const redirectToGoogleLogin = () => {
  window.location.href = "http://localhost:8000/v1/auth/google/login";
};