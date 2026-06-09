import { useEffect, useState } from 'react';
import { turnosApi } from '../api/client';
import type { Turno } from '../api/types';

export default function TurnosPage() {
  const [items, setItems] = useState<Turno[]>([]);
  const [error, setError] = useState('');

  const cargar = () => turnosApi.list().then(setItems).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id: number) => {
    await turnosApi.remove(id);
    cargar();
  };

  return (
    <div className="card">
      <h2 className="mb-2 text-xl font-semibold">Turnos</h2>
      <p className="mb-4 text-sm text-slate-500">
        Los turnos se generan automáticamente al registrar mascotas. Aquí puedes ver la cola.
      </p>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2">Turno</th><th className="p-2">Franja</th>
              <th className="p-2">Espera</th><th className="p-2">Estado</th><th className="p-2"></th>
            </tr>
          </thead>
          <tbody data-testid="lista-turnos">
            {items.map((t) => (
              <tr key={t.id} className="border-b border-slate-100">
                <td className="p-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                    t.prioritario ? 'bg-red-100 text-red-700' : 'bg-brand/10 text-brand-dark'
                  }`}>{t.codigo ?? `#${t.consecutivo ?? t.id}`}</span>
                </td>
                <td className="p-2">{t.turno}</td>
                <td className="p-2">{t.tiempoDeEspera ?? 0} min</td>
                <td className="p-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${
                    t.disponibilidad ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {t.disponibilidad ? 'En cola' : 'Atendido'}
                  </span>
                </td>
                <td className="p-2">
                  <button className="btn-danger" onClick={() => eliminar(t.id!)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
