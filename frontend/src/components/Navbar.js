import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css"; // Importamos el CSS

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid"> {/* Full width */}
        <Link className="nav-tittle" to="/">ShopNexus</Link>
        
        
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul >
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/products">Productos</Link></li>
          </ul>

          <ul > {/* Elementos alineados a la derecha */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    Carrito {cart.length > 0 && <span className="badge bg-primary">{cart.length}</span>}
                  </Link>
                </li>

                {cart.length > 0 && (
                  <li className="nav-item"><Link className="nav-link" to="/checkout">Finalizar Compra</Link></li>
                )}

                <li className="nav-item"><Link className="nav-link" to="/profile">Perfil</Link></li>

                {user.is_staff && <li className="nav-item"><Link className="nav-link" to="/admin">Panel Admin</Link></li>}

                <li className="nav-item">
                  <button className= "nav-link"onClick={logout}>Cerrar sesión</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Iniciar sesión</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Registrarse</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;







