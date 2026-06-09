import { FormEvent, useEffect, useState } from 'react';
import { portalApi, serviciosApi } from '../../api/client';
import type { Mascota, MascotaRequest, Servicio } from '../../api/types';

const vacio: MascotaRequest = { nombre: '', raza: '', anios: undefined, servicio: '' };

function iconoMascota(raza?: string): string {
  const r = (raza ?? '').toLowerCase();
  if (r.includes('gat') || r.includes('persas') || r.includes('siames')) return '🐱';
  if (r.includes('conejo') || r.includes('rabbit')) return '🐰';
  if (r.includes('ave') || r.includes('loro') || r.includes('canario')) return '🦜';
  if (r.includes('hamster') || r.includes('cobayo')) return '🐹';
  if (r.includes('pez') || r.includes('goldfish')) return '🐟';
  return '🐶';
}

export default function PortalMascotasPage() {
  const [items, setItems] = useState<Mascota[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [form, setForm] = useState<MascotaRequest>(vacio);
  const [error, setError] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);

  const cargar = () => portalApi.misMascotas().then(setItems).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
    serviciosApi.list().then(setServicios).catch(() => {});
  }, []);

  const labelServicio = (n?: string) => servicios.find((s) => s.nombre === n)?.label ?? n ?? '-';
  const esPrioritario = (n?: string) => servicios.find((s) => s.nombre === n)?.prioritario ?? false;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.servicio) { setError('Selecciona un servicio'); return; }
    try {
      await portalApi.crearMascota(form);
      setForm(vacio);
      setFormAbierto(false);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      {/* Encabezado de sección */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Mis mascotas 🐾</h2>
          <p className="text-sm text-slate-500 mt-0.5">Consulta el estado de tus mascotas y su turno de atención</p>
        </div>
        <button
          className="btn-portal flex items-center gap-2"
          onClick={() => setFormAbierto((v) => !v)}
        >
          {formAbierto ? '✕ Cancelar' : '＋ Nueva mascota'}
        </button>
      </div>

      {/* Formulario colapsable */}
      {formAbierto && (
        <div className="portal-card mb-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <h3 className="mb-4 text-lg font-bold text-orange-700">🐾 Registrar nueva mascota</h3>
          {error && (
            <p className="mb-3 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600" data-testid="error">
              {error}
            </p>
          )}
          <form onSubmit={submit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Nombre de la mascota</label>
                <input data-testid="nombre" value={form.nombre}
                  placeholder="Ej. Max, Luna, Coco..."
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              </div>
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Raza</label>
                <input value={form.raza ?? ''} placeholder="Ej. Golden Retriever, Siamés..."
                  onChange={(e) => setForm({ ...form, raza: e.target.value })} />
              </div>
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Edad (años)</label>
                <input type="number" min="0" value={form.anios ?? ''}
                  placeholder="Ej. 3"
                  onChange={(e) => setForm({ ...form, anios: e.target.value ? Number(e.target.value) : undefined })} />
              </div>
              <div className="field-portal">
                <label className="font-semibold text-slate-700">Tipo de consulta</label>
                <select data-testid="servicio" value={form.servicio ?? ''}
                  onChange={(e) => setForm({ ...form, servicio: e.target.value })} required>
                  <option value="">-- selecciona --</option>
                  {servicios.map((s) => (
                    <option key={s.nombre} value={s.nombre}>
                      {s.prioritario ? '🚨 ' : ''}{s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn-portal mt-5" type="submit" data-testid="guardar">
              Guardar mascota
            </button>
          </form>
        </div>
      )}

      {/* Error fuera del formulario */}
      {error && !formAbierto && (
        <p className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      {/* Tarjetas de mascotas */}
      {items.length === 0 ? (
        <div className="portal-card text-center py-16">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Aún no tienes mascotas registradas</h3>
          <p className="text-slate-500 text-sm mb-5">Agrega tu primera mascota para comenzar a agendar servicios</p>
          <button className="btn-portal" onClick={() => setFormAbierto(true)}>
            ＋ Registrar mascota
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2" data-testid="lista-mascotas">
          {items.map((m) => {
            const prioritario = esPrioritario(m.servicio);
            return (
              <div
                key={m.id}
                className={`rounded-2xl bg-white p-5 shadow-md border-2 transition-shadow hover:shadow-lg ${
                  prioritario ? 'border-red-300' : 'border-orange-100'
                }`}
              >
                {/* Fila superior: icono + nombre + turno */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${
                      prioritario ? 'bg-red-50' : 'bg-orange-50'
                    }`}>
                      {iconoMascota(m.raza)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{m.nombre}</h3>
                      <p className="text-sm text-slate-500">
                        {[m.raza, m.anios ? `${m.anios} años` : null].filter(Boolean).join(' · ') || 'Sin datos adicionales'}
                      </p>
                    </div>
                  </div>

                  {/* Número de turno */}
                  {m.turno?.codigo && (
                    <div className={`flex flex-col items-center rounded-xl px-3 py-2 ${
                      prioritario ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      <span className="text-xs font-medium opacity-80">Turno</span>
                      <span className="text-xl font-black leading-none">{m.turno.codigo}</span>
                    </div>
                  )}
                </div>

                {/* Badges de estado */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    prioritario
                      ? 'bg-red-100 text-red-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {prioritario ? '🚨 ' : ''}{labelServicio(m.servicio)}
                  </span>

                  {m.turno?.tiempoDeEspera !== undefined && m.turno.tiempoDeEspera > 0 && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      ⏱ ~{m.turno.tiempoDeEspera} min de espera
                    </span>
                  )}

                  {m.turno && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      m.turno.disponibilidad
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {m.turno.disponibilidad ? '⏳ En espera' : '✅ Atendido'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
