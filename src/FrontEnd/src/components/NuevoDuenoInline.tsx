import { useState } from 'react';
import { duenosApi } from '../api/client';
import type { Dueno } from '../api/types';

interface Props {
  onCreado: (dueno: Dueno) => void;
  onCancelar: () => void;
}

const vacio: Dueno = { nombre: '', documento: '', tipoDocumento: 'CC', contacto: '', direccion: '' };

/** Mini-formulario para dar de alta un dueño sin salir de la página de mascotas. */
export default function NuevoDuenoInline({ onCreado, onCancelar }: Props) {
  const [form, setForm] = useState<Dueno>(vacio);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const set = (campo: keyof Dueno, valor: string) => setForm((f) => ({ ...f, [campo]: valor }));

  const guardar = async () => {
    if (!form.nombre || !form.documento) {
      setError('Nombre y documento son obligatorios');
      return;
    }
    setError('');
    setGuardando(true);
    try {
      const creado = await duenosApi.create(form);
      onCreado(creado);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mt-3 rounded-md border border-brand/40 bg-brand/5 p-4">
      <h3 className="mb-3 font-semibold text-brand-dark">Nuevo dueño</h3>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="field">Nombre
          <input data-testid="nuevo-dueno-nombre" value={form.nombre}
            onChange={(e) => set('nombre', e.target.value)} />
        </label>
        <label className="field">Documento
          <input data-testid="nuevo-dueno-documento" value={form.documento}
            onChange={(e) => set('documento', e.target.value)} />
        </label>
        <label className="field">Tipo documento
          <select value={form.tipoDocumento ?? 'CC'} onChange={(e) => set('tipoDocumento', e.target.value)}>
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="TI">TI</option>
            <option value="NIT">NIT</option>
          </select>
        </label>
        <label className="field">Contacto
          <input value={form.contacto ?? ''} onChange={(e) => set('contacto', e.target.value)} />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-primary" data-testid="guardar-nuevo-dueno"
          onClick={guardar} disabled={guardando}>Guardar dueño</button>
        <button type="button" className="btn-secondary" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}
