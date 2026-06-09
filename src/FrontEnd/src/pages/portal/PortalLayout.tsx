import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { portalApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { Notificacion } from '../../api/types';

const POLL_MS = 10000;

export default function PortalLayout() {
  const { sesion, salir } = useAuth();
  const navigate = useNavigate();
  const [notis, setNotis] = useState<Notificacion[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const prevCount = useRef(0);

  useEffect(() => {
    const cargar = () =>
      portalApi.notificaciones().then((n) => {
        setNotis(n);
        prevCount.current = n.length;
      }).catch(() => {});
    cargar();
    const t = setInterval(cargar, POLL_MS);
    return () => clearInterval(t);
  }, []);

  const marcarLeidas = async () => {
    await portalApi.marcarLeidas().catch(() => {});
    setNotis([]);
    setAbierto(false);
  };

  const logout = () => { salir(); navigate('/login'); };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
      isActive
        ? 'bg-white text-orange-600 shadow-md'
        : 'text-white/90 hover:bg-white/20'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-emerald-500 shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link to="/portal" className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <div className="hidden sm:block">
              <div className="text-base font-extrabold text-white leading-tight">
                Cuidado Animal con Amor
              </div>
              <div className="text-xs text-white/70 font-medium">Portal de cliente</div>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-2 sm:flex">
            <NavLink to="/portal" end className={navClass}>
              🐾 Mis mascotas
            </NavLink>
            <NavLink to="/portal/agendar" className={navClass}>
              📅 Agendar
            </NavLink>

            {/* Campana */}
            <div className="relative ml-1">
              <button
                className="relative rounded-full p-2 hover:bg-white/20 transition-colors"
                onClick={() => setAbierto((v) => !v)}
                aria-label="Notificaciones"
                data-testid="campana"
              >
                <span className="text-xl">🔔</span>
                {notis.length > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse"
                    data-testid="noti-count"
                  >
                    {notis.length}
                  </span>
                )}
              </button>

              {abierto && (
                <div className="absolute right-0 z-20 mt-2 w-80 rounded-2xl border border-orange-100 bg-white p-4 shadow-2xl">
                  <p className="mb-3 text-sm font-bold text-slate-800">🔔 Notificaciones</p>
                  {notis.length === 0 ? (
                    <p className="text-sm text-slate-500">Sin avisos nuevos.</p>
                  ) : (
                    <>
                      <ul className="space-y-2" data-testid="noti-lista">
                        {notis.map((n) => (
                          <li key={n.citaId} className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
                            ✅ {n.mensaje}
                          </li>
                        ))}
                      </ul>
                      <button className="btn-portal mt-3 w-full text-sm" onClick={marcarLeidas}>
                        Marcar como leídas
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="ml-2 flex items-center gap-2">
              <span className="hidden text-sm text-white/80 xl:inline">{sesion?.nombre}</span>
              <button
                className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
                onClick={logout}
              >
                Salir
              </button>
            </div>
          </nav>

          {/* Hamburger mobile */}
          <div className="flex items-center gap-3 sm:hidden">
            {/* Campana mobile */}
            <div className="relative">
              <button
                className="relative rounded-full p-2 hover:bg-white/20"
                onClick={() => setAbierto((v) => !v)}
                aria-label="Notificaciones"
                data-testid="campana"
              >
                <span className="text-xl">🔔</span>
                {notis.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse"
                    data-testid="noti-count">{notis.length}</span>
                )}
              </button>
              {abierto && (
                <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-orange-100 bg-white p-4 shadow-2xl">
                  <p className="mb-3 text-sm font-bold text-slate-800">🔔 Notificaciones</p>
                  {notis.length === 0 ? (
                    <p className="text-sm text-slate-500">Sin avisos nuevos.</p>
                  ) : (
                    <>
                      <ul className="space-y-2" data-testid="noti-lista">
                        {notis.map((n) => (
                          <li key={n.citaId} className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
                            ✅ {n.mensaje}
                          </li>
                        ))}
                      </ul>
                      <button className="btn-portal mt-3 w-full text-sm" onClick={marcarLeidas}>
                        Marcar como leídas
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="rounded-lg p-2 hover:bg-white/10"
              onClick={() => setMenuAbierto((o) => !o)}
              aria-label="Menú"
            >
              <span className="block h-0.5 w-6 bg-white" />
              <span className="mt-1.5 block h-0.5 w-6 bg-white" />
              <span className="mt-1.5 block h-0.5 w-6 bg-white" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuAbierto && (
          <div className="border-t border-white/20 px-4 pb-4 sm:hidden space-y-2">
            <NavLink to="/portal" end className={navClass} onClick={() => setMenuAbierto(false)}>
              🐾 Mis mascotas
            </NavLink>
            <NavLink to="/portal/agendar" className={navClass} onClick={() => setMenuAbierto(false)}>
              📅 Agendar
            </NavLink>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-sm text-white/70">{sesion?.nombre}</span>
              <button className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white" onClick={logout}>
                Salir
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
