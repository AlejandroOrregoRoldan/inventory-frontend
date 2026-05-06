import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProductosView from './components/ProductosView';
import MovimientosView from './components/MovimientosView';

export default function App() {
  const [view, setView] = useState('productos');

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Sidebar activeView={view} onNavigate={setView} />
      <main className="ml-64 p-8">
        {view === 'productos' ? <ProductosView /> : <MovimientosView />}
      </main>
    </div>
  );
}
