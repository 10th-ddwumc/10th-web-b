import { axiosInstance } from "./axios";

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    // 공용 업로드 엔드포인트 사용 (인증 토큰 관련 이슈 방지)
    const { data } = await axiosInstance.post('/v1/uploads/public', formData);

    return data.data.imageUrl;
};
