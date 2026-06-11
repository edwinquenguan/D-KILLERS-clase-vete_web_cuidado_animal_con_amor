import { useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import DuenosPage from './pages/DuenosPage';
import MascotasPage from './pages/MascotasPage';
import CitasAdminPage from './pages/CitasAdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MisCitasPage from './pages/portal/MisCitasPage';
import SolicitarCitaPage from './pages/portal/SolicitarCitaPage';
import RutaProtegida from './components/RutaProtegida';
import { useAuth } from './context/AuthContext';

const STAFF = ['Admin', 'Veterinario', 'Recepcionista'];

// ─── Página de bienvenida ─────────────────────────────────────────────────────
function PaginaInicio() {
  const { sesion, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400 text-sm">Cargando…</p>
      </div>
    );
  }

  // Con sesión activa → redirigir al panel correspondiente
  if (sesion) return <Navigate to={sesion.role === 'Cliente' ? '/portal' : '/dashboard'} replace />;

  return (
    <div className="min-h-screen bg-white">
      {/* Barra superior estilo Animals */}
      <header className="bg-brand shadow-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <img src="/vete.png" alt="Cuidado Animal con Amor" className="h-12 object-contain" />
          <span className="text-white font-extrabold text-xl tracking-tight hidden sm:block">
            Cuidado Animal con Amor
          </span>
        </div>
      </header>

      {/* Barra de navegación secundaria */}
      <nav className="bg-brand-dark">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-6 py-2">
          {[
            { label: 'Perros',           href: '#especies' },
            { label: 'Gatos',            href: '#especies' },
            { label: 'Otras Especies',   href: '#especies' },
            { label: 'Salud y Bienestar',href: '#bienestar' },
            { label: 'Servicios',        href: '#servicios' },
          ].map((cat) => (
            <a key={cat.label} href={cat.href}
              className="whitespace-nowrap text-sm font-bold text-white/70 hover:text-white py-1 transition-colors">
              {cat.label}
            </a>
          ))}
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16 text-center">
          <img src="/vete.png" alt="Logo" className="mx-auto mb-6 h-24 object-contain" />
          <h1 className="text-4xl font-extrabold text-brand mb-3">
            Cuidado Animal con Amor
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto">
            Tu clínica veterinaria de confianza — salud y bienestar para cada especie
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-brand-dark transition-colors">
              Acceder al panel
            </Link>
            <Link to="/registro"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand px-8 py-3 text-base font-bold text-brand hover:bg-brand-light transition-colors">
              Crear cuenta de cliente
            </Link>
          </div>
        </section>

        {/* Sección Especies */}
        <section id="especies" className="bg-brand-light py-14 scroll-mt-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-extrabold text-brand mb-2 text-center">Nuestros Pacientes</h2>
            <p className="text-center text-slate-500 text-sm mb-8">Atendemos a todas las especies con el mismo cuidado y dedicación</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { emoji: '🐕', titulo: 'Perros', desc: 'Consultas, vacunas, cirugías y control de peso para tu mejor amigo.' },
                { emoji: '🐈', titulo: 'Gatos',  desc: 'Medicina felina especializada, esterilización, desparasitación y más.' },
                { emoji: '🐇', titulo: 'Otras Especies', desc: 'Conejos, aves, reptiles y animales exóticos atendidos por especialistas.' },
              ].map((e) => (
                <Link key={e.titulo} to="/registro"
                  className="rounded-2xl bg-white border border-brand/15 p-6 shadow-sm hover:shadow-lg hover:border-brand/40 hover:-translate-y-0.5 transition-all text-left block group">
                  <div className="text-5xl mb-3">{e.emoji}</div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{e.titulo}</h3>
                  <p className="text-slate-500 text-sm mb-3">{e.desc}</p>
                  <span className="text-brand text-sm font-semibold group-hover:underline">Solicitar cita →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Salud y Bienestar */}
        <section id="bienestar" className="py-14 scroll-mt-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-extrabold text-brand mb-2 text-center">Salud y Bienestar</h2>
            <p className="text-center text-slate-500 text-sm mb-8">Prevención y cuidado continuo para una vida larga y feliz</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: '💉', titulo: 'Vacunación', desc: 'Planes de vacunación adaptados a la edad y especie.' },
                { icon: '🔬', titulo: 'Diagnóstico', desc: 'Laboratorio clínico y diagnóstico por imágenes en sitio.' },
                { icon: '🥗', titulo: 'Nutrición', desc: 'Planes nutricionales personalizados según raza y condición.' },
                { icon: '🫀', titulo: 'Chequeos', desc: 'Revisiones periódicas para detectar problemas a tiempo.' },
              ].map((s) => (
                <Link key={s.titulo} to="/registro"
                  className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-brand/30 hover:shadow-md hover:-translate-y-0.5 transition-all block group">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <h3 className="font-semibold text-slate-800 mb-1">{s.titulo}</h3>
                  <p className="text-slate-500 text-xs mb-2">{s.desc}</p>
                  <span className="text-brand text-xs font-semibold group-hover:underline">Agendar →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Servicios */}
        <section id="servicios" className="bg-brand-light py-14 scroll-mt-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-extrabold text-brand mb-2 text-center">Nuestros Servicios</h2>
            <p className="text-center text-slate-500 text-sm mb-8">Gestión veterinaria completa en un solo lugar</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { icon: '🐾', titulo: 'Registro de Mascotas', desc: 'Historial clínico completo por paciente con seguimiento de visitas y tratamientos.', href: '/registro' },
                { icon: '👤', titulo: 'Soy cliente nuevo', desc: 'Regístrate y accede a tu portal para ver y solicitar citas para tus mascotas.', href: '/registro' },
                { icon: '📅', titulo: 'Solicitar cita', desc: 'Reserva tu turno en línea y recibe seguimiento de cada atención.', href: '/registro' },
              ].map((s) => (
                <Link key={s.titulo} to={s.href}
                  className="rounded-2xl border border-brand/15 bg-white p-6 shadow-sm hover:shadow-lg hover:border-brand/40 hover:-translate-y-0.5 transition-all text-left block group">
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{s.titulo}</h3>
                  <p className="text-slate-500 text-sm mb-3">{s.desc}</p>
                  <span className="text-brand text-sm font-semibold group-hover:underline">Comenzar →</span>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/registro"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-brand-dark transition-colors">
                Registrarme como cliente
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Cuidado Animal con Amor — Todos los derechos reservados
      </footer>
    </div>
  );
}

