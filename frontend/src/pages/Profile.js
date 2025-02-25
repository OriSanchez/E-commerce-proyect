import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authServices";
import "../styles/Profile.css";


function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ ...user });
  const [editing, setEditing] = useState(false); // Estado para alternar entre vista y edición

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile(formData);
      setUser(updatedUser); // Actualizar usuario en el contexto
      setEditing(false); // Volver a la vista de solo lectura
    } catch (err) {
      console.error("Error al actualizar perfil", err);
    }
  };

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      {user ? (
        <>
          {!editing ? (
            // Vista solo lectura
            <div className="profile-details">
              <p><strong>Nombre:</strong> {user.first_name}</p>
              <p><strong>Apellido:</strong> {user.last_name}</p>
              <p><strong>Correo electrónico:</strong> {user.email}</p>
              <p><strong>Dirección:</strong> {user.address}</p>
              <p><strong>Teléfono:</strong> {user.phone_number}</p>
              <button className="edit-button" onClick={() => setEditing(true)}>Editar</button>
            </div>
          ) : (
            // Vista de edición
            <form className="profile-form" onSubmit={handleSubmit}>
              <input type="text" name="first_name" value={formData.first_name || ""} onChange={handleChange} placeholder="Nombre" />
              <input type="text" name="last_name" value={formData.last_name || ""} onChange={handleChange} placeholder="Apellido" />
              <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="Correo electrónico" />
              <input type="text" name="address" value={formData.address || ""} onChange={handleChange} placeholder="Dirección" />
              <input type="text" name="phone_number" value={formData.phone_number || ""} onChange={handleChange} placeholder="Teléfono" />
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setEditing(false)}>Cancelar</button>
            </form>
          )}
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
  
}

export default Profile;

