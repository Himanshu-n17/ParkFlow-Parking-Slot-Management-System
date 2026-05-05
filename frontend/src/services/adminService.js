import API from "./api";

export const getAdminStats = async () => {
  const response = await API.get("/admin/stats");
  return response.data;
};

export const getWeeklyRevenue = async () => {
  const res = await API.get("/admin/revenue-weekly");
  return res.data;
};

export const getPeakHours = async () => {
  const res = await API.get("/admin/peak-hours");
  return res.data;
};

export const getUtilization = async () => {
  const res = await API.get("/admin/utilization");
  return res.data;
};
