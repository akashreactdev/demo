import axiosInstance from "../interceptor";

interface ApproveOrReject {
  isApproved?: boolean;
  feedBackMessage?: string | null;
}

interface FollowUpCallData {
  name: string | null;
  email: string | null;
  startTime: string | null;
  date: string | null;
  duration: string | number | null;
  assessMentId: string | null;
}

interface UpdateCallData {
  name: string | null;
  startTime: string | null;
  date: string | null;
  duration: string | number | null;
}

export const getAllAssessment = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/assessment/list", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching assessment data:", error);
    throw error;
  }
};

export const getAssessmentSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/assessment/summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleAssessmentInfo = async (assetmentId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/assessment/${assetmentId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const ApproveReject = async (
  payload: ApproveOrReject,
  assetmentId: string | null
) => {
  try {
    return await axiosInstance.post(
      `/admin/assessment/update/${assetmentId}`,
      payload
    );
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

export const FollowUpCall = async (payload: FollowUpCallData) => {
  try {
    return await axiosInstance.post("/admin/assessment/followUpCall", payload);
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

export const fetchFollowUpCall = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/assessment/followUpCall`, {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const getRtcToken = async (params: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/call/rtc-token?channelName=${params}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const startCall = async (callId: string) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/admin/assessment/callStart?callId=${callId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const upadateFollowUpCall = async (
  Id: string,
  payload: UpdateCallData
) => {
  try {
    return await axiosInstance.patch(
      `/admin/assessment/followUpCall/${Id}`,
      payload
    );
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

export const getSingleProviderForRoute = async (providerId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/provider/profile/${providerId}?type=user`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleClinicalForRoute = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clinical/profile/${clientId}?type=user`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleCarerForRoute = async (carerID: string) => {
  try {
    return await axiosInstance.get(`/admin/carer/profile/${carerID}?type=user`);
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};