import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { loginUser } from '../services/authServices';
import { useAuth } from '../context/AuthContext';
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const { setUser } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password); 
      localStorage.setItem('access_token', response.token); 
      setUser(response.user); 
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
    </div>
  );
};

export default Login;




