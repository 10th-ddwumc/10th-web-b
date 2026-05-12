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

export type MyInfo = {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  avatar?: string | null;
};

export type UpdateMyInfoRequest = {
  name: string;
  bio?: string;
  avatar?: string;
};

export const login = async (data: LoginRequest) => {
  const response = await axiosInstance.post("/auth/signin", data);

  const responseData = response.data.data;

  setTokens(
    responseData.accessToken,
    responseData.refreshToken,
    responseData.name,
    responseData.id
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

export const withdraw = async () => {
  const response = await axiosInstance.delete("/users");
  return response.data;
};

export const getMyInfo = async () => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

export const updateMyInfo = async (body: UpdateMyInfoRequest) => {
  const response = await axiosInstance.patch("/users", body);
  return response.data;
};

export const redirectToGoogleLogin = () => {
  window.location.href = "http://localhost:8000/v1/auth/google/login";
};