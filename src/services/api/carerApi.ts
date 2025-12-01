import axiosInstance from "../interceptor";

interface approvalProfileData {
  documentType: string;
  documentIndex: number;
  action: string;
}

interface masterApprovalProfileData {
  accountStatus: string | number;
}

interface updateUserData {
  firstName?: string | number;
  lastName?: string | number;
  dob?: string | null;
  gender?: number[];
  isActive?: boolean;
  email?: string | null;
  address?: string | null;
  houseNo?: string;
  postCode?: string;
  country?: string;
  status?: number;
  notes?: string;
}

//care-info-count
export const getAllCarerSummary = async () => {
  try {
    return await axiosInstance.get("/admin/carer/summary");
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};

//get-all-carer
export const getAllCarerList = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/carer/list", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};

export const updateCarer = async (
  clientId: string | null,
  payload: updateUserData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/carer/update/${clientId}?isactive=false`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeCarer = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/carer/delete/${clientId}?isdelete=false`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

//carer-info
export const getCarerInfo = async (carerID: string) => {
  try {
    return await axiosInstance.get(`/admin/carer/profile/${carerID}`);
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};

export const getCarerVerificationSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/carer/pending-summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const ApprovalCarerProfileDetails = async (
  profileId: string,
  payload: approvalProfileData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/carer/partial-approval/${profileId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const masterApprovalCarerProfileDetails = async (
  profileId: string,
  payload: masterApprovalProfileData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/carer/approval/${profileId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllJobs = async (paginationParams = {}, userId: string) => {
  try {
    return await axiosInstance.get(`/admin/carer/client-list/${userId}`, {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};

export const getClientDetails = async (
  paginationParams = {},
  userId: string
) => {
  try {
    return await axiosInstance.get(`/admin/carer/client-detail/${userId}`, {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};

//get-all-passport
export const getAllPassportList = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/carer/passport-list", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching passport data:", error);
    throw error;
  }
};

//passport-info-count
export const getAllPassportSummary = async () => {
  try {
    return await axiosInstance.get("/admin/carer/passport-summary");
  } catch (error) {
    console.error("Error fetching passport summary data:", error);
    throw error;
  }
};

export const getViewPassportData = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get(`/admin/carer/passport`, {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching passport data:", error);
    throw error;
  }
};

export const getViewCountRecentData = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get(`/passport/recent-views`, {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching passport data:", error);
    throw error;
  }
};

export const getViewCountusersData = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get(`/passport/viewers`, {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching passport data:", error);
    throw error;
  }
};

export const getViewCountBlockedData = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get(`/passport/restricted-viewers`, {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching passport data:", error);
    throw error;
  }
};

export const PassportMasterApproval = async (
  passportId: string | null,
  payload: {
    status: number;
  }
) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/admin/carer/update-passport/${passportId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

//get-all-passport
export const getAllPaymentDispute = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/carer/fetch-dispute", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching passport data:", error);
    throw error;
  }
};

export const getSinglePaymentDispute = async (
  paginationParams = {},
  payementId: string
) => {
  try {
    return await axiosInstance.get(`/admin/carer/dispute/${payementId}`, {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};
