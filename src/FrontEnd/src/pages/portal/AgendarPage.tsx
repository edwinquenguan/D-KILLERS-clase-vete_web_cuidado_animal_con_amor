import { FormEvent, useEffect, useState } from 'react';
import { portalApi, serviciosApi } from '../../api/client';
import type { Cita, CitaRequest, EstadoCita, Mascota, Servicio } from '../../api/types';

const iconosServicio: Record<string, string> = {
  BANO: '🛁',
  CORTE_UNAS: '✂️',
  CONSULTA_MEDICA: '💊',
  URGENCIA_MEDICA: '🚨',
  PROFILAXIS: '🦷',
  VACUNACION: '💉',
  DESPARASITACION: '🔬',
  CIRUGIA: '🏥',
  HOSPITALIZACION: '🛏️',
  LABORATORIO: '🧪',
  IMAGENOLOGIA: '📷',
  PREVENTIVOS: '🛡️',
};

const badgeCita: Record<EstadoCita, string> = {
  SOLICITADA: 'bg-amber-100 text-amber-700 border border-amber-200',
  EN_PROCESO: 'bg-blue-100 text-blue-700 border border-blue-200',
  TERMINADA: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  CANCELADA: 'bg-slate-100 text-slate-500 border border-slate-200',
};

const labelEstado: Record<EstadoCita, string> = {
  SOLICITADA: '⏳ Solicitada',
  EN_PROCESO: '🔄 En proceso',
  TERMINADA: '✅ Terminada',
  CANCELADA: '✕ Cancelada',
};

export default function AgendarPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [form, setForm] = useState<CitaRequest>({ mascotaId: 0, servicio: '', fechaHoraProgramada: '' });
  const [error, setError] = useState('');

  const cargarCitas = () => portalApi.misCitas().then(setCitas).catch((e) => setError(e.message));

  useEffect(() => {
    portalApi.misMascotas().then(setMascotas).catch(() => {});
    serviciosApi.list().then(setServicios).catch(() => {});
    cargarCitas();
  }, []);

  const labelServicio = (n?: string) => servicios.find((s) => s.nombre === n)?.label ?? n ?? '-';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.mascotaId) { setError('Selecciona una mascota'); return; }
    if (!form.servicio) { setError('Selecciona un servicio'); return; }
    try {
      await portalApi.agendar({
        ...form,
        fechaHoraProgramada: form.fechaHoraProgramada || undefined,
      });
      setForm({ mascotaId: 0, servicio: '', fechaHoraProgramada: '' });
      cargarCitas();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const cancelar = async (id: number) => {
    try { await portalApi.cancelar(id); cargarCitas(); }
    catch (err) { setError((err as Error).message); }
  };

  return (
    <>
      {/* Formulario de agendamiento */}
      <div className="portal-card">
        <h2 className="mb-1 text-2xl font-extrabold text-slate-800">📅 Agendar un servicio</h2>
        <p className="mb-5 text-sm text-slate-500">Elige a tu mascota y el servicio que necesita</p>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600" data-testid="error">
            {error}
          </p>
        )}

        {mascotas.length === 0 ? (
          <div className="rounded-2xl bg-orange-50 border border-orange-200 p-6 text-center">
            <div className="text-4xl mb-3">🐾</div>
            <p className="text-slate-600 font-medium">Primero registra una mascota en "Mis mascotas".</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            {/* Selección de mascota */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">¿Para cuál mascota?</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {mascotas.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    data-testid="mascota"
                    onClick={() => setForm({ ...form, mascotaId: m.id! })}
                    className={`rounded-2xl border-2 p-3 text-center transition-all ${
                      form.mascotaId === m.id
                        ? 'border-orange-400 bg-orange-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-orange-200'
                    }`}
                  >
                    <div className="text-3xl mb-1">🐾</div>
                    <div className="text-sm font-semibold text-slate-800">{m.nombre}</div>
                    <div className="text-xs text-slate-500">{m.raza ?? 'Mascota'}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de servicio */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">Tipo de servicio</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {servicios.map((s) => (
                  <button
                    key={s.nombre}
                    type="button"
                    data-testid="servicio"
                    onClick={() => setForm({ ...form, servicio: s.nombre })}
                    className={`rounded-2xl border-2 p-3 text-center transition-all ${
                      form.servicio === s.nombre
                        ? s.prioritario
                          ? 'border-red-400 bg-red-50 shadow-md'
                          : 'border-orange-400 bg-orange-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-orange-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{iconosServicio[s.nombre] ?? '🐾'}</div>
                    <div className={`text-xs font-semibold leading-tight ${
                      s.prioritario ? 'text-red-700' : 'text-slate-700'
                    }`}>
                      {s.label}
                    </div>
                    {s.prioritario && (
                      <div className="mt-1 rounded-full bg-red-100 px-1 py-0.5 text-[10px] font-bold text-red-600">
                        PRIORITARIO
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Fecha deseada */}
            <div className="field-portal mb-5">
              <label className="font-bold text-slate-700">
                Fecha y hora deseada{' '}
                <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                type="datetime-local"
                value={form.fechaHoraProgramada ?? ''}
                onChange={(e) => setForm({ ...form, fechaHoraProgramada: e.target.value })}
              />
            </div>

            <button className="btn-portal" type="submit" data-testid="agendar">
              Confirmar agendamiento
            </button>
          </form>
        )}
      </div>

      {/* Mis citas */}
      <div className="portal-card">
        <h2 className="mb-4 text-xl font-bold text-slate-800">📋 Mis citas</h2>
        {citas.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-slate-500">Aún no tienes citas agendadas.</p>
          </div>
        ) : (
          <div className="space-y-3" data-testid="lista-citas">
            {citas.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                      {iconosServicio[c.servicio ?? ''] ?? '🐾'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{c.mascota?.nombre}</div>
                      <div className="text-sm text-slate-500">{labelServicio(c.servicio)}</div>
                      {c.fechaHoraProgramada && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          📅 {new Date(c.fechaHoraProgramada).toLocaleString('es-CO')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeCita[c.estado]}`}>
                      {labelEstado[c.estado]}
                    </span>
                    {(c.estado === 'SOLICITADA' || c.estado === 'EN_PROCESO') && (
                      <button
                        className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
                        onClick={() => cancelar(c.id!)}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
