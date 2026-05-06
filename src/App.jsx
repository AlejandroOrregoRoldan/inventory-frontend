import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProductosView from './components/ProductosView';
import MovimientosView from './components/MovimientosView';
import LoginView from './components/LoginView';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [view, setView] = useState('productos');

  const handleLogin = () => {
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Sidebar activeView={view} onNavigate={setView} onLogout={handleLogout} />
      <main className="ml-64 p-8">
        {view === 'productos' ? <ProductosView /> : <MovimientosView />}
      </main>
    </div>
  );
}
