import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Pencil, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import ProductModal from './ProductModal';
import MovementModal from './MovementModal';

const API_PRODUCTOS = 'http://localhost:8081/api';

function getRol() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return jwtDecode(token).rol;
  } catch {
    return null;
  }
}

export default function ProductosView() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const rol = getRol();
  const isAdmin = rol === 'ADMIN';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_PRODUCTOS}/productos`);
      setProducts(res.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) setError('Token inválido o expirado. Cierra sesión y vuelve a iniciar.');
        else if (err.response.status === 403) setError('Acceso denegado. Se requiere rol ADMIN.');
        else setError(`Error del servidor (${err.response.status}).`);
      } else {
        setError('No se pudo conectar a localhost:8081. ¿Está corriendo el product-service?');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await axios.delete(`${API_PRODUCTOS}/productos/${id}`);
      fetchProducts();
    } catch {
      alert('Error al eliminar el producto.');
    }
  };

  const filtered = products.filter((p) =>
    p.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const openMovement = (product, tipo) => {
    setSelectedProduct({ ...product, tipo });
    setShowMovementModal(true);
  };

  const handleProductSaved = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleMovementDone = () => {
    setShowMovementModal(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Productos</h2>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} producto{products.length !== 1 ? 's' : ''} en inventario
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus size={18} />
            Nuevo Producto
          </button>
        )}
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Cargando productos...</div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            {search ? 'Sin resultados para esta búsqueda.' : 'No hay productos registrados.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-3.5 font-medium text-slate-500">Nombre</th>
                <th className="text-center px-6 py-3.5 font-medium text-slate-500">Stock</th>
                <th className="text-right px-6 py-3.5 font-medium text-slate-500">Precio</th>
                <th className="text-center px-6 py-3.5 font-medium text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-800">{p.nombre}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.stock > 10
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.stock > 0
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {p.stock ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right text-slate-700">
                    ${parseFloat(p.precio ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openMovement(p, 'ENTRADA')}
                        title="Registrar entrada"
                        className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        <ArrowDownCircle size={17} />
                      </button>
                      <button
                        onClick={() => openMovement(p, 'SALIDA')}
                        title="Registrar salida"
                        className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <ArrowUpCircle size={17} />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => openEdit(p)}
                            title="Editar producto"
                            className="p-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            title="Eliminar producto"
                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={17} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSaved={handleProductSaved}
        />
      )}

      {showMovementModal && selectedProduct && (
        <MovementModal
          product={selectedProduct}
          onClose={() => {
            setShowMovementModal(false);
            setSelectedProduct(null);
          }}
          onDone={handleMovementDone}
        />
      )}
    </div>
  );
}
