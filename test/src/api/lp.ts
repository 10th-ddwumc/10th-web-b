// src/api/lp.ts
import axiosInstance from "./axiosInstance";
import type {
  LpCommentListResponse,
  LpDetailResponse,
  LpListResponse,
  OrderType,
  SortType,
} from "../types/lp";

export const getLpList = async ({
  sort,
  cursor = 0,
  limit = 12,
}: {
  sort: SortType;
  cursor?: number;
  limit?: number;
}): Promise<LpListResponse> => {
  const order = sort === "latest" ? "desc" : "asc";

  const response = await axiosInstance.get("/lps", {
    params: {
      order,
      limit,
      cursor,
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

export const getLpComments = async ({
  lpid,
  order,
  cursor = 0,
  limit = 10,
}: {
  lpid: string;
  order: OrderType;
  cursor?: number;
  limit?: number;
}): Promise<LpCommentListResponse> => {
  const response = await axiosInstance.get(`/lps/${lpid}/comments`, {
    params: {
      order,
      cursor,
      limit,
    },
  });

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