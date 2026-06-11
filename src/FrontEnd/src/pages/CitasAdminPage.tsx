import { FormEvent, useEffect, useState } from 'react';
import { appointmentsApi, petsApi, usersApi } from '../api/client';
import type { Appointment, CreateAppointmentRequest, Pet, StaffUser } from '../api/types';

const ESTADO: Record<number, string> = {
  1: 'Pendiente',
  2: 'Confirmada',
  3: 'En proceso',
  4: 'Terminada',
  5: 'Cancelada',
};

const ESTADO_BADGE: Record<number, string> = {
  1: 'bg-amber-100 text-amber-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-purple-100 text-purple-700',
  4: 'bg-green-100 text-green-700',
  5: 'bg-slate-200 text-slate-600',
};

const vacio: CreateAppointmentRequest = {
  pet_id: 0, user_id: 0,
  appointment_date: '', appointment_time: '', reason: '',
};

export default function CitasAdminPage() {
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<StaffUser[]>([]);
  const [form, setForm] = useState<CreateAppointmentRequest>(vacio);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const cargar = () =>
    appointmentsApi.list().then(setCitas).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
    petsApi.list().then(setPets).catch(() => {});
    usersApi.list().then(setVets).catch(() => {});
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');
    if (!form.pet_id) { setError('Debes seleccionar una mascota'); return; }
    if (!form.user_id) { setError('Debes seleccionar un veterinario'); return; }
    try {
      await appointmentsApi.create(form);
      setOk('Cita registrada correctamente.');
      setForm(vacio);
      setMostrarForm(false);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const cancelar = async (id: number) => {
    if (!confirm('¿Cancelar esta cita?')) return;
    try {
      await appointmentsApi.cancel(id);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const cambiarEstado = async (id: number, status: number) => {
    try {
      await appointmentsApi.update(id, { status });
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const fechaStr = (iso: string) => {
    try { return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO'); } catch { return iso; }
  };

  return (
    <div className="space-y-6">
      {/* Formulario nueva cita */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Citas agendadas</h2>
          <button className="btn-primary"
            onClick={() => { setMostrarForm(!mostrarForm); setError(''); setOk(''); }}>
            {mostrarForm ? 'Cancelar' : '+ Nueva cita'}
          </button>
        </div>

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
            <span>⚠️</span> {error}
          </div>
        )}
        {ok && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
            <span>✅</span> {ok}
          </div>
        )}

        {mostrarForm && (
          <form onSubmit={submit} className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="field">Mascota
                <select value={form.pet_id || ''}
                  onChange={(e) => setForm({ ...form, pet_id: Number(e.target.value) })} required>
                  <option value="">-- selecciona --</option>
                  {pets.filter((p) => p.pet_status === 2).map((p) => (
                    <option key={p.pet_id} value={p.pet_id}>
                      {p.name} ({p.owner_name})
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">Veterinario responsable
                <select value={form.user_id || ''}
                  onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })} required>
                  <option value="">-- selecciona --</option>
                  {vets.filter((u) => u.rol_name === 'Veterinario').map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.first_surname}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">Fecha
                <input type="date" value={form.appointment_date}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} required />
              </label>
              <label className="field">Hora
                <input type="time" value={form.appointment_time}
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} required />
              </label>
              <label className="field sm:col-span-2">Motivo / Razón
                <input value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })} required
                  placeholder="Ej: Consulta general, Vacunación..." />
              </label>
            </div>
            <div className="mt-4">
              <button className="btn-primary" type="submit">Guardar cita</button>
            </div>
          </form>
        )}

        {/* Tabla de citas */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm" data-testid="lista-citas-admin">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">Mascota</th>
                <th className="p-2">Propietario</th>
                <th className="p-2">Veterinario</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Hora</th>
                <th className="p-2">Motivo</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.appointment_id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 font-medium">{c.pet_name}</td>
                  <td className="p-2">{c.owner_full_name}</td>
                  <td className="p-2">{c.vet_name}</td>
                  <td className="p-2">{fechaStr(c.appointment_date)}</td>
                  <td className="p-2">{c.appointment_time}</td>
                  <td className="p-2 max-w-[150px] truncate" title={c.appointment_reason}>
                    {c.appointment_reason}
                  </td>
                  <td className="p-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${ESTADO_BADGE[c.appointment_status] ?? ''}`}>
                      {ESTADO[c.appointment_status] ?? `Estado ${c.appointment_status}`}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1 flex-wrap">
                      {c.appointment_status === 1 && (
                        <button className="btn-edit text-xs"
                          onClick={() => cambiarEstado(c.appointment_id, 2)}>Confirmar</button>
                      )}
                      {c.appointment_status === 2 && (
                        <button className="btn-edit text-xs"
                          onClick={() => cambiarEstado(c.appointment_id, 3)}>En proceso</button>
                      )}
                      {c.appointment_status === 3 && (
                        <button className="btn-primary text-xs"
                          onClick={() => cambiarEstado(c.appointment_id, 4)}>Terminar</button>
                      )}
                      {(c.appointment_status === 1 || c.appointment_status === 2) && (
                        <button className="btn-danger text-xs"
                          onClick={() => cancelar(c.appointment_id)}>Cancelar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {citas.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    No hay citas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
