import { useState } from 'react';
import axios from 'axios';
import { Box, LogIn, UserPlus, AlertCircle } from 'lucide-react';

const AUTH_API = 'http://localhost:8083/api/auth';

export default function LoginView({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('USER');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      setError('El usuario debe tener al menos 3 caracteres.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const endpoint = isRegister ? '/register' : '/login';
      const body = isRegister
        ? { username: username.trim(), password, rol }
        : { username: username.trim(), password };
      const res = await axios.post(`${AUTH_API}${endpoint}`, body);

      if (isRegister) {
        setIsRegister(false);
        setError(null);
      } else {
        localStorage.setItem('token', res.data.token);
        onLogin();
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error de conexión con el servidor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Box size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Gestor de Inventario</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRegister ? 'Crear una cuenta nueva' : 'Inicia sesión para continuar'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              placeholder="Tu nombre de usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              placeholder="Tu contraseña"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Rol
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            {loading
              ? 'Procesando...'
              : isRegister
              ? 'Crear cuenta'
              : 'Iniciar sesión'}
          </button>

          <p className="text-center text-xs text-slate-500">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
