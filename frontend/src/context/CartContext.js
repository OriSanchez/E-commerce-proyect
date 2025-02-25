import React, { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, removeFromCart } from "../services/cartServices";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const cartData = await getCart(token);
      console.log("Datos del carrito:", cartData); 
      setCart(Array.isArray(cartData.cart_items) ? cartData.cart_items : []); 
    } catch (error) {
      console.error("Error obteniendo el carrito", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    try {
      await addToCart(product.id, 1, token);
      await fetchCart(); // Recargar el carrito correctamente
    } catch (error) {
      console.error("No se pudo agregar el producto al carrito", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    try {
      await removeFromCart(productId, token);
      await fetchCart(); // Recargar el carrito correctamente
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  const clearCart = () => {
    setCart([]); 
  };
  

  return (
    <CartContext.Provider value={{ cart, addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

