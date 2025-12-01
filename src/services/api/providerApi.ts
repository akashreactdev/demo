import axiosInstance from "../interceptor";

interface approvalProfileData {
  documentType: string;
  documentIndex: number;
  action?: string;
}

interface masterApprovalProfileData {
  accountStatus: string | number;
}

interface masterApprovalJobProfileData {
  status: number;
  closingReason?: string;
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

export const getAllProvider = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/provider/list", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching clinical data:", error);
    throw error;
  }
};

export const getProviderSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/provider/summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProvider = async (
  clientId: string | null,
  payload: updateUserData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/provider/update/${clientId}?isactive=false`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeProvider = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/provider/delete/${clientId}?isdelete=false`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleProviderInfo = async (providerId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/provider/profile/${providerId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getVerificationSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/provider/pending-summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const ApprovalProfileDetails = async (
  profileId: string,
  payload: approvalProfileData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/provider/partial-approve/${profileId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const masterApprovalProfileDetails = async (
  profileId: string,
  payload: masterApprovalProfileData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/provider/approval/${profileId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProviderTeamMemberList = async (providerId: string) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/admin/provider/team-member-list/${providerId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllJobPosting = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/provider/jobs", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching clinical data:", error);
    throw error;
  }
};

export const getJobPostingSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/provider/jobs-summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSinglejobProfileInfo = async (jobId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/provider/job/${jobId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const masterApprovalJobProfile = async (
  profileId: string,
  payload: masterApprovalJobProfileData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/provider/approve-job/${profileId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
