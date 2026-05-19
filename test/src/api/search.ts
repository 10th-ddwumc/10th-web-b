// src/api/search.ts
import axiosInstance from "./axiosInstance";
import type { LpListResponse } from "../types/lp";

export const searchLps = async ({
  keyword,
  cursor = 0,
  limit = 12,
}: {
  keyword: string;
  cursor?: number;
  limit?: number;
}): Promise<LpListResponse> => {
  const response = await axiosInstance.get("/lps", {
    params: {
      search: keyword,
      cursor,
      limit,
      order: "desc",
    },
  });

  return response.data;
};