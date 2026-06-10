import { useEffect, useState } from 'react';
import { appointmentsApi } from '../api/client';
import type { Appointment, AppointmentStatus } from '../api/types';

const statusLabel: Record<AppointmentStatus, string> = {
  1: 'Cancelada',
  2: 'Pendiente',
  3: 'Atendida',
};

const badge: Record<AppointmentStatus, string> = {
  1: 'bg-slate-200 text-slate-600',
  2: 'bg-amber-100 text-amber-700',
  3: 'bg-green-100 text-green-700',
};

export default function CitasAdminPage() {
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

  const cargar = () =>
    appointmentsApi.list().then((res) => setCitas(res.data)).catch((e) => setError(e.message));

  useEffect(() => { cargar(); }, []);

  const cancelar = async (id: number) => {
    try { await appointmentsApi.cancel(id); cargar(); }
    catch (err) { setError((err as Error).message); }
  };

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold">Citas agendadas</h2>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2">Mascota</th>
              <th className="p-2">Veterinario</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Motivo</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody data-testid="lista-citas-admin">
            {citas.map((c) => (
              <tr key={c.appointment_id} className="border-b border-slate-100">
                <td className="p-2">{c.pet_name ?? '-'}</td>
                <td className="p-2">{c.vet_name ?? '-'}</td>
                <td className="p-2">{new Date(c.appointment_date).toLocaleString()}</td>
                <td className="p-2">{c.appointment_reason ?? '-'}</td>
                <td className="p-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-bold ${badge[c.appointment_status]}`}>
                    {statusLabel[c.appointment_status]}
                  </span>
                </td>
                <td className="p-2">
                  {c.appointment_status === 2 && (
                    <button className="btn-danger text-xs"
                      onClick={() => cancelar(c.appointment_id)}>Cancelar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
