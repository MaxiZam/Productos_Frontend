import { useState } from 'react';

// eslint-disable-next-line react/prop-types
function Navbar({ user, onLogout, onViewChange }) {
  const [ventasOpen, setVentasOpen] = useState(false);

  const toggleVentasMenu = () => {
    setVentasOpen(!ventasOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Vientos Patagonicos</div>
      <div className="navbar-menu">
        {!user ? (
          <>
            <button onClick={() => onViewChange('login')}>Login</button>
            <button onClick={() => onViewChange('register')}>Register</button>
          </>
        ) : (
          <>
            <button onClick={() => onViewChange('productos')}>Productos</button>
            <button onClick={() => onViewChange('descuentos')}>Descuentos</button>
            <div className="dropdown">
              <button onClick={toggleVentasMenu} className="dropbtn">
                Ventas
              </button>
              {ventasOpen && (
                <div className="dropdown-content">
                  <button onClick={() => onViewChange('todasVentas')}>Todas las ventas</button>
                  <button onClick={() => onViewChange('ultimasVentas')}>Últimas ventas realizadas</button>
                </div>
              )}
            </div>
            <button onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;