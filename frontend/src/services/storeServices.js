import axios from "axios";

const API_URL = "http://localhost:8000/api/products/"; // Ajusta según tu backend


export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};


export const createProduct = async (product) => {
  const token = localStorage.getItem("access_token");
  const response = await axios.post(API_URL, product, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Actualizar producto (Solo Admin)
export const updateProduct = async (product) => {
  const token = localStorage.getItem("access_token");
  const response = await axios.put(`${API_URL}${product.id}/`, product, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Eliminar producto (Solo Admin)
export const deleteProduct = async (productId) => {
  return await axios.delete(`${API_URL}/products/${productId}/`);
};


