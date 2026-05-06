import { useState } from 'react';
import axios from 'axios';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const API_MOVEMENTS = 'http://localhost:8082/api';
const API_PRODUCTOS = 'http://localhost:8081/api';

export default function MovementModal({ product, onClose, onDone }) {
  const isEntrada = product.tipo === 'ENTRADA';
  const [cantidad, setCantidad] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cantidad < 1) return;

    const qty = parseInt(cantidad, 10);
    const nuevoStock = isEntrada
      ? (product.stock ?? 0) + qty
      : (product.stock ?? 0) - qty;

    try {
      setSaving(true);

      await axios.post(`${API_MOVEMENTS}/movimientos`, {
        productoId: product.id,
        productoNombre: product.nombre,
        tipo: product.tipo,
        cantidad: qty,
      });

      await axios.put(`${API_PRODUCTOS}/productos/${product.id}`, {
        nombre: product.nombre,
        precio: product.precio,
        stock: nuevoStock,
      });

      onDone();
    } catch {
      alert('Error al registrar el movimiento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {isEntrada ? (
              <ArrowDownCircle size={20} className="text-emerald-600" />
            ) : (
              <ArrowUpCircle size={20} className="text-rose-600" />
            )}
            <h3 className="text-lg font-semibold text-slate-900">
              {isEntrada ? 'Registrar Entrada' : 'Registrar Salida'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <span className="text-slate-500">Producto:</span>{' '}
            <span className="font-medium text-slate-900">{product.nombre}</span>
            <br />
            <span className="text-slate-500">Stock actual:</span>{' '}
            <span className="font-medium text-slate-900">{product.stock ?? 0}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              autoFocus
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
            {!isEntrada && cantidad > (product.stock ?? 0) && (
              <p className="text-xs text-rose-500 mt-1">
                La cantidad supera el stock actual.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 py-2.5 px-4 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 ${
                isEntrada
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isEntrada ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
              {saving ? 'Registrando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
