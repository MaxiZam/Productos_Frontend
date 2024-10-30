import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCompraVisible, setModalCompraVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [clienteId, setClienteId] = useState(''); // Nuevo estado para ID de cliente
  const [tarjetaId, setTarjetaId] = useState(''); // Nuevo estado para ID de tarjeta
  const [tarjetas, setTarjetas] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  //inicio
  useEffect(() => {
    const storedClient = localStorage.getItem('user');

    fetchProductos();
    if (storedClient) {
      const clientData = JSON.parse(storedClient);
      setClienteId(clientData.id);
      setTarjetas(clientData.tarjetas); // Establece las tarjetas del cliente
      if (clientData.tarjetas.length > 0) {
        setTarjetaId(clientData.tarjetas[0].id);
      }
    }
    axios.get(`${backendUrl}/api/productos/listar-categorias`)
      .then(response => setCategorias(response.data))
      .catch(error => console.error('Error al obtener categorías:', error));
  }, [backendUrl, clienteId]);

  const handleCheckboxChange = (productoId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productoId)) {
        return prevSelected.filter((id) => id !== productoId);
      } else {
        return [...prevSelected, productoId];
      }
    });
  };

  // Modal de compra
  const handleBuyClick = () => {
    if (selectedProducts.length === 0) {
      alert('Por favor, selecciona al menos un producto.');
      return;
    }
    setModalCompraVisible(true); // Abre el modal de compra
  };

  // Obtener productos al cargar la página
  const fetchProductos = () => {
    axios.get(`${backendUrl}/api/productos`)
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener productos:', error));
  };

  // Abrir modal de edición con los datos del producto seleccionado
  const handleEditClick = (producto) => {
    setProductoSeleccionado(producto);
    setModalVisible(true);
    setErrorMessage('');
  };

  // Manejar cambio de datos en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoSeleccionado(prevProducto => ({
      ...prevProducto,
      [name]: value
    }));
  };

  // Manejar el envío del formulario de edición
  const handleSubmit = (e) => {
    e.preventDefault();
    modificarProducto(
      productoSeleccionado.id,
      productoSeleccionado.nombre,
      productoSeleccionado.precio,
      productoSeleccionado.marca,
      productoSeleccionado.categoriaId,
      productoSeleccionado.version
    );
  };

  // Función para modificar el producto
  const modificarProducto = async (id, nombre, precio, marca, categoriaId, version) => {
    try {
      await axios.put(`${backendUrl}/api/productos/${id}`, {
        nombre,
        precio,
        marca,
        categoriaId,
        version
      });

      // Volver a cargar la lista de productos y cerrar el modal
      fetchProductos();
      setModalVisible(false);
      setErrorMessage('');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data || 'Error desconocido');
      } else {
        setErrorMessage('Error desconocido al modificar el producto');
      }
    }
  };

  return (
    <div className='productos-table contenido'>
      <h2>Lista de Productos</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
            <th>Selecciona</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.marca}</td>
              <td>${producto.precio}</td>
              <td>{producto.categoria.nombre}</td>
              <td>
                <button onClick={() => handleEditClick(producto)}>Modificar</button>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(producto.id)}
                  onChange={() => handleCheckboxChange(producto.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleBuyClick} disabled={selectedProducts.length === 0}>
        Comprar
      </button>

      {/* Modal para edición del producto */}
      {modalVisible && productoSeleccionado && (
        <div className="modal">
          <h3>Editar Producto</h3>
          <form onSubmit={handleSubmit}>
            <div className='dato'>
              <label>ID:</label>
              <span>{productoSeleccionado.id}</span>
            </div>

            <div className='dato'>
              <label>Codigo: </label>
              <input
                type="text"
                name="codigo"
                value={productoSeleccionado.codigo}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div className='dato'>
              <label>Nombre: </label>
              <input
                type="text"
                name="nombre"
                value={productoSeleccionado.nombre}
                onChange={handleInputChange}
              />
            </div>
            
            <div className='dato'>
              <label>Marca: </label>
              <input
                type="text"
                name="marca"
                value={productoSeleccionado.marca || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className='dato'>
              <label>Precio: </label>
              <input
                type="number"
                name="precio"
                value={productoSeleccionado.precio}
                onChange={handleInputChange}
              />
            </div>

            <div className='dato'>
              <label>Categoría: </label>
              <select
                name="categoriaId"
                value={productoSeleccionado.categoria ? productoSeleccionado.categoria.id : ''}
                onChange={handleInputChange}
              >
                <option value="" disabled>Selecciona una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>

            <div className='dato'>
              <label>Versión: </label>
              <input
                type="number"
                name="version"
                value={productoSeleccionado.version}
                onChange={handleInputChange}
                disabled
              />
            </div>
            
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setModalVisible(false)}>Cancelar</button>
          </form>
        </div>
      )}
      {modalCompraVisible && (
        <div className="modal">
          <h3>Confirmar Compra</h3>
          <p>Productos seleccionados:</p>
          <ul>
            {selectedProducts.map((id) => {
              const producto = productos.find((p) => p.id === id);
              return <li key={id}>{producto.nombre}</li>; // Muestra el nombre del producto
            })}
          </ul>
          <div>
            <label>Tarjeta:</label>
            <select value={tarjetaId} onChange={(e) => setTarjetaId(e.target.value)}>
              <option value="">Selecciona una tarjeta</option>
              {tarjetas.map(tarjeta => (
                <option key={tarjeta.id} value={tarjeta.id}>{tarjeta.nombre}</option>
              ))}
            </select>
          </div>
          <button onClick={handleBuyClick}>Confirmar Compra</button>
          <button onClick={() => setModalCompraVisible(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;