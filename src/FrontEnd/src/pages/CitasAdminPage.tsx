import { useEffect, useState } from 'react';
import { citasAdminApi, serviciosApi } from '../api/client';
import type { Cita, EstadoCita, Servicio } from '../api/types';

const badge: Record<EstadoCita, string> = {
  SOLICITADA: 'bg-amber-100 text-amber-700',
  EN_PROCESO: 'bg-blue-100 text-blue-700',
  TERMINADA: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-slate-200 text-slate-600',
};

export default function CitasAdminPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [error, setError] = useState('');

  const cargar = () => citasAdminApi.list().then(setCitas).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
    serviciosApi.list().then(setServicios).catch(() => {});
  }, []);

  const labelServicio = (n?: string) => servicios.find((s) => s.nombre === n)?.label ?? n ?? '-';

  const cambiar = async (id: number, estado: string) => {
    try { await citasAdminApi.cambiarEstado(id, estado); cargar(); }
    catch (err) { setError((err as Error).message); }
  };

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold">Citas agendadas</h2>
      <p className="mb-4 text-sm text-slate-500">
        Avanza el estado de las citas. Al marcar <b>TERMINADA</b>, el cliente recibe el aviso en su campana.
      </p>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2">Mascota</th><th className="p-2">Dueño</th><th className="p-2">Servicio</th>
              <th className="p-2">Programada</th><th className="p-2">Estado</th><th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody data-testid="lista-citas-admin">
            {citas.map((c) => (
              <tr key={c.id} className="border-b border-slate-100">
                <td className="p-2">{c.mascota?.nombre}</td>
                <td className="p-2">{c.mascota?.dueno?.nombre ?? '-'}</td>
                <td className="p-2">{labelServicio(c.servicio)}</td>
                <td className="p-2">{c.fechaHoraProgramada ? new Date(c.fechaHoraProgramada).toLocaleString() : '-'}</td>
                <td className="p-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-bold ${badge[c.estado]}`}>{c.estado}</span>
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    {c.estado === 'SOLICITADA' && (
                      <button className="btn-edit text-xs" onClick={() => cambiar(c.id!, 'EN_PROCESO')}>Iniciar</button>
                    )}
                    {(c.estado === 'SOLICITADA' || c.estado === 'EN_PROCESO') && (
                      <button className="btn-primary text-xs" data-testid={`terminar-${c.id}`}
                        onClick={() => cambiar(c.id!, 'TERMINADA')}>Terminar</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
