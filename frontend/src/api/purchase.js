import { axiosInstance } from "./axios";

export const getCoursePurchaseStatus = async (courseId) => {
  const res = await axiosInstance.get(`/purchase/course/${courseId}/detail-with-status`);
  return res.data;
};

export const initiateStripeCheckout = async (courseId) => {
  const res = await axiosInstance.post("/purchase/checkout/create-checkout-session", { courseId });
  return res.data;
};
