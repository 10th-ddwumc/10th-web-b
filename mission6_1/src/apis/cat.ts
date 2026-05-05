import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type { ResponseCatDetailDto, ResponseCatListDto } from "../types/cat";

export const getCatList = async (
    params: PaginationDto
): Promise<ResponseCatListDto> => {
    const { data } = await axiosInstance.get('/v1/lps', {
        params,
    });

    return data;
};

export const getCatDetail = async (id: string): Promise<ResponseCatDetailDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${id}`);
    return data;
};

export const deleteCat = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${id}`);
};

export const postLikeCat = async (id: string): Promise<void> => {
    await axiosInstance.post(`/v1/lps/${id}/like`);
};