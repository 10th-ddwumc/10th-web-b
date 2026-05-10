import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type { 
    ResponseCatDetailDto, 
    ResponseCatListDto, 
    ResponseCommentListDto, 
    ResponseCommentDto,
    Cat
} from "../types/cat";

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

export const postCat = async (body: {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
}): Promise<Cat> => {
    const { data } = await axiosInstance.post('/v1/lps', body);
    return data.data;
};

export const patchCat = async (
    id: string, 
    body: {
        title?: string;
        content?: string;
        thumbnail?: string;
        tags?: string[];
        published?: boolean;
    }
): Promise<Cat> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${id}`, body);
    return data.data;
};

export const deleteCat = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${id}`);
};

export const postLikeCat = async (id: string): Promise<void> => {
    await axiosInstance.post(`/v1/lps/${id}/likes`);
};

export const deleteLikeCat = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${id}/likes`);
};

export const getCatComments = async (
    lpId: string,
    params: Omit<PaginationDto, 'search'>
): Promise<ResponseCommentListDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params,
    });
    return data;
};

export const postCatComment = async (
    lpId: string,
    content: string
): Promise<ResponseCommentDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
        content,
    });
    return data;
};

export const patchCatComment = async (
    lpId: string,
    commentId: number,
    content: string
): Promise<ResponseCommentDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, {
        content,
    });
    return data;
};

export const deleteCatComment = async (
    lpId: string,
    commentId: number
): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};