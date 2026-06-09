import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { RegisterRequest } from '../api/types';

const vacio: RegisterRequest = {
  email: '', password: '', nombre: '', documento: '', tipoDocumento: 'CC', contacto: '', direccion: '',
};

export default function RegistroPage() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>(vacio);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const set = (campo: keyof RegisterRequest, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const auth = await authApi.register(form);
      entrar(auth);
      navigate('/portal');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-400 via-amber-300 to-emerald-500 p-4">
      <div className="w-full max-w-lg">
        {/* Logo / Marca */}
        <div className="mb-8 text-center">
          <div className="text-5xl mb-3">🐾</div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
            Cuidado Animal con Amor
          </h1>
          <p className="mt-1 text-white/80 font-medium">Crea tu cuenta y cuida a tu mascota</p>
        </div>

        <div className="rounded-3xl bg-white/95 backdrop-blur p-8 shadow-2xl">
          <h2 className="mb-1 text-xl font-bold text-slate-800">Crear cuenta</h2>
          <p className="mb-6 text-sm text-slate-500">Regístrate para agendar servicios para tus mascotas</p>

          {error && (
            <p className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600" data-testid="error">
              {error}
            </p>
          )}

          <form onSubmit={submit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Nombre completo</label>
                <input data-testid="nombre" value={form.nombre}
                  placeholder="Tu nombre completo"
                  onChange={(e) => set('nombre', e.target.value)} required />
              </div>
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Email</label>
                <input type="email" data-testid="email" value={form.email}
                  placeholder="tucorreo@ejemplo.com"
                  onChange={(e) => set('email', e.target.value)} required />
              </div>
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Contraseña</label>
                <input type="password" data-testid="password" value={form.password}
                  placeholder="••••••••"
                  onChange={(e) => set('password', e.target.value)} required />
              </div>
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Contacto</label>
                <input value={form.contacto ?? ''} placeholder="Teléfono o celular"
                  onChange={(e) => set('contacto', e.target.value)} />
              </div>
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Tipo documento</label>
                <select value={form.tipoDocumento ?? 'CC'} onChange={(e) => set('tipoDocumento', e.target.value)}>
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                  <option value="TI">TI</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Número de documento</label>
                <input data-testid="documento" value={form.documento}
                  placeholder="Ej. 1234567890"
                  onChange={(e) => set('documento', e.target.value)} required />
              </div>
              <div className="field-portal sm:col-span-2">
                <label className="font-semibold text-slate-700">Dirección</label>
                <input value={form.direccion ?? ''} placeholder="Tu dirección (opcional)"
                  onChange={(e) => set('direccion', e.target.value)} />
              </div>
            </div>

            <button className="btn-portal mt-5 w-full" type="submit" data-testid="registrar" disabled={cargando}>
              {cargando ? 'Creando cuenta…' : 'Crear mi cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
