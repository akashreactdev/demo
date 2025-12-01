import axiosInstance from "../interceptor";

interface NotificationData {
  notificationTitle: string;
  notificationMessage: string;
  userBase: number | null;
  reminderType: number | null;
  pushDate: string | null;
  eventName?: number | null;
}

export const getAllNotifications = async () => {
  try {
    return await axiosInstance.get("/setting/appNotification-list");
  } catch (error) {
    console.error("Error fetching notifications data:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    return await axiosInstance.delete(
      `/setting/deleteAdminNotification?id=${notificationId}`
    );
  } catch (error) {
    console.error("Error delete notifications data:", error);
    throw error;
  }
};

export const updateNotification = async (notificationId: string) => {
  try {
    return await axiosInstance.post(
      `/setting/updateAdminNotification/${notificationId}?isMarkAsRead=true&isArchive=true`
    );
  } catch (error) {
    console.error("Error update notifications data:", error);
    throw error;
  }
};

export const createNotification = async (payload: NotificationData) => {
  try {
    return await axiosInstance.post(`/setting/createNotification`, payload);
  } catch (error) {
    console.error("Error create notifications data:", error);
    throw error;
  }
};

export const getAllArchiveNotifications = async () => {
  try {
    return await axiosInstance.get(`/setting/archiveNotification`);
  } catch (error) {
    console.error("Error get all notifications data:", error);
    throw error;
  }
};

export const getAllPushNotifications = async () => {
  try {
    return await axiosInstance.get("/setting/notification-list");
  } catch (error) {
    console.error("Error fetching notifications data:", error);
    throw error;
  }
};

export const clearAllNotification = async () => {
  try {
    return await axiosInstance.delete(`/setting/deleteAdminNotification`);
  } catch (error) {
    console.error("Error delete notifications data:", error);
    throw error;
  }
};

export const markAsReadNotification = async (
  notificationId: string,
  isMarkAsRead: boolean
) => {
  try {
    return await axiosInstance.post(
      `/setting/updateAdminNotification/${notificationId}?isMarkAsRead=${!isMarkAsRead}`
    );
  } catch (error) {
    console.error("Error update notifications data:", error);
    throw error;
  }
};

export const archieveNotification = async (
  notificationId: string,
  isArchive: boolean
) => {
  try {
    return await axiosInstance.post(
      `/setting/updateAdminNotification/${notificationId}?isArchive=${!isArchive}`
    );
  } catch (error) {
    console.error("Error update notifications data:", error);
    throw error;
  }
};
