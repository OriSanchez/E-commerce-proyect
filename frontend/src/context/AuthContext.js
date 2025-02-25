import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const fetchUser = async () => {
        try {
          const userData = await getProfile();
          console.log("Datos de usuario recibidos:", userData);  
          setUser(userData);  
        } catch (error) {
          console.error("Error al obtener el perfil");
          localStorage.removeItem("access_token");
        }
      };
      fetchUser();
    }
  }, []);

  const login = (userData) => {
    console.log("Usuario autenticado:", userData); 
    setUser(userData);
    localStorage.setItem("access_token", userData.token);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);








