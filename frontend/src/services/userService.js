import API from "./api";

// for user profile
export const getUserStats = async (userId) => {
  const res = await API.get(`/user/stats/${userId}`);
  return res.data;
};

export const getCurrentParking = async (userId) => {
  const res = await API.get(`/user/current/${userId}`);
  return res.data;
};

export const getBookingHistory = async (userId) => {
  const res = await API.get(`/user/history/${userId}`);
  return res.data;
};
