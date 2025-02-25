import React from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./components/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";

// Componente de protección de rutas
const PrivateAdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.is_staff ? children : <p>No tienes permiso para ver esta página.</p>;
};

function App() {
  return (
    <AuthProvider> 
      <CartProvider> 
        <Navbar /> 
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />

            
            {/* Protegemos el acceso al panel de admin */}
            <Route path="/admin" element={<PrivateAdminRoute><AdminPanel /></PrivateAdminRoute>} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;






