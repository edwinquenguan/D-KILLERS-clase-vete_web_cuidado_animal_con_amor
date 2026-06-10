import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentsApi } from '../api/client';
import type { Appointment } from '../api/types';

const REFRESH_MS = 5000;

export default function SalaEsperaPage() {
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const cargar = () =>
      appointmentsApi.list({ status: 1 })
        .then((res) => setCitas(res.data))
        .catch(() => {});

    cargar();
    const t = setInterval(() => {
      cargar();
      setHora(new Date());
    }, REFRESH_MS);
    return () => clearInterval(t);
  }, []);

  const enAtencion = citas[0];
  const siguientes = citas.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-dark to-slate-900 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide sm:text-3xl">Cuidado Animal con Amor</h1>
          <p className="text-xs text-white/50 mt-0.5 tracking-widest uppercase">Sala de espera</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold sm:text-3xl">
            {hora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <Link to="/mascotas" className="text-xs text-white/60 hover:text-white">Ir al panel admin →</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-10">
        <section className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-widest text-white/60">Atendiendo ahora</p>
          {enAtencion ? (
            <div className="rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-6xl font-black sm:text-7xl">
                    {enAtencion.appointment_time?.slice(0, 5)}
                  </div>
                  <div className="mt-2 text-xl font-semibold">{enAtencion.appointment_reason}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{enAtencion.pet_name}</div>
                  <div className="text-slate-500">{enAtencion.owner_full_name}</div>
                  <div className="text-sm text-slate-400 mt-1">Vet: {enAtencion.vet_name}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/10 p-10 text-center text-xl text-white/70">
              No hay pacientes en espera
            </div>
          )}
        </section>

        <section>
          <p className="mb-3 text-sm uppercase tracking-widest text-white/60">
            En cola ({siguientes.length})
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siguientes.map((c, i) => (
              <div
                key={c.appointment_id}
                className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black">{c.appointment_time?.slice(0, 5)}</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">#{i + 2}</span>
                </div>
                <div className="mt-2 font-semibold">{c.appointment_reason}</div>
                <div className="text-sm text-white/70">{c.pet_name} · {c.owner_full_name}</div>
                <div className="mt-1 text-sm text-white/60">Vet: {c.vet_name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
