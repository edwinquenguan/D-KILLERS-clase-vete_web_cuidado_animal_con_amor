import { FormEvent, useEffect, useState } from 'react';
import { ownersApi, citiesApi } from '../api/client';
import type { Owner, CreateOwnerRequest, UpdateOwnerRequest, City } from '../api/types';
import DialogConfirmar from '../components/DialogConfirmar';

const vacio: CreateOwnerRequest = {
  name: '', first_surname: '', second_surname: '',
  phone: '', email: '', address: '', city: 0,
};

export default function DuenosPage() {
  const [items, setItems] = useState<Owner[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState<CreateOwnerRequest>(vacio);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmAccion, setConfirmAccion] = useState<'disable' | 'enable'>('disable');

  const cargar = () =>
    ownersApi.list().then(setItems).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
    citiesApi.list().then(setCities).catch(() => {});
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');
    if (!form.city) { setError('Debes seleccionar una ciudad'); return; }
    try {
      if (editId) {
        const upd: UpdateOwnerRequest = {
          name: form.name, first_surname: form.first_surname,
          second_surname: form.second_surname, phone: form.phone,
          email: form.email, address: form.address, city: form.city,
        };
        await ownersApi.update(editId, upd);
        setOk('Propietario actualizado.');
      } else {
        await ownersApi.create(form);
        setOk('Propietario registrado.');
      }
      setForm(vacio);
      setEditId(null);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const editar = (o: Owner) => {
    setForm({
      name: o.name, first_surname: o.first_surname,
      second_surname: o.second_surname, phone: o.phone,
      email: o.email, address: o.address, city: o.city_id,
    });
    setEditId(o.owner_id);
    setError('');
    setOk('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pedirConfirm = (id: number, accion: 'disable' | 'enable') => {
    setConfirmId(id);
    setConfirmAccion(accion);
  };

  const confirmarAccion = async () => {
    if (!confirmId) return;
    try {
      if (confirmAccion === 'disable') {
        await ownersApi.disable(confirmId);
        setOk('Propietario deshabilitado.');
      } else {
        await ownersApi.enable(confirmId);
        setOk('Propietario habilitado.');
      }
      cargar();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setConfirmId(null);
    }
  };

  const nombreCompleto = (o: Owner) =>
    [o.name, o.first_surname, o.second_surname].filter(Boolean).join(' ');

  return (
    <>
      {confirmId && (
        <DialogConfirmar
          titulo={confirmAccion === 'disable' ? '¿Deshabilitar propietario?' : '¿Habilitar propietario?'}
          mensaje={confirmAccion === 'disable'
            ? 'El propietario quedará inactivo en el sistema.'
            : 'El propietario volverá a estar activo.'}
          onConfirmar={confirmarAccion}
          onCancelar={() => setConfirmId(null)}
        />
      )}

      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">
          {editId ? 'Editar propietario' : 'Nuevo propietario'}
        </h2>
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
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="field">Nombre
              <input value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="field">Primer apellido
              <input value={form.first_surname}
                onChange={(e) => setForm({ ...form, first_surname: e.target.value })} required />
            </label>
            <label className="field">Segundo apellido
              <input value={form.second_surname}
                onChange={(e) => setForm({ ...form, second_surname: e.target.value })} />
            </label>
            <label className="field">Teléfono
              <input type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </label>
            <label className="field">Correo electrónico
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label className="field">Ciudad
              <select value={form.city || ''}
                onChange={(e) => setForm({ ...form, city: Number(e.target.value) })} required>
                <option value="">-- selecciona --</option>
                {cities.map((c) => (
                  <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                ))}
              </select>
            </label>
            <label className="field sm:col-span-2">Dirección
              <input value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary" type="submit">
              {editId ? 'Actualizar' : 'Registrar propietario'}
            </button>
            {editId && (
              <button type="button" className="btn-secondary"
                onClick={() => { setForm(vacio); setEditId(null); setError(''); setOk(''); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">Propietarios ({items.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">Nombre completo</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Email</th>
                <th className="p-2">Ciudad</th>
                <th className="p-2">Estado</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody data-testid="lista-duenos">
              {items.map((o) => (
                <tr key={o.owner_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-2 font-medium">{nombreCompleto(o)}</td>
                  <td className="p-2">{o.phone}</td>
                  <td className="p-2 text-slate-500">{o.email}</td>
                  <td className="p-2">{o.city_name}</td>
                  <td className="p-2">
                    <span className={o.owner_status === 2 ? 'badge-activo' : 'badge-inactivo'}>
                      {o.owner_status === 2 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      <button className="btn-edit" onClick={() => editar(o)}>Editar</button>
                      {o.owner_status === 2 ? (
                        <button className="btn-danger"
                          onClick={() => pedirConfirm(o.owner_id, 'disable')}>
                          Deshabilitar
                        </button>
                      ) : (
                        <button
                          className="rounded px-2 py-1 text-xs font-semibold bg-green-500 text-white hover:bg-green-600"
                          onClick={() => pedirConfirm(o.owner_id, 'enable')}>
                          Habilitar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No hay propietarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
