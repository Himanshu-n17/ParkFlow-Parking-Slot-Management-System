import API from "./api";

export const getAllSlots = async () => {
  const res = await API.get("/slots");
  return res.data;
};

export const getCurrentBooking = async (userId) => {
  const res = await API.get(`/user/current/${userId}`);
  return res.data;
};

export const bookSlot = async (payload) => {
  const res = await API.post("/slots/book-slot", payload);
  return res.data;
};
