// src/api/upload.ts
import axios from "axios";
import { getAccessToken } from "../utils/token";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:8000/v1/uploads/public",
    formData,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const data = response.data.data ?? response.data;

  return (
    data.url ??
    data.imageUrl ??
    data.fileUrl ??
    data.path ??
    data.location ??
    data
  );
};