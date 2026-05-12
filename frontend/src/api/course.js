import { axiosInstance } from "./axios";

export const getPublishedCourses = async () => {
  const res = await axiosInstance.get("/course/published");
  return res.data;
};

export const getMyCourses = async (role) => {
  if (role === "instructor") {
    const res = await axiosInstance.get("/course"); // Instructor's created courses
    return res.data;
  } else {
    // Assuming we have a get purchased courses route... wait, we need to check the backend.
    const res = await axiosInstance.get("/purchase"); // Fetch purchases for student
    return res.data;
  }
};

export const getCourseDetails = async (courseId) => {
  const res = await axiosInstance.get(`/course/c/${courseId}`);
  return res.data;
};
