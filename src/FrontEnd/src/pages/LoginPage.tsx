import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const user = await authApi.login({ email, password });
      entrar(user);
      navigate(user.role === 'Cliente' ? '/portal' : '/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header igual al dashboard */}
      <header className="bg-brand shadow-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
          <img src="/vete.png" alt="Logo" className="h-10 object-contain" />
          <span className="text-white font-extrabold text-lg hidden sm:block">
            Cuidado Animal con Amor
          </span>
        </div>
        <div className="bg-brand-dark">
          <div className="mx-auto max-w-6xl px-6 py-1.5">
            <span className="text-white/50 text-xs">Acceso al panel de gestión</span>
          </div>
        </div>
      </header>

      {/* Formulario centrado */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">

            {/* Franja verde superior */}
            <div className="bg-brand px-8 py-6 text-center">
              <img src="/vete.png" alt="Logo" className="mx-auto h-16 object-contain mb-2" />
              <h1 className="text-white font-extrabold text-xl">Iniciar sesión</h1>
              <p className="text-white/70 text-sm mt-1">Panel de gestión veterinaria</p>
            </div>

            {/* Campos */}
            <div className="px-8 py-7">
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200
                                px-4 py-3 text-sm text-red-600" data-testid="error">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div className="field-auth">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    data-testid="email"
                    value={email}
                    placeholder="correo@veterinaria.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="field-auth">
                  <label>Contraseña</label>
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
                  type="submit"
                  data-testid="entrar"
                  disabled={cargando}
                  className="btn-auth mt-2"
                >
                  {cargando ? 'Verificando…' : 'Entrar'}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="font-bold text-brand hover:text-brand-dark">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Cuidado Animal con Amor
      </footer>
    </div>
  );
}
