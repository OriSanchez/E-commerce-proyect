import axios from "axios";

const API_URL = "http://localhost:8000/api/admin/";

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}users/`);
  return response.data;
};

export const createStaffUser = async (userData) => {
  const response = await axios.post(`${API_URL}create-staff/`, userData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
  });
  return response.data;
};
