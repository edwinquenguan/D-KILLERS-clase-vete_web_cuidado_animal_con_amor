import { FormEvent, useEffect, useState } from 'react';
import { duenosApi, mascotasApi, serviciosApi } from '../api/client';
import type { Dueno, Mascota, MascotaRequest, Servicio } from '../api/types';
import NuevoDuenoInline from '../components/NuevoDuenoInline';

const vacio: MascotaRequest = {
  nombre: '', raza: '', anios: undefined, servicio: '',
  fechahoraIngreso: '', fechahoraSalida: '', duenoId: undefined,
};

export default function MascotasPage() {
  const [items, setItems] = useState<Mascota[]>([]);
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [form, setForm] = useState<MascotaRequest>(vacio);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mostrarNuevoDueno, setMostrarNuevoDueno] = useState(false);

  const cargar = () => mascotasApi.list().then(setItems).catch((e) => setError(e.message));
  const cargarDuenos = () => duenosApi.list().then(setDuenos).catch(() => {});

  useEffect(() => {
    cargar();
    cargarDuenos();
    serviciosApi.list().then(setServicios).catch(() => {});
  }, []);

  const labelServicio = (nombre?: string) =>
    servicios.find((s) => s.nombre === nombre)?.label ?? nombre ?? '-';

  const limpiar = (req: MascotaRequest): MascotaRequest => ({
    ...req,
    fechahoraIngreso: req.fechahoraIngreso || undefined,
    fechahoraSalida: req.fechahoraSalida || undefined,
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.duenoId) {
      setError('Debes seleccionar un dueño (o crear uno nuevo)');
      return;
    }
    if (!form.servicio) {
      setError('Debes seleccionar un servicio (tipo de consulta)');
      return;
    }
    try {
      const payload = limpiar(form);
      if (editId) await mascotasApi.update(editId, payload);
      else await mascotasApi.create(payload);
      setForm(vacio);
      setEditId(null);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const editar = (m: Mascota) => {
    setForm({
      nombre: m.nombre, raza: m.raza, anios: m.anios, servicio: m.servicio,
      fechahoraIngreso: m.fechahoraIngreso ?? '', fechahoraSalida: m.fechahoraSalida ?? '',
      duenoId: m.dueno?.id, turnoId: m.turno?.id,
    });
    setEditId(m.id ?? null);
  };

  const eliminar = async (id: number) => {
    try {
      await mascotasApi.remove(id);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const onDuenoCreado = (d: Dueno) => {
    setMostrarNuevoDueno(false);
    cargarDuenos();
    setForm((f) => ({ ...f, duenoId: d.id }));
  };

  return (
    <>
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">{editId ? 'Editar mascota' : 'Nueva mascota'}</h2>
        {error && <p className="mb-3 text-sm text-red-600" data-testid="error">{error}</p>}
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="field">Nombre
              <input data-testid="nombre" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </label>
            <label className="field">Raza
              <input value={form.raza ?? ''} onChange={(e) => setForm({ ...form, raza: e.target.value })} />
            </label>
            <label className="field">Años
              <input type="number" value={form.anios ?? ''}
                onChange={(e) => setForm({ ...form, anios: e.target.value ? Number(e.target.value) : undefined })} />
            </label>
            <label className="field">Tipo de consulta (servicio)
              <select data-testid="servicio" value={form.servicio ?? ''}
                onChange={(e) => setForm({ ...form, servicio: e.target.value })} required>
                <option value="">-- selecciona un servicio --</option>
                {servicios.map((s) => (
                  <option key={s.nombre} value={s.nombre}>
                    {s.label}{s.prioritario ? ' (prioritario)' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">Fecha/hora ingreso
              <input type="datetime-local" value={form.fechahoraIngreso ?? ''}
                onChange={(e) => setForm({ ...form, fechahoraIngreso: e.target.value })} />
            </label>
            <label className="field">Fecha/hora salida
              <input type="datetime-local" value={form.fechahoraSalida ?? ''}
                onChange={(e) => setForm({ ...form, fechahoraSalida: e.target.value })} />
            </label>
            <label className="field sm:col-span-2">Dueño
              <div className="flex flex-col gap-2 sm:flex-row">
                <select className="flex-1" data-testid="dueno" value={form.duenoId ?? ''}
                  onChange={(e) => setForm({ ...form, duenoId: e.target.value ? Number(e.target.value) : undefined })}>
                  <option value="">-- selecciona un dueño --</option>
                  {duenos.map((d) => <option key={d.id} value={d.id}>{d.nombre} ({d.documento})</option>)}
                </select>
                <button type="button" className="btn-secondary" data-testid="btn-nuevo-dueno"
                  onClick={() => setMostrarNuevoDueno((v) => !v)}>+ Nuevo dueño</button>
              </div>
            </label>
          </div>

          {mostrarNuevoDueno && (
            <NuevoDuenoInline onCreado={onDuenoCreado} onCancelar={() => setMostrarNuevoDueno(false)} />
          )}

          <p className="mt-3 text-xs text-slate-500">
            El turno se asigna automáticamente al guardar, numerado por servicio y con
            prioridad para las urgencias.
          </p>

          <div className="mt-4 flex gap-2">
            <button className="btn-primary" type="submit" data-testid="guardar">Guardar</button>
            {editId && (
              <button type="button" className="btn-secondary"
                onClick={() => { setForm(vacio); setEditId(null); }}>Cancelar</button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">Mascotas</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">Nombre</th><th className="p-2">Raza</th><th className="p-2">Años</th>
                <th className="p-2">Servicio</th><th className="p-2">Dueño</th><th className="p-2">Turno</th>
                <th className="p-2">Espera</th><th className="p-2"></th>
              </tr>
            </thead>
            <tbody data-testid="lista-mascotas">
              {items.map((m) => (
                <tr key={m.id} className="border-b border-slate-100">
                  <td className="p-2">{m.nombre}</td>
                  <td className="p-2">{m.raza}</td>
                  <td className="p-2">{m.anios}</td>
                  <td className="p-2">{labelServicio(m.servicio)}</td>
                  <td className="p-2">{m.dueno?.nombre ?? '-'}</td>
                  <td className="p-2">
                    {m.turno?.codigo ? (
                      <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                        m.turno.prioritario ? 'bg-red-100 text-red-700' : 'bg-brand/10 text-brand-dark'
                      }`}>{m.turno.codigo}</span>
                    ) : '-'}
                  </td>
                  <td className="p-2">{m.turno?.tiempoDeEspera ?? 0} min</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="btn-edit" onClick={() => editar(m)}>Editar</button>
                      <button className="btn-danger" onClick={() => eliminar(m.id!)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
