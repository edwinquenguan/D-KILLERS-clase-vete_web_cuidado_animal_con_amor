import { useState } from 'react';
import { ownersApi } from '../api/client';
import type { Owner, CreateOwnerRequest } from '../api/types';

interface Props {
  onCreado: (owner: Owner) => void;
  onCancelar: () => void;
}

const vacio: CreateOwnerRequest = { name: '', first_surname: '', phone: '', email: '', address: '' };

export default function NuevoDuenoInline({ onCreado, onCancelar }: Props) {
  const [form, setForm] = useState<CreateOwnerRequest>(vacio);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const set = (campo: keyof CreateOwnerRequest, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const guardar = async () => {
    if (!form.name || !form.first_surname) {
      setError('Nombre y primer apellido son obligatorios');
      return;
    }
    setError('');
    setGuardando(true);
    try {
      const res = await ownersApi.create(form);
      onCreado(res.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mt-3 rounded-md border border-brand/40 bg-brand/5 p-4">
      <h3 className="mb-3 font-semibold text-brand-dark">Nuevo propietario</h3>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="field">Nombre
          <input data-testid="nuevo-dueno-nombre" value={form.name}
            onChange={(e) => set('name', e.target.value)} />
        </label>
        <label className="field">Primer apellido
          <input value={form.first_surname ?? ''}
            onChange={(e) => set('first_surname', e.target.value)} />
        </label>
        <label className="field">Teléfono
          <input value={form.phone ?? ''}
            onChange={(e) => set('phone', e.target.value)} />
        </label>
        <label className="field">Email
          <input type="email" value={form.email ?? ''}
            onChange={(e) => set('email', e.target.value)} />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-primary" data-testid="guardar-nuevo-dueno"
          onClick={guardar} disabled={guardando}>Guardar propietario</button>
        <button type="button" className="btn-secondary" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}
