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

export const getAllClinical = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/clinical/list", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching clinical data:", error);
    throw error;
  }
};

export const getClinicalSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/clinical/summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateClinical = async (clientId: string | null, payload: updateUserData) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/clinical/update/${clientId}?isactive=false`, payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeClinical = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/clinical/delete/${clientId}?isdelete=false`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleClinicalInfo = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clinical/profile/${clientId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getClinicalVerificationSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/clinical/pending-summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const ApprovalClinicalProfileDetails = async (
  profileId: string,
  payload: approvalProfileData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/clinical/partial-approval/${profileId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const masterApprovalClinicalProfileDetails = async (
  profileId: string,
  payload: masterApprovalProfileData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/clinical/approval/${profileId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
