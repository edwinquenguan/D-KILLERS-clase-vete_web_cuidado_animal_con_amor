import { useEffect, useState } from 'react';
import { consultationsApi } from '../api/client';
import type { Consultation } from '../api/types';

export default function ConsultasPage() {
  const [items, setItems] = useState<Consultation[]>([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    consultationsApi.list()
      .then((res) => setItems(res.data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold">Consultas médicas</h2>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {cargando && <p className="text-sm text-slate-500">Cargando...</p>}

      {!cargando && items.length === 0 && !error && (
        <p className="text-sm text-slate-500">No hay consultas registradas.</p>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">Fecha</th>
                <th className="p-2">Mascota</th>
                <th className="p-2">Especie / Raza</th>
                <th className="p-2">Propietario</th>
                <th className="p-2">Veterinario</th>
                <th className="p-2">Diagnóstico</th>
                <th className="p-2">Peso</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.consultation_id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 whitespace-nowrap">{c.consultation_date}</td>
                  <td className="p-2 font-medium">{c.pet_name}</td>
                  <td className="p-2 text-slate-500">{c.species_name} / {c.breed_name}</td>
                  <td className="p-2">{c.owner_full_name}</td>
                  <td className="p-2">{c.vet_name}</td>
                  <td className="p-2 max-w-xs truncate" title={c.consultation_diagnosis}>
                    {c.consultation_diagnosis}
                  </td>
                  <td className="p-2">{c.consultation_weight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
