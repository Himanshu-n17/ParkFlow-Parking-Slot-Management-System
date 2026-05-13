import API from "./api";

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const sendOtp = async (data) => {
  const res = await API.post("/auth/send-otp", data);
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await API.post("/auth/verify-otp", data);
  return res.data;
};

export const sendResetOtp = async (email) => {
  const response = await API.post(`/auth/forgot-password`, {
    email,
  });

  return response.data;
};

export const verifyResetOtp = async (data) => {
  const response = await API.post(`/auth/verify-reset-otp`, data);

  return response.data;
};

export const resetPassword = async (data) => {
  const response = await API.post(`/auth/reset-password`, data);

  return response.data;
};
