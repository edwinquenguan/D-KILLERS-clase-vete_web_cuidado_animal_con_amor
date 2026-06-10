import { useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import DuenosPage from './pages/DuenosPage';
import MascotasPage from './pages/MascotasPage';
import CitasAdminPage from './pages/CitasAdminPage';
import ConsultasPage from './pages/TurnosPage';
import SalaEsperaPage from './pages/SalaEsperaPage';
import LoginPage from './pages/LoginPage';
import RutaProtegida from './components/RutaProtegida';
import { useAuth } from './context/AuthContext';

const STAFF_ROLES = ['Admin', 'Veterinario', 'Recepcionista'];

const links = [
  { to: '/mascotas', label: 'Mascotas' },
  { to: '/duenos', label: 'Dueños' },
  { to: '/citas', label: 'Citas' },
  { to: '/consultas', label: 'Consultas' },
];

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { sesion, salir } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded px-3 py-2 font-semibold transition-colors ${
      isActive ? 'bg-white/20' : 'hover:bg-white/10'
    }`;

  const logout = async () => { await salir(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-brand text-white shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold">Cuidado Animal con Amor</Link>
          <nav className="hidden items-center gap-2 sm:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>{l.label}</NavLink>
            ))}
            <button onClick={logout} className="ml-2 rounded bg-white/10 px-3 py-2 font-semibold hover:bg-white/20">
              Salir ({sesion?.name})
            </button>
          </nav>
          <button
            className="rounded p-2 hover:bg-white/10 sm:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <span className="block h-0.5 w-6 bg-white" />
            <span className="mt-1 block h-0.5 w-6 bg-white" />
            <span className="mt-1 block h-0.5 w-6 bg-white" />
          </button>
        </div>
        {open && (
          <nav className="space-y-1 px-4 pb-3 sm:hidden">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <button onClick={logout} className="block w-full rounded bg-white/10 px-3 py-2 text-left font-semibold">
              Salir ({sesion?.name})
            </button>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/mascotas" replace />} />
          <Route path="/mascotas" element={<MascotasPage />} />
          <Route path="/duenos" element={<DuenosPage />} />
          <Route path="/citas" element={<CitasAdminPage />} />
          <Route path="/consultas" element={<ConsultasPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sala" element={<SalaEsperaPage />} />

      <Route path="/*" element={
        <RutaProtegida roles={STAFF_ROLES}><AdminLayout /></RutaProtegida>
      } />
    </Routes>
  );
}
