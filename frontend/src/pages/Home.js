import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenido a ShopNexus</h1>
      <p>Descubra un mundo de productos de calidad con ShopNexus. Disfrute de una experiencia de compra fluida con pago seguro y diversas opciones de pago. ¡Comience a explorar hoy mismo! </p>
      <Link to="/products">Ver Productos</Link>
    </div>
  );
}

export default Home;

  