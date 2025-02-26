import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/auth/';

// Registro
export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}register/`, userData);
      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error.response?.data)
      throw new Error(error.response?.data?.detail || 'Error en el registro');
    }
  };

// Login
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}login/`, { username, password });

    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);  
      
      // Obtener perfil después de iniciar sesión
      const userProfile = await getProfile();
      
      return { token: response.data.access, user: userProfile };
    }

    throw new Error('Respuesta inválida del servidor');
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Credenciales incorrectas');
  }
};


// Obtener el perfil del usuario
// Obtener el perfil del usuario
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data; // La respuesta debe incluir `is_staff`
  } catch (error) {
    console.error("Error al obtener el perfil", error);
    throw new Error("No se pudo obtener el perfil");
  }
};


// Actualizar perfil del usuario
export const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}profile/edit/`, profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el perfil", error);
      throw new Error("No se pudo actualizar el perfil");
    }
  };



