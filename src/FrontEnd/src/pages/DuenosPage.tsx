import { FormEvent, useEffect, useState } from 'react';
import { ownersApi } from '../api/client';
import type { Owner, CreateOwnerRequest } from '../api/types';

const vacio: CreateOwnerRequest = {
  name: '', first_surname: '', second_surname: '', phone: '', email: '', address: '',
};

export default function DuenosPage() {
  const [items, setItems] = useState<Owner[]>([]);
  const [form, setForm] = useState<CreateOwnerRequest>(vacio);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const cargar = () =>
    ownersApi.list().then((res) => setItems(res.data)).catch((e) => setError(e.message));

  useEffect(() => { cargar(); }, []);

  const onChange = (campo: keyof CreateOwnerRequest, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) await ownersApi.update(editId, form);
      else await ownersApi.create(form);
      setForm(vacio);
      setEditId(null);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const editar = (d: Owner) => {
    setForm({
      name: d.name,
      first_surname: d.first_surname,
      second_surname: d.second_surname ?? '',
      phone: d.phone ?? '',
      email: d.email ?? '',
      address: d.address ?? '',
    });
    setEditId(d.owner_id);
  };

  const deshabilitar = async (id: number) => {
    try { await ownersApi.disable(id); cargar(); }
    catch (err) { setError((err as Error).message); }
  };

  return (
    <>
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">{editId ? 'Editar propietario' : 'Nuevo propietario'}</h2>
        {error && <p className="mb-3 text-sm text-red-600" data-testid="error">{error}</p>}
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="field">Nombre
              <input data-testid="nombre" value={form.name}
                onChange={(e) => onChange('name', e.target.value)} required />
            </label>
            <label className="field">Primer apellido
              <input data-testid="first_surname" value={form.first_surname}
                onChange={(e) => onChange('first_surname', e.target.value)} required />
            </label>
            <label className="field">Segundo apellido
              <input value={form.second_surname ?? ''}
                onChange={(e) => onChange('second_surname', e.target.value)} />
            </label>
            <label className="field">Teléfono
              <input value={form.phone ?? ''}
                onChange={(e) => onChange('phone', e.target.value)} />
            </label>
            <label className="field">Email
              <input type="email" value={form.email ?? ''}
                onChange={(e) => onChange('email', e.target.value)} />
            </label>
            <label className="field">Dirección
              <input value={form.address ?? ''}
                onChange={(e) => onChange('address', e.target.value)} />
            </label>
          </div>
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
        <h2 className="mb-4 text-xl font-semibold">Propietarios</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">Nombre</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Email</th>
                <th className="p-2">Dirección</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody data-testid="lista-duenos">
              {items.map((d) => (
                <tr key={d.owner_id} className="border-b border-slate-100">
                  <td className="p-2">{d.name} {d.first_surname}</td>
                  <td className="p-2">{d.phone ?? '-'}</td>
                  <td className="p-2">{d.email ?? '-'}</td>
                  <td className="p-2">{d.address ?? '-'}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="btn-edit" onClick={() => editar(d)}>Editar</button>
                      <button className="btn-danger" onClick={() => deshabilitar(d.owner_id)}>Deshabilitar</button>
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
