import axiosInstance from "../interceptor";

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

interface updateVideosPayload {
  status?: number;
}

interface addVideoData {
  title: string | null;
  videoUrl: string | File | null;
  thumbnailUrl: string | File | null;
  durationMinutes: string | number | null;
  durationSeconds: string | number | null;
  category: number[];
}

export const getAllUsers = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get("/admin/clients/list", {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleUserInfo = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clients/profile/${clientId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateUserInfo = async (
  clientId: string | null,
  payload: updateUserData
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/clients/update/${clientId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeUSerInfo = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/clients/delete/${clientId}?isdelete=true`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getUserSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clients/summary`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllHealthVideos = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get("/health-videos", {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateHealthVideos = async (
  videoId: string,
  payload: updateVideosPayload
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/health-videos/update/${videoId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const gethealthVideosSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/health-videos/summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const addHealthVideo = async (payload: addVideoData) => {
  let result;
  try {
    result = await axiosInstance.post("/health-videos", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getClientMedicalHistory = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/client/medical-history/id/${clientId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getClientCarePlanList = async (
  clientId: string,
  paginationParams = {}
) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/client/care-plan/clientUserId/${clientId}`,
      {
        params: paginationParams,
      }
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getClientCarePlanSignleData = async (carePlanId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/client/care-plan/id/${carePlanId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllServiceAgreement = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get("/admin/clients/agreement-list", {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleAgreementData = async (agreementId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clients/agreement/${agreementId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleCareNote = async (noteId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clients/careNotes/${noteId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllMedicationLogs = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get("/medication-logs/admin", {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllPrescriptions = async (
  paginationParams = {},
  clientId: string
) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/medication-logs/client-prescriptions/${clientId}`,
      {
        params: paginationParams,
      }
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singlePrescription = async (logId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/medication-logs/prescription/${logId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleMedicationLog = async (logId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/medication-logs/medication/${logId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllCareNotes = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get("/notes/admin", {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleCareNotes = async (noteId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/notes/id/${noteId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllVisitLogs = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get("/visit-log", {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleVisitLog = async (noteId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/visit-log/id/${noteId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getClientHealthReport = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clients/health-log`, {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const DownloadHealthReportDataPdf = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clients/download-report`, {
      params: paginationParams,
      responseType: "blob",
    });
  } catch (e) {
    result = e;
  }
  return result;
};
