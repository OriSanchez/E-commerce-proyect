import React from "react";
import "../styles/Footer.css"; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Sección de navegación */}
        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/products">Productos</a></li>
            <li><a href="/contact">Contacto</a></li>
            <li><a href="/about">Nosotros</a></li>
          </ul>
        </div>

        {/* Sección de contacto */}
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Email: ShopNexus51@gmail.com</p>
          <p>Teléfono: +57 324 3182545</p>
          <p>Dirección: Bogota D.C, Colombia</p>
        </div>

        {/* Sección de redes sociales */}
        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Línea de derechos reservados */}
      <div className="footer-bottom">
        <p>&copy; 2025 ShopNexus. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
