import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/cart/"; 

export const getCart = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el carrito", error);
    throw error;
  }
};

export const addToCart = async (productId, quantity, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { product_id: productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error agregando producto al carrito", error);
    throw error;
  }
};

export const updateCartItem = async (productId, quantity, token) => {
  try {
    const response = await axios.put(
      API_URL,
      { product_id: productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando carrito", error);
    throw error;
  }
};

export const removeFromCart = async (productId, token) => {
  console.log("🛒 Eliminando producto con ID:", productId); 

  if (!productId || productId === 0) {
    console.error("❌ Error: productId no válido", productId);
    return;
  }

  try {
    const response = await axios.delete(`${API_URL}${productId}/`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error eliminando producto del carrito", error);
    throw error;
  }
};

  



  