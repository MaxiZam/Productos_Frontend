// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Obtener productos al cargar la página
  const fetchProductos = () => {
    axios.get(`${backendUrl}/api/productos`)
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener productos:', error));
  };

  useEffect(() => {
    fetchProductos();
  }, [backendUrl]);

  // Obtener categorías para el formulario de edición
  useEffect(() => {
    axios.get(`${backendUrl}/api/productos/listar-categorias`)
      .then(response => setCategorias(response.data))
      .catch(error => console.error('Error al obtener categorías:', error));
  }, [backendUrl]);

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
    <div className='productos'>
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
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.marca}</td>
              <td>${producto.precio}</td>
              <td>{categorias.find(c => c.id === producto.categoriaId)?.nombre || 'Sin categoría'}</td>
              <td>
                <button onClick={() => handleEditClick(producto)}>Modificar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para edición del producto */}
      {modalVisible && productoSeleccionado && (
        <div className="modal">
          <h3>Editar Producto</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>ID:</label>
              <span>{productoSeleccionado.id}</span>
            </div>

            <div>
              <label>Codigo: </label>
              <input
                type="text"
                name="codigo"
                value={productoSeleccionado.codigo}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div>
              <label>Nombre: </label>
              <input
                type="text"
                name="nombre"
                value={productoSeleccionado.nombre}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label>Marca: </label>
              <input
                type="text"
                name="marca"
                value={productoSeleccionado.marca || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label>Precio: </label>
              <input
                type="number"
                name="precio"
                value={productoSeleccionado.precio}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label>Categoría: </label>
              <select
                name="categoriaId"
                value={productoSeleccionado.categoriaId || ''}
                onChange={handleInputChange}
              >
                <option value="" disabled>Selecciona una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>

            <div>
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
    </div>
  );
};

export default ProductList;


