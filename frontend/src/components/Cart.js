import React from "react";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();

  console.log("Carrito:", cart); // Verificar la estructura del carrito en consola

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index}> {/* Usamos el índice como clave ya que no hay un ID claro */}
              <p>
                {item.product_name} - {item.quantity} x {item.price}€
              </p>
              <button onClick={() => removeFromCart(item.product_id)}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;




