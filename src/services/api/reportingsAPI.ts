import axiosInstance from "../interceptor";

export const getAllTransactionHistoryData = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/reporting", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};

export const DownloadDemographicDataPdf = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get(`/setting/download-demographic`, {
      params: paginationParams,
      responseType: "blob",
    });
  } catch (e) {
    result = e;
  }
  return result;
};
