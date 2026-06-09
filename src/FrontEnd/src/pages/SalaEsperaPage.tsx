import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { filaApi } from '../api/client';
import type { FilaItem } from '../api/types';

const REFRESH_MS = 5000;

export default function SalaEsperaPage() {
  const [fila, setFila] = useState<FilaItem[]>([]);
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const cargar = () => filaApi.list().then(setFila).catch(() => {});
    cargar();
    const t = setInterval(() => {
      cargar();
      setHora(new Date());
    }, REFRESH_MS);
    return () => clearInterval(t);
  }, []);

  const enAtencion = fila[0];
  const siguientes = fila.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-dark to-slate-900 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
            <h1 className="text-2xl font-extrabold tracking-wide sm:text-3xl">🐾 Cuidado Animal con Amor</h1>
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
        {/* Turno en atención */}
        <section className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-widest text-white/60">Atendiendo ahora</p>
          {enAtencion ? (
            <div className={`rounded-2xl p-8 shadow-2xl ${
              enAtencion.prioritario ? 'bg-red-600' : 'bg-white text-slate-900'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-6xl font-black sm:text-7xl">{enAtencion.codigoTurno}</div>
                  <div className="mt-2 text-xl font-semibold">{enAtencion.servicio}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{enAtencion.mascota}</div>
                  <div className="opacity-70">{enAtencion.dueno}</div>
                  {enAtencion.prioritario && (
                    <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
                      ⚠ URGENCIA
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/10 p-10 text-center text-xl text-white/70">
              No hay pacientes en espera 🎉
            </div>
          )}
        </section>

        {/* Siguientes en la fila */}
        <section>
          <p className="mb-3 text-sm uppercase tracking-widest text-white/60">
            En cola ({siguientes.length})
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siguientes.map((f) => (
              <div key={f.codigoTurno}
                className={`rounded-xl border p-4 backdrop-blur ${
                  f.prioritario ? 'border-red-400 bg-red-500/20' : 'border-white/15 bg-white/5'
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black">{f.codigoTurno}</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">#{f.posicion}</span>
                </div>
                <div className="mt-2 font-semibold">{f.servicio}</div>
                <div className="text-sm text-white/70">{f.mascota} · {f.dueno}</div>
                <div className="mt-1 text-sm text-white/60">⏱ ~{f.tiempoEstimado} min</div>
                {f.prioritario && (
                  <span className="mt-2 inline-block rounded bg-red-500 px-2 py-0.5 text-xs font-bold">
                    URGENCIA
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
