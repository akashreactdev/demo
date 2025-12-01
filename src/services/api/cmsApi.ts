import axiosInstance from "../interceptor";

interface CmsData {
  title: string | null;
  alias: string | null;
}

interface singleCmsData {
  description: string | null;
  termsId: string | number | null;
}

export const getAllCms = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/terms-condition/all", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching cms data:", error);
    throw error;
  }
};

export const addCms = async (payload: CmsData) => {
  try {
    return await axiosInstance.post("/terms-condition/add", payload);
  } catch (error) {
    console.error("Error fetching cms data:", error);
    throw error;
  }
};

export const deleteCms = async (cmsId: string) => {
  try {
    return await axiosInstance.delete(`/terms-condition/${cmsId}`);
  } catch (error) {
    console.error("Error delete cms data:", error);
    throw error;
  }
};

export const getSingleCms = async (title: string, alias: string) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/terms-condition?title=${title}&alias=${alias}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateCms = async (payload: singleCmsData) => {
  try {
    return await axiosInstance.post("/terms-condition/update", payload);
  } catch (error) {
    console.error("Error fetching cms data:", error);
    throw error;
  }
};
