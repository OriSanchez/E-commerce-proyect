import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderServices";
import { useNavigate } from "react-router-dom";

function Checkout() {
    
    const { cart, fetchCart, clearCart } = useCart();
    const [address, setAddress] = useState("");
    const navigate = useNavigate();

  const handleOrder = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }

    try {
      await createOrder(address, token);
      alert("Orden creada con éxito.");
      fetchCart(); 
      clearCart();
      navigate("/profile");
    } catch (error) {
      alert("Hubo un problema al procesar la compra.");
    }
  };

  return (
    <div>
      <h2>Confirmar Compra</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          <h3>Resumen del pedido:</h3>
          {cart.map((item) => (
            <p key={item.product_id}>
              {item.product_name} - {item.quantity} x {item.price}€
            </p>
          ))}
          <label>Dirección de Envío:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button onClick={handleOrder}>Confirmar Compra</button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
