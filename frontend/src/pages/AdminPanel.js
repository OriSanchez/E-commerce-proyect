import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, createStaffUser } from "../services/adminServices";

function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [newStaff, setNewStaff] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getUsers();
        console.log("Usuarios obtenidos:", response); // ✅ Debug
        setUsers(response);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    }

    if (user?.is_staff) {
      fetchUsers();
    }
  }, [user]);

  const handleChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await createStaffUser(newStaff);
      alert("Usuario staff creado exitosamente");
    } catch (error) {
      alert("Error al crear usuario staff");
    }
  };

  return (
    <div>
      <h2>Panel de Administración</h2>

      {user?.is_staff ? (
        <>
          <h3>Usuarios Registrados</h3>
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                {u.username} - {u.email} {u.is_staff ? "(Admin)" : ""}
              </li>
            ))}
          </ul>

          <h3>Crear Usuario Staff</h3>
          <form onSubmit={handleCreateStaff}>
            <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
            <button type="submit">Crear Admin</button>
          </form>
        </>
      ) : (
        <p>No tienes permiso para ver esta página.</p>
      )}
    </div>
  );
}

export default AdminPanel;


