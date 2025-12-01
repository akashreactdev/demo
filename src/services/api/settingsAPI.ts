import axiosInstance from "../interceptor";

interface AdminPermissions {
  userPermissions: number[];
  carerPermissions: number[];
  clinicalPermissions: number[];
  providerPermissions: number[];
}

interface AddNewUserPayload {
  username: string | null;
  role: number;
  profile: string | File | null;
  email: string | null;
  address: string | null;
  dob: string | null;
}

//get-all-carer
export const getAllAccessAdminsList = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/setting/getAdmin", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching carer data:", error);
    throw error;
  }
};

export const getAccessProfileInfo = async (userId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/setting/getAdminProfile/${userId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const handlePermissionForAdmin = async (
  id: string,
  payload: AdminPermissions
) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/setting/updateAdminPermissions/${id}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNewAccessUser = async (payload: AddNewUserPayload) => {
  let result;
  try {
    result = await axiosInstance.post(`/setting/addNewUser`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};