// ─── Portal layout (clientes) ────────────────────────────────────────────────
function PortalLayout() {
  const { sesion, salir } = useAuth();
  const navigate = useNavigate();
  const logout = async () => { await salir(); navigate('/'); };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand shadow-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2">
          <Link to="/portal" className="flex items-center gap-3">
            <img src="/vete.png" alt="Logo" className="h-10 object-contain" />
            <span className="hidden sm:block text-white font-extrabold text-lg leading-tight">
              Cuidado Animal<br />
              <span className="text-white/70 text-xs font-normal">con Amor</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white text-sm font-semibold leading-none">{sesion?.name}</p>
              <p className="text-white/60 text-xs mt-0.5">Mi portal</p>
            </div>
            <button onClick={logout}
              className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
              Salir
            </button>
          </div>
        </div>
        <div className="bg-brand-dark">
          <div className="mx-auto max-w-4xl px-4 py-1.5 flex gap-5">
            <NavLink to="/portal/mis-citas"
              className={({ isActive }) =>
                `text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`
              }>
              📅 Mis citas
            </NavLink>
            <NavLink to="/portal/solicitar-cita"
              className={({ isActive }) =>
                `text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`
              }>
              ➕ Solicitar cita
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/portal/mis-citas" replace />} />
          <Route path="/mis-citas" element={<MisCitasPage />} />
          <Route path="/solicitar-cita" element={<SolicitarCitaPage />} />
        </Routes>
      </main>
    </div>
  );
}

// ─── Dashboard layout ─────────────────────────────────────────────────────────
const navLinks = [
  { to: '/dashboard/mascotas', label: 'Mascotas',     icon: '🐾' },
  { to: '/dashboard/duenos',   label: 'Propietarios', icon: '👤' },
  { to: '/dashboard/citas',    label: 'Citas',        icon: '📅' },
];

function DashboardLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { sesion, salir } = useAuth();
  const navigate = useNavigate();

  const logout = async () => { await salir(); navigate('/'); };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors
     ${isActive ? 'bg-white text-brand' : 'text-white/90 hover:bg-white/15'}`;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header principal — verde Animals */}
      <header className="bg-brand shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/vete.png" alt="Logo" className="h-10 object-contain" />
            <span className="hidden sm:block text-white font-extrabold text-lg leading-tight">
              Cuidado Animal<br />
              <span className="text-white/70 text-xs font-normal">con Amor</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>
                <span>{l.icon}</span> {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Usuario + salir */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-white text-sm font-semibold leading-none">
                {sesion?.name} {sesion?.first_surname}
              </p>
              <p className="text-white/60 text-xs mt-0.5">{sesion?.role}</p>
            </div>
            <button onClick={logout}
              className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
              Salir
            </button>
          </div>

          {/* Menú hamburguesa mobile */}
          <button className="sm:hidden text-white p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMenuAbierto(o => !o)} aria-label="Menú">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuAbierto ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* Nav secundaria desktop — barra oscura */}
        <div className="bg-brand-dark hidden sm:block">
          <div className="mx-auto max-w-6xl px-4 py-1.5 flex items-center gap-2">
            <span className="text-white/50 text-xs">Panel de gestión</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50 text-xs">
              {sesion?.role}
            </span>
          </div>
        </div>

        {/* Mobile menu desplegable */}
        {menuAbierto && (
          <div className="sm:hidden bg-brand-dark border-t border-white/10 px-4 py-3 space-y-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}
                onClick={() => setMenuAbierto(false)}>
                <span>{l.icon}</span> {l.label}
              </NavLink>
            ))}
            <div className="border-t border-white/10 pt-2 mt-2 flex items-center justify-between">
              <span className="text-white/70 text-sm">
                {sesion?.name} — {sesion?.role}
              </span>
              <button onClick={logout}
                className="text-sm font-bold text-white/80 hover:text-white">
                Salir
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/mascotas" replace />} />
          <Route path="/mascotas" element={<MascotasPage />} />
          <Route path="/duenos"   element={<DuenosPage />} />
          <Route path="/citas"    element={
            <RutaProtegida roles={STAFF}><CitasAdminPage /></RutaProtegida>
          } />
        </Routes>
      </main>
    </div>
  );
}

// ─── App raíz ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<PaginaInicio />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Portal de clientes */}
      <Route path="/portal/*" element={
        <RutaProtegida roles={['Cliente']}><PortalLayout /></RutaProtegida>
      } />

      {/* Panel de staff */}
      <Route path="/dashboard/*" element={
        <RutaProtegida roles={STAFF}><DashboardLayout /></RutaProtegida>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
