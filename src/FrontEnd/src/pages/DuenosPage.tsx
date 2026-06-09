import { FormEvent, useEffect, useState } from 'react';
import { duenosApi } from '../api/client';
import type { Dueno } from '../api/types';

const vacio: Dueno = { nombre: '', documento: '', tipoDocumento: 'CC', contacto: '', direccion: '' };

export default function DuenosPage() {
  const [items, setItems] = useState<Dueno[]>([]);
  const [form, setForm] = useState<Dueno>(vacio);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const cargar = () => duenosApi.list().then(setItems).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
  }, []);

  const onChange = (campo: keyof Dueno, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) await duenosApi.update(editId, form);
      else await duenosApi.create(form);
      setForm(vacio);
      setEditId(null);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const editar = (d: Dueno) => {
    setForm(d);
    setEditId(d.id ?? null);
  };

  const eliminar = async (id: number) => {
    await duenosApi.remove(id);
    cargar();
  };

  return (
    <>
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">{editId ? 'Editar dueño' : 'Nuevo dueño'}</h2>
        {error && <p className="mb-3 text-sm text-red-600" data-testid="error">{error}</p>}
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="field">Nombre
              <input data-testid="nombre" value={form.nombre}
                onChange={(e) => onChange('nombre', e.target.value)} required />
            </label>
            <label className="field">Contacto
              <input value={form.contacto ?? ''} onChange={(e) => onChange('contacto', e.target.value)} />
            </label>
            <label className="field">Dirección
              <input value={form.direccion ?? ''} onChange={(e) => onChange('direccion', e.target.value)} />
            </label>
            <label className="field">Tipo documento
              <select value={form.tipoDocumento ?? 'CC'} onChange={(e) => onChange('tipoDocumento', e.target.value)}>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="TI">TI</option>
                <option value="NIT">NIT</option>
              </select>
            </label>
            <label className="field">Documento
              <input data-testid="documento" value={form.documento}
                onChange={(e) => onChange('documento', e.target.value)} required />
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
        <h2 className="mb-4 text-xl font-semibold">Dueños</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">Nombre</th><th className="p-2">Documento</th>
                <th className="p-2">Contacto</th><th className="p-2">Dirección</th><th className="p-2"></th>
              </tr>
            </thead>
            <tbody data-testid="lista-duenos">
              {items.map((d) => (
                <tr key={d.id} className="border-b border-slate-100">
                  <td className="p-2">{d.nombre}</td>
                  <td className="p-2">{d.tipoDocumento} {d.documento}</td>
                  <td className="p-2">{d.contacto}</td>
                  <td className="p-2">{d.direccion}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="btn-edit" onClick={() => editar(d)}>Editar</button>
                      <button className="btn-danger" onClick={() => eliminar(d.id!)}>Eliminar</button>
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
