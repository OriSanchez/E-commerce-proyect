import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/order/";

export const createOrder = async (address, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { address },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear la orden", error);
    throw error;
  }
};
