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

export const getAllSlots = async () => {
  const res = await API.get("/admin/slots");
  return res.data;
};

export const bookSlot = async (data) => {
  return API.post("/admin/book", data);
};

export const cancelBooking = async (slotId) => {
  return API.put(`/admin/cancel/${slotId}`);
};

export const freeSlot = async (slotId) => {
  return API.put(`/admin/free/${slotId}`);
};

export const createSlot = async (slotData) => {
  const res = await API.post("/slots", slotData);
  return res.data;
};

export const deleteSlot = async (slotId) => {
  const res = await API.delete(`/slots/${slotId}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const getAllTransactions = async () => {
  const res = await API.get("/admin/transactions");
  return res.data;
};

export const updateUser = async (id, payload) => {
  const response = await API.put(`/admin/users/${id}`, payload);
  return response.data;
};

export const toggleBlockUser = async (id) => {
  const response = await API.put(`/admin/users/block/${id}`);
  return response.data;
};

export const getFloorUtilization = async () => {
  const res = await API.get("/admin/floor-utilization");
  return res.data;
};

export const downloadTransactionReport = async () => {
  const response = await API.get("/admin/reports/revenue", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;

  link.setAttribute(
    "download",
    `transaction_report_${new Date().toLocaleDateString("en-GB").replaceAll("/", "-")}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadBookingReport = async () => {
  const response = await API.get("/admin/reports/bookings", {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `booking_report_${new Date().toLocaleDateString("en-GB").replaceAll("/", "-")}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
};