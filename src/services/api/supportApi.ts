import axiosInstance from "../interceptor";

export interface ArchieveResourcePayloadData {
  status?: number;
}
export interface ArticleItem {
  subTitle?: string;
  text?: string;
  subText?: string;
  imageUrl?: string;
  caption?: string;
}

export interface FAQData {
  question: string;
  answer: string;
  userType: number[];
}

export interface ConclusionData {
  subTitle?: string;
  text?: string;
}

interface ResourceData {
  title: string;
  category: string[];
  videoUrl?: string;
  thumbnailUrl: string;
  article: ArticleItem[];
  conclusion: ConclusionData[];
  userType?: number[];
}

interface UpdateSupportPayload {
  supportId: string;
  status: number;
}

interface SendMailPayload {
  email: string | null;
  subject: string | null;
  message: string | null;
  supportId: string | null;
}

interface AssignPayload {
  userId: string | number | null;
  supportId: string | number | null;
}

export const getAllSupport = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/support", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching support data:", error);
    throw error;
  }
};

export const getSupportInfo = async (id: string) => {
  try {
    return await axiosInstance.get(`/support/${id}`);
  } catch (error) {
    console.error("Error fetching support data:", error);
    throw error;
  }
};

export const updateSupport = async (payload: UpdateSupportPayload) => {
  let result;
  try {
    result = await axiosInstance.post(`/support/updateHelpFormStatus`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const sendMail = async (payload: SendMailPayload) => {
  let result;
  try {
    result = await axiosInstance.post(`/support/sendMessageEmail`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAdminList = async () => {
  try {
    return await axiosInstance.get("/admin/admin-list");
  } catch (error) {
    console.error("Error fetching admins data:", error);
    throw error;
  }
};

export const assignSupportToUser = async (payload: AssignPayload) => {
  let result;
  try {
    result = await axiosInstance.post(`/support/updateAssignTo`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllProviderResources = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/resources", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching clinical data:", error);
    throw error;
  }
};

export const createProviderResources = async (payload: ResourceData) => {
  try {
    return await axiosInstance.post(`/admin/resources`, payload);
  } catch (error) {
    console.error("Error create notifications data:", error);
    throw error;
  }
};

export const updateProviderResources = async (
  resourceId: string,
  payload: ResourceData
) => {
  try {
    return await axiosInstance.patch(
      `/admin/resources/update/${resourceId}`,
      payload
    );
  } catch (error) {
    console.error("Error create notifications data:", error);
    throw error;
  }
};

export const getResourceSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/resources/summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleResources = async (resourceId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/resources/id/${resourceId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteProviderResource = async (resourceId: string) => {
  try {
    return await axiosInstance.delete(`/admin/resources/delete/${resourceId}`);
  } catch (error) {
    console.error("Error delete resources data:", error);
    throw error;
  }
};

export const ArchieveProviderResource = async (
  resourceId: string,
  payload: ArchieveResourcePayloadData
) => {
  try {
    return await axiosInstance.patch(
      `/admin/resources/update/${resourceId}`,
      payload
    );
  } catch (error) {
    console.error("Error delete resources data:", error);
    throw error;
  }
};

export const getAllProviderFAQs = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/faq", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching clinical data:", error);
    throw error;
  }
};

export const createProviderFAQ = async (payload: FAQData) => {
  try {
    return await axiosInstance.post(`/admin/faq/add`, payload);
  } catch (error) {
    console.error("Error create notifications data:", error);
    throw error;
  }
};

export const deleteProviderFAQ = async (
  faqId: string,
  payload: { role: number }
) => {
  try {
    return await axiosInstance.post(`/admin/faq/${faqId}`, payload);
  } catch (error) {
    console.error("Error delete notifications data:", error);
    throw error;
  }
};

export const updateProviderFAQ = async (
  faqId: string | null,
  payload: FAQData
) => {
  let result;
  try {
    result = await axiosInstance.put(`/admin/faq/${faqId}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};
