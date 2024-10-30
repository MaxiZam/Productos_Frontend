import { useState } from 'react'
import axios from 'axios';

// eslint-disable-next-line react/prop-types
function Login({ onLogin }) {
  const [email, setEmail] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/clientes/login`, { email: email });
      localStorage.setItem('user', JSON.stringify(response.data));
      onLogin(response.data); // Pasamos los datos del cliente autenticado
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Credenciales incorrectas");
      } else {
        alert("Ocurrió un error al iniciar sesión");
      }
    }
  };

  return (
    <div className="form-container container" style={{ padding: '20px' }}>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
