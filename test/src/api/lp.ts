// src/api/lp.ts
import axiosInstance from "./axiosInstance";
import type { LpDetailResponse, LpListResponse, SortType } from "../types/lp";

export const getLpList = async (sort: SortType): Promise<LpListResponse> => {
  const order = sort === "latest" ? "desc" : "asc";

  const response = await axiosInstance.get("/lps", {
    params: {
      order,
      limit: 50,
      cursor: 0,
    },
  });

  return response.data;
};

export const getLpDetail = async (
  lpid: string
): Promise<LpDetailResponse> => {
  const response = await axiosInstance.get(`/lps/${lpid}`);
  return response.data;
};

export const likeLp = async (lpid: string) => {
  const response = await axiosInstance.post(`/lps/${lpid}/like`);
  return response.data;
};

export const deleteLp = async (lpid: string) => {
  const response = await axiosInstance.delete(`/lps/${lpid}`);
  return response.data;
};