import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, citiesApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { City } from '../api/types';

export default function RegisterPage() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    name: '', first_surname: '', second_surname: '',
    email: '', phone: '', password: '', confirmar: '',
    city: 0, address: '',
  });
  const [error, setError]     = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => { citiesApi.list().then(setCities).catch(() => {}); }, []);

  const set = (campo: string, valor: string | number) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    if (form.password !== form.confirmar) { setError('Las contraseñas no coinciden'); return; }
    if (!form.city) { setError('Selecciona tu ciudad'); return; }
    setCargando(true);
    try {
      const user = await authApi.register({
        name: form.name,
        first_surname: form.first_surname,
        second_surname: form.second_surname || undefined,
        email: form.email,
        phone: form.phone,
        password: form.password,
        city: form.city,
        address: form.address || undefined,
      });
      entrar(user);
      navigate('/portal');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-brand shadow-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
          <img src="/vete.png" alt="Logo" className="h-10 object-contain" />
          <span className="text-white font-extrabold text-lg hidden sm:block">
            Cuidado Animal con Amor
          </span>
        </div>
        <div className="bg-brand-dark">
          <div className="mx-auto max-w-6xl px-6 py-1.5">
            <span className="text-white/50 text-xs">Crear cuenta de cliente</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-start justify-center p-6 pt-10">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">

            {/* Franja verde */}
            <div className="bg-brand px-8 py-5 text-center">
              <h1 className="text-white font-extrabold text-xl">Crear mi cuenta</h1>
              <p className="text-white/70 text-sm mt-1">Regístrate para gestionar tus citas</p>
            </div>

            <div className="px-8 py-7">
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="field-auth">
                    <label>Nombre *</label>
                    <input value={form.name} onChange={(e) => set('name', e.target.value)}
                      placeholder="María" required />
                  </div>
                  <div className="field-auth">
                    <label>Primer apellido *</label>
                    <input value={form.first_surname} onChange={(e) => set('first_surname', e.target.value)}
                      placeholder="García" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="field-auth">
                    <label>Segundo apellido</label>
                    <input value={form.second_surname} onChange={(e) => set('second_surname', e.target.value)}
                      placeholder="López" />
                  </div>
                  <div className="field-auth">
                    <label>Teléfono *</label>
                    <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                      placeholder="300 123 4567" required />
                  </div>
                </div>

                <div className="field-auth">
                  <label>Correo electrónico *</label>
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                    placeholder="micorreo@ejemplo.com" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="field-auth">
                    <label>Ciudad *</label>
                    <select value={form.city || ''} onChange={(e) => set('city', Number(e.target.value))} required>
                      <option value="">-- Selecciona --</option>
                      {cities.map((c) => (
                        <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-auth">
                    <label>Dirección</label>
                    <input value={form.address} onChange={(e) => set('address', e.target.value)}
                      placeholder="Calle 1 # 2-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="field-auth">
                    <label>Contraseña *</label>
                    <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
                      placeholder="Mín. 6 caracteres" required minLength={6} />
                  </div>
                  <div className="field-auth">
                    <label>Confirmar contraseña *</label>
                    <input type="password" value={form.confirmar} onChange={(e) => set('confirmar', e.target.value)}
                      placeholder="Repite la contraseña" required />
                  </div>
                </div>

                <button type="submit" disabled={cargando} className="btn-auth mt-2">
                  {cargando ? 'Creando cuenta…' : 'Crear mi cuenta'}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-bold text-brand hover:text-brand-dark">
                  Inicia sesión aquí
                </Link>
              </p>
              <p className="mt-2 text-center text-sm text-slate-400">
                <Link to="/" className="hover:text-brand">← Volver al inicio</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Cuidado Animal con Amor
      </footer>
    </div>
  );
}
