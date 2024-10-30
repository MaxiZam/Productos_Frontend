import { useState } from 'react';
import Navbar from './navbar/Navbar';
import UltimasVentas from './ventas/UltimasVentas';
import ProductList from './lista_productos/ProductList';
import Login from './login/Login';
import Register from './register/Register';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Estado para el usuario autenticado
  const [view, setView] = useState(''); // Controla la vista seleccionada

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setView('productos'); // Vista predeterminada después del inicio de sesión
  };

  const handleLogout = () => {
    setUser(null);
    setView(''); // Vuelve a la vista inicial
  };

  const handleViewChange = (newView) => {
    setView(newView); // Cambia la vista según la selección
  };

  return (
    <div className="main">
      {/* Barra de navegación */}
      <Navbar user={user} onLogout={handleLogout} onViewChange={handleViewChange} />

      <div className="contenido">
        {/* Contenido principal */}
        <main style={{ padding: '20px' }}>
          {!user ? (
            view === 'register' ? <Register onRegister={handleLogin} /> : <Login onLogin={handleLogin} />
          ) : (
            <>
              <h2>Bienvenido, {user.nombre} {user.apellido}!</h2>
              {view === 'ultimasVentas' ? (
                <UltimasVentas userId={user.id} />
              ) : view === 'productos' ? (
                <ProductList />
              ) : (
                <p>Seleccione una opción del menú</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
