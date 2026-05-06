import { Package, History, Box } from 'lucide-react';

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Box size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Inventario</h1>
            <p className="text-xs text-slate-400">Panel de gestión</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => onNavigate('productos')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'productos'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Package size={18} />
          Gestión de Productos
        </button>

        <button
          onClick={() => onNavigate('movimientos')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'movimientos'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <History size={18} />
          Historial de Movimientos
        </button>
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 text-center">v1.0.0</p>
      </div>
    </aside>
  );
}
