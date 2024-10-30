import { useState, useEffect } from 'react'
import axios from 'axios';
import './ProductManagement.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ProductManagement() {
  // eslint-disable-next-line no-unused-vars
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newProducto, setNewProducto] = useState({
    codigo: '',
    nombre: '',
    marca: '',
    precio: '',
    categoriaId: '',
  });
  const [newCategoria, setNewCategoria] = useState({ nombre: '' });

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${backendUrl}/productos`);
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${backendUrl}/productos/listar-categorias`);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleProductoSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/productos`, newProducto);
      fetchProductos();
      setNewProducto({ codigo: '', nombre: '', marca: '', precio: '', categoriaId: '' });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleCategoriaSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/productos/crear-categoria`, newCategoria);
      fetchCategorias();
      setNewCategoria({ nombre: '' });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div className="product-management">
      <h1>Gestión de Productos</h1>

      <div className="form-container">
        <div className="form-section">
          <h2>Crear Producto</h2>
          <form onSubmit={handleProductoSubmit}>
            <input
              type="text"
              placeholder="Código"
              value={newProducto.codigo}
              onChange={(e) => setNewProducto({ ...newProducto, codigo: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nombre"
              value={newProducto.nombre}
              onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Marca"
              value={newProducto.marca}
              onChange={(e) => setNewProducto({ ...newProducto, marca: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Precio"
              value={newProducto.precio}
              onChange={(e) => setNewProducto({ ...newProducto, precio: parseFloat(e.target.value) })}
              required
            />
            <select
              value={newProducto.categoriaId}
              onChange={(e) => setNewProducto({ ...newProducto, categoriaId: e.target.value })}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <button type="submit">Crear Producto</button>
          </form>
          {/*}<h3>Lista de Productos</h3>
          <ul>
            {productos.map((producto) => (
              <li key={producto.id}>
                {producto.nombre} - {producto.marca} - ${producto.precio.toFixed(2)}
              </li>
            ))}
          </ul>{*/}
        </div>

        <div className="form-section">
          <h2>Crear Categoría</h2>
          <form onSubmit={handleCategoriaSubmit}>
            <input
              type="text"
              placeholder="Nombre de la Categoría"
              value={newCategoria.nombre}
              onChange={(e) => setNewCategoria({ nombre: e.target.value })}
              required
            />
            <button type="submit">Crear Categoría</button>
          </form>
          <h3>Lista de Categorías</h3>
          <ul>
            {categorias.map((categoria) => (
              <li key={categoria.id}>{categoria.nombre}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;

