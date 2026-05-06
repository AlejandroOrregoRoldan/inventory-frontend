import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowDownCircle, ArrowUpCircle, AlertCircle } from 'lucide-react';

const API_MOVEMENTS = 'http://localhost:8082/api';

export default function MovimientosView() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_MOVEMENTS}/movimientos`);
      setMovements(res.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) setError('token');
        else if (err.response.status === 404) setError('endpoint');
        else setError(`server-${err.response.status}`);
      } else {
        setError('connection');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovements(); }, []);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Historial de Movimientos</h2>
        <p className="text-sm text-slate-500 mt-1">
          Registro de entradas y salidas del inventario
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Cargando historial...</div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle size={40} className="mx-auto text-amber-400 mb-3" />
            {error === 'endpoint' ? (
              <>
                <p className="text-slate-700 font-medium mb-1">Endpoint no disponible</p>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  El endpoint <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">GET /api/movimientos</code>{' '}
                  aún no está implementado.
                </p>
              </>
            ) : error === 'token' ? (
              <>
                <p className="text-slate-700 font-medium mb-1">Token inválido o expirado</p>
                <p className="text-sm text-slate-500">
                  Cierra sesión y vuelve a iniciar para obtener un token nuevo.
                </p>
              </>
            ) : (
              <>
                <p className="text-slate-700 font-medium mb-1">Error de conexión</p>
                <p className="text-sm text-slate-500">
                  No se pudo conectar a <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">localhost:8082</code>.
                  ¿Está corriendo el movement-service?
                </p>
                <button
                  onClick={fetchMovements}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Reintentar
                </button>
              </>
            )}
          </div>
        ) : movements.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No hay movimientos registrados.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-3.5 font-medium text-slate-500">Producto</th>
                <th className="text-center px-6 py-3.5 font-medium text-slate-500">Tipo</th>
                <th className="text-center px-6 py-3.5 font-medium text-slate-500">Cantidad</th>
                <th className="text-left px-6 py-3.5 font-medium text-slate-500">Usuario</th>
                <th className="text-right px-6 py-3.5 font-medium text-slate-500">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-800">
                    {m.productoNombre ?? `ID: ${m.productoId}`}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {m.tipo === 'ENTRADA' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        <ArrowDownCircle size={13} />
                        Entrada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                        <ArrowUpCircle size={13} />
                        Salida
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-center text-slate-700">
                    {m.cantidad}
                  </td>
                  <td className="px-6 py-3.5 text-slate-700 text-xs font-medium">
                    {m.usuario ?? '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right text-slate-500 text-xs">
                    {formatDate(m.fecha)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
