import axios from "@/services/axios.customize";

export const loginApi = (email, password) => {
  const urlBackend = "/api/v1/user/login";
  return axios.post(urlBackend, { email, password });
};

export const registerApi = (name, email, password) => {
  const urlBackend = "/api/v1/user/register";
  return axios.post(urlBackend, { name, email, password });
};

export const verifyAccountApi = (userId, otpCode) => {
  const urlBackend = "/api/v1/user/verify-otp";
  return axios.post(urlBackend, { userId, otpCode });
};

export const getHomepageProductApi = () => {
  const urlBackend = "/api/v1/product/homepage";
  return axios.get(urlBackend);
};

export const getProductByIdApi = (id) => {
  const urlBackend = `/api/v1/product/${id}`;
  return axios.get(urlBackend);
};

// Forgot password
export const requestPasswordResetApi = (email) => {
  const urlBackend = "/api/v1/user/password/request-reset";
  return axios.post(urlBackend, { email });
};

export const verifyResetOtpApi = (email, otpCode) => {
  const urlBackend = "/api/v1/user/password/verify-otp";
  return axios.post(urlBackend, { email, otpCode });
};

export const resetPasswordApi = (email, otpCode, newPassword) => {
  const urlBackend = "/api/v1/user/password/reset";
  return axios.post(urlBackend, { email, otpCode, newPassword });
};

// Get current user info
export const getMeApi = () => {
  const urlBackend = "/api/v1/user/me";
  return axios.get(urlBackend);
};

export const getAllProductApi = (query) => {
  const urlBackend = "/api/v1/product";
  return axios.get(urlBackend, { params: query });
};

export const getMyCartApi = () => {
  const urlBackend = "/api/v1/cart";
  return axios.get(urlBackend);
};

export const addToCartApi = (productId, quantity) => {
  const urlBackend = "/api/v1/cart/add";
  return axios.post(urlBackend, { productId, quantity });
};

// Orders
export const createOrderApi = (payload) => {
  const urlBackend = "/api/v1/order";
  return axios.post(urlBackend, payload);
};

export const getMyOrdersApi = () => {
  const urlBackend = "/api/v1/order";
  return axios.get(urlBackend);
};

export const requestCancelOrderApi = (orderId) => {
  const urlBackend = `/api/v1/order/${orderId}/cancel-request`;
  return axios.patch(urlBackend);
};
