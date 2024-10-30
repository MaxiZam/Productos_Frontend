import { useEffect, useState } from 'react';
import axios from 'axios';

function UltimasVentas() {
  const [ultimasVentas, setUltimasVentas] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para el loading
  const [error, setError] = useState(null); // Estado para manejar errores
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const storedClient = localStorage.getItem('user');
  const clientData = storedClient ? JSON.parse(storedClient) : null;

  useEffect(() => {
    const fetchUltimasVentas = async () => {
      setLoading(true); // Inicia la carga
      try {
        if (clientData && clientData.id) {
          const response = await axios.get(`${backendUrl}/api/ventas/ultimas/${clientData.id}`);
          setUltimasVentas(response.data);
        } else {
          setError('No se encontró información del usuario.');
        }
      } catch (error) {
        console.error('Error al obtener las últimas ventas:', error);
        setError('Error al cargar las ventas.'); // Mensaje de error en la UI
      } finally {
        setLoading(false); // Termina la carga
      }
    };fetchUltimasVentas();
  }, [backendUrl]);

  if (loading) {
    return <p>Cargando...</p>; // Mensaje de carga
  }

  return (
    <div className="ultimas-ventas container">
      <h3>Últimas Ventas Realizadas</h3>
      {error && <p>{error}</p>} {/* Mensaje de error */}
      {ultimasVentas.length > 0 ? (
        <ul>
          {ultimasVentas.map((venta) => (
            <li key={venta.id}> {/* Usa un ID único en lugar de índice */}
              <strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()} <br />
              <strong>Monto Total:</strong> ${venta.montoTotal} <br />
              <strong>Productos:</strong> {venta.productos.map(p => p.nombre).join(', ')}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron ventas recientes.</p>
      )}
    </div>
  );
}

export default UltimasVentas;
