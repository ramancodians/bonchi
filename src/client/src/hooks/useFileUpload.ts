import { useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../config/consts";

interface UploadProgress {
  progress: number;
  uploading: boolean;
  error: string | null;
  uploadedFile: any | null;
}

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    progress: 0,
    uploading: false,
    error: null,
    uploadedFile: null,
  });

  const uploadFile = async (file: File) => {
    setUploadState({
      progress: 0,
      uploading: true,
      error: null,
      uploadedFile: null,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_ENDPOINT}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadState((prev) => ({
            ...prev,
            progress: percentCompleted,
          }));
        },
      });

      console.log("Upload response:", response.data);

      setUploadState({
        progress: 100,
        uploading: false,
        error: null,
        uploadedFile: response.data.data,
      });

      return response.data.data;
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadState({
        progress: 0,
        uploading: false,
        error: error.response?.data?.message || "Upload failed",
        uploadedFile: null,
      });
      throw error;
    }
  };

  const resetUpload = () => {
    setUploadState({
      progress: 0,
      uploading: false,
      error: null,
      uploadedFile: null,
    });
  };

  return {
    uploadFile,
    resetUpload,
    ...uploadState,
  };
};
