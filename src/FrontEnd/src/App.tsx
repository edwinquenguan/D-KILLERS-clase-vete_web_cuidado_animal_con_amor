import { useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import DuenosPage from './pages/DuenosPage';
import MascotasPage from './pages/MascotasPage';
import TurnosPage from './pages/TurnosPage';
import SalaEsperaPage from './pages/SalaEsperaPage';
import CitasAdminPage from './pages/CitasAdminPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import PortalLayout from './pages/portal/PortalLayout';
import PortalMascotasPage from './pages/portal/PortalMascotasPage';
import AgendarPage from './pages/portal/AgendarPage';
import RutaProtegida from './components/RutaProtegida';
import { useAuth } from './context/AuthContext';

const links = [
  { to: '/mascotas', label: 'Mascotas' },
  { to: '/duenos', label: 'Dueños' },
  { to: '/turnos', label: 'Turnos' },
  { to: '/citas', label: 'Citas' },
];

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { sesion, salir } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded px-3 py-2 font-semibold transition-colors ${
      isActive ? 'bg-white/20' : 'hover:bg-white/10'
    }`;

  const logout = () => { salir(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-brand text-white shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold">🐾 Cuidado Animal con Amor · Admin</Link>
          <nav className="hidden items-center gap-2 sm:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>{l.label}</NavLink>
            ))}
            <Link to="/sala" className="ml-2 rounded bg-white/20 px-3 py-2 font-semibold hover:bg-white/30">
              📺 Sala
            </Link>
            <button onClick={logout} className="ml-2 rounded bg-white/10 px-3 py-2 font-semibold hover:bg-white/20">
              Salir
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
            <Link to="/sala" className="block rounded bg-white/20 px-3 py-2 font-semibold"
              onClick={() => setOpen(false)}>📺 Sala de espera</Link>
            <button onClick={logout} className="block w-full rounded bg-white/10 px-3 py-2 text-left font-semibold">
              Salir ({sesion?.nombre})
            </button>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/mascotas" replace />} />
          <Route path="/mascotas" element={<MascotasPage />} />
          <Route path="/duenos" element={<DuenosPage />} />
          <Route path="/turnos" element={<TurnosPage />} />
          <Route path="/citas" element={<CitasAdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/sala" element={<SalaEsperaPage />} />

      {/* Portal del cliente (rol CLIENTE) */}
      <Route path="/portal" element={
        <RutaProtegida rol="CLIENTE"><PortalLayout /></RutaProtegida>
      }>
        <Route index element={<PortalMascotasPage />} />
        <Route path="agendar" element={<AgendarPage />} />
      </Route>

      {/* Panel administrativo (rol ADMIN) */}
      <Route path="/*" element={
        <RutaProtegida rol="ADMIN"><AdminLayout /></RutaProtegida>
      } />
    </Routes>
  );
}
