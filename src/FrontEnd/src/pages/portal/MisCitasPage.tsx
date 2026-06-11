import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentsApi } from '../../api/client';
import type { Appointment } from '../../api/types';

const ESTADO: Record<number, string> = {
  1: 'Pendiente', 2: 'Confirmada', 3: 'En proceso', 4: 'Terminada', 5: 'Cancelada',
};

const ESTADO_BADGE: Record<number, string> = {
  1: 'bg-amber-100 text-amber-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-purple-100 text-purple-700',
  4: 'bg-green-100 text-green-700',
  5: 'bg-slate-100 text-slate-500',
};

export default function MisCitasPage() {
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    appointmentsApi.myAppointments()
      .then(setCitas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const fechaStr = (iso: string) => {
    try { return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', { dateStyle: 'medium' }); }
    catch { return iso; }
  };

  if (cargando) {
    return <p className="py-10 text-center text-slate-400">Cargando tus citas…</p>;
  }

  return (
    <div className="card">
      <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mis citas</h2>
          <p className="text-sm text-slate-400">
            Historial de citas asociadas a tu correo electrónico
          </p>
        </div>
        <Link to="/portal/solicitar-cita"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-bold text-white shadow hover:bg-brand-dark transition-colors whitespace-nowrap">
          + Solicitar cita
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          ⚠️ {error} — Asegúrate de que tu correo esté registrado como propietario en el sistema.
        </div>
      )}

      {citas.length === 0 && !error ? (
        <div className="py-14 text-center">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-slate-500 font-medium">No tienes citas registradas</p>
          <p className="text-slate-400 text-sm mt-1">
            Cuando el personal agende una cita para tu mascota, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-brand-light text-left">
                <th className="p-3 text-brand-dark text-xs font-bold uppercase">Mascota</th>
                <th className="p-3 text-brand-dark text-xs font-bold uppercase">Fecha</th>
                <th className="p-3 text-brand-dark text-xs font-bold uppercase">Hora</th>
                <th className="p-3 text-brand-dark text-xs font-bold uppercase">Motivo</th>
                <th className="p-3 text-brand-dark text-xs font-bold uppercase">Veterinario</th>
                <th className="p-3 text-brand-dark text-xs font-bold uppercase">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.appointment_id} className="border-b border-slate-100 hover:bg-brand-light/30 transition-colors">
                  <td className="p-3 font-semibold">{c.pet_name}
                    <span className="ml-1 text-slate-400 font-normal text-xs">({c.species_name})</span>
                  </td>
                  <td className="p-3">{fechaStr(c.appointment_date)}</td>
                  <td className="p-3">{c.appointment_time}</td>
                  <td className="p-3 max-w-[160px] truncate" title={c.appointment_reason}>
                    {c.appointment_reason}
                  </td>
                  <td className="p-3">{c.vet_name ?? <span className="text-slate-400 text-xs italic">Por asignar</span>}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ESTADO_BADGE[c.appointment_status] ?? ''}`}>
                      {ESTADO[c.appointment_status] ?? `Estado ${c.appointment_status}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
