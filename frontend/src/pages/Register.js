import { useState } from "react";
import { registerUser } from "../services/authServices"; 
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    // address: "",
    // phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        // address: formData.address,//
        // phone_number: formData.phone_number,
        password: formData.password,
        password2: formData.confirmPassword,
      });
      
      // Redirigir al login después de un registro exitoso
      navigate("/login");
    } catch (err) {
      // Si ocurre algún error durante el registro
      setError("Error en el registro. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          onChange={handleChange}
          value={formData.first_name}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          onChange={handleChange}
          value={formData.last_name}
          required
        />
        {/* <input
          type="text"
          name="address"
          placeholder="Dirección"
          onChange={handleChange}
          value={formData.address}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Teléfono"
          onChange={handleChange}
          value={formData.phone_number}
          required
        /> */}
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
