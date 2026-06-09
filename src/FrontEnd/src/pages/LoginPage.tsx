import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const auth = await authApi.login({ email, password });
      entrar(auth);
      navigate(auth.rol === 'ADMIN' ? '/mascotas' : '/portal');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-400 via-amber-300 to-emerald-500 p-4">
      <div className="w-full max-w-md">
        {/* Logo / Marca */}
        <div className="mb-8 text-center">
          <div className="text-6xl mb-3">🐾</div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
            Cuidado Animal con Amor
          </h1>
          <p className="mt-1 text-white/80 font-medium">Veterinaria · Tu mascota, nuestra pasión</p>
        </div>

        <div className="rounded-3xl bg-white/95 backdrop-blur p-8 shadow-2xl">
          <h2 className="mb-1 text-xl font-bold text-slate-800">Iniciar sesión</h2>
          <p className="mb-6 text-sm text-slate-500">Accede a tu portal de cliente</p>

          {error && (
            <p className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600" data-testid="error">
              {error}
            </p>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="field-portal">
              <label className="font-semibold text-slate-700">Email</label>
              <input
                type="email"
                data-testid="email"
                value={email}
                placeholder="tucorreo@ejemplo.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field-portal">
              <label className="font-semibold text-slate-700">Contraseña</label>
              <input
                type="password"
                data-testid="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="btn-portal w-full mt-2"
              type="submit"
              data-testid="entrar"
              disabled={cargando}
            >
              {cargando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-orange-500 hover:text-orange-600">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
