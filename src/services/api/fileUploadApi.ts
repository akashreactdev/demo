import axiosInstance from "../interceptor";
export interface FileUploadData {
  file: File;
  fileName: string;
  fileType: string;
  moduleName?: string;
  documentType: string;
}

export const uploadFile = async (payload: FileUploadData) => {
  try {
    const formData = new FormData();

    formData.append("file", payload.file);
    formData.append("fileName", payload.fileName);
    formData.append("fileType", payload.fileType);
    formData.append("moduleName", payload.moduleName || "");
    formData.append("documentType", payload.documentType);

    return await axiosInstance.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-platform": "superAdminWeb",
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
