import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

// Obtener la lista de productos
const getProducts = async () => {
  const response = await axios.get(`${API_URL}products/`);
  return response.data;
};

// Obtener todas las categorías
const getCategories = async () => {
  const response = await axios.get(`${API_URL}categories/`);
  return response.data;
};

// Obtener productos por categoría
const getProductsByCategory = async (categoryId) => {
  const response = await axios.get(`${API_URL}products/?category=${categoryId}`);
  return response.data;
};

// Eliminar un producto
const deleteProduct = async (productId, token) => {
  await axios.delete(`${API_URL}products/${productId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getProducts, deleteProduct, getCategories, getProductsByCategory };

