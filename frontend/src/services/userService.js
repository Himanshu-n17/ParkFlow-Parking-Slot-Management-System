import API from "./api";

export const getAvailableSlots = async () => {
  const res = await API.get("/user/slots");
  return res.data;
};

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

export const cancelBooking = async (bookingId) => {
  const res = await API.post("/bookings/cancel-booking", {
    bookingId,
  });
  return res.data;
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");

  const response = await API.put(`user/profile/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
