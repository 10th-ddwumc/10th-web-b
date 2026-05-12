// src/api/lp.ts
import axiosInstance from "./axiosInstance";
import type {
  CreateLpRequest,
  LpCommentListResponse,
  LpDetailResponse,
  LpListResponse,
  OrderType,
  SortType,
  UpdateLpRequest,
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
    params: { order, limit, cursor },
  });

  return response.data;
};

export const getLpDetail = async (lpid: string): Promise<LpDetailResponse> => {
  const response = await axiosInstance.get(`/lps/${lpid}`);
  return response.data;
};

export const createLp = async (body: CreateLpRequest) => {
  const response = await axiosInstance.post("/lps", body);
  return response.data;
};

export const updateLp = async ({
  lpid,
  body,
}: {
  lpid: string;
  body: UpdateLpRequest;
}) => {
  const response = await axiosInstance.patch(`/lps/${lpid}`, body);
  return response.data;
};

export const deleteLp = async (lpid: string) => {
  const response = await axiosInstance.delete(`/lps/${lpid}`);
  return response.data;
};

export const likeLp = async (lpid: string) => {
  const response = await axiosInstance.post(`/lps/${lpid}/likes`);
  return response.data;
};

export const unlikeLp = async (lpid: string) => {
  const response = await axiosInstance.delete(`/lps/${lpid}/likes`);
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
    params: { order, cursor, limit },
  });

  return response.data;
};

export const createLpComment = async ({
  lpid,
  content,
}: {
  lpid: string;
  content: string;
}) => {
  const response = await axiosInstance.post(`/lps/${lpid}/comments`, {
    content,
  });

  return response.data;
};

export const updateLpComment = async ({
  lpid,
  commentId,
  content,
}: {
  lpid: string;
  commentId: number;
  content: string;
}) => {
  const response = await axiosInstance.patch(
    `/lps/${lpid}/comments/${commentId}`,
    { content }
  );

  return response.data;
};

export const deleteLpComment = async ({
  lpid,
  commentId,
}: {
  lpid: string;
  commentId: number;
}) => {
  const response = await axiosInstance.delete(
    `/lps/${lpid}/comments/${commentId}`
  );

  return response.data;
};