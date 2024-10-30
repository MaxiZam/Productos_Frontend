import { useEffect, useState } from 'react';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
function UltimasVentas({ userId }) {
  const [ultimasVentas, setUltimasVentas] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUltimasVentas = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/ventas/ultimas/${userId}`);
        setUltimasVentas(response.data);
      } catch (error) {
        console.error('Error al obtener las últimas ventas:', error);
      }
    };

    // Solo hace la solicitud si existe un userId
    if (userId) {
      fetchUltimasVentas();
    }
  }, [backendUrl, userId]);

  return (
    <div className="ultimas-ventas container">
      <h3>Últimas Ventas Realizadas</h3>
      {ultimasVentas.length > 0 ? (
        <ul>
          {ultimasVentas.map((venta, index) => (
            <li key={index}>
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
