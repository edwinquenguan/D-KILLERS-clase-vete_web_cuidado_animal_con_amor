import { FormEvent, useEffect, useState } from 'react';
import { petsApi, ownersApi, speciesApi, breedsApi } from '../api/client';
import type { Pet, CreatePetRequest, UpdatePetRequest, Owner, Species, Breed } from '../api/types';
import DialogConfirmar from '../components/DialogConfirmar';

const SEXOS = [{ value: 'M', label: 'Macho' }, { value: 'F', label: 'Hembra' }];

const vacio: CreatePetRequest = {
  owner_id: 0, species_id: 0, breed_id: 0,
  name: '', birthdate: '', sex: '', color: '', weight: 0,
};

export default function MascotasPage() {
  const [items, setItems] = useState<Pet[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [form, setForm] = useState<CreatePetRequest>(vacio);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmAccion, setConfirmAccion] = useState<'disable' | 'enable'>('disable');

  const cargar = () =>
    petsApi.list().then(setItems).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
    ownersApi.list().then(setOwners).catch(() => {});
    speciesApi.list().then(setSpecies).catch(() => {});
    breedsApi.list().then(setBreeds).catch(() => {});
  }, []);

  // Filtrar razas cuando cambia la especie
  useEffect(() => {
    if (form.species_id) {
      setFilteredBreeds(breeds.filter((b) => b.species_id === form.species_id && b.breed_status === 2));
      setForm((f) => ({ ...f, breed_id: 0 }));
    } else {
      setFilteredBreeds([]);
    }
  }, [form.species_id, breeds]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');
    if (!form.owner_id) { setError('Debes seleccionar un propietario'); return; }
    if (!form.species_id) { setError('Debes seleccionar una especie'); return; }
    if (!form.breed_id) { setError('Debes seleccionar una raza'); return; }
    try {
      if (editId) {
        const upd: UpdatePetRequest = {
          name: form.name, birthdate: form.birthdate, sex: form.sex,
          color: form.color, weight: form.weight, breed_id: form.breed_id,
        };
        await petsApi.update(editId, upd);
        setOk('Mascota actualizada.');
      } else {
        await petsApi.create(form);
        setOk('Mascota registrada.');
      }
      setForm(vacio);
      setEditId(null);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const editar = (p: Pet) => {
    setForm({
      owner_id: p.owner_id, species_id: p.species_id, breed_id: p.breed_id,
      name: p.name, birthdate: p.birthdate, sex: p.sex,
      color: p.color, weight: p.weight,
    });
    setEditId(p.pet_id);
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
        await petsApi.disable(confirmId);
        setOk('Mascota deshabilitada.');
      } else {
        await petsApi.enable(confirmId);
        setOk('Mascota habilitada.');
      }
      cargar();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setConfirmId(null);
    }
  };

  const fechaStr = (iso: string) => {
    try { return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO'); } catch { return iso; }
  };

  return (
    <>
      {confirmId && (
        <DialogConfirmar
          titulo={confirmAccion === 'disable' ? '¿Deshabilitar mascota?' : '¿Habilitar mascota?'}
          mensaje={confirmAccion === 'disable'
            ? 'La mascota quedará inactiva en el sistema.'
            : 'La mascota volverá a estar activa.'}
          onConfirmar={confirmarAccion}
          onCancelar={() => setConfirmId(null)}
        />
      )}

      <div className="card">
        <h2 className="mb-4 text-xl font-semibold" data-testid="titulo-form">
          {editId ? 'Editar mascota' : 'Nueva mascota'}
        </h2>
        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600" data-testid="error">
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
            <label className="field">Nombre de la mascota
              <input data-testid="nombre" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="field">Propietario
              <select data-testid="dueno" value={form.owner_id || ''}
                onChange={(e) => setForm({ ...form, owner_id: Number(e.target.value) })} required>
                <option value="">-- selecciona --</option>
                {owners.filter((o) => o.owner_status === 2).map((o) => (
                  <option key={o.owner_id} value={o.owner_id}>
                    {[o.name, o.first_surname].join(' ')}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">Especie
              <select value={form.species_id || ''}
                onChange={(e) => setForm({ ...form, species_id: Number(e.target.value) })} required>
                <option value="">-- selecciona --</option>
                {species.filter((s) => s.species_status === 2).map((s) => (
                  <option key={s.species_id} value={s.species_id}>{s.species_name}</option>
                ))}
              </select>
            </label>
            <label className="field">Raza
              <select value={form.breed_id || ''}
                onChange={(e) => setForm({ ...form, breed_id: Number(e.target.value) })} required
                disabled={!form.species_id}>
                <option value="">-- selecciona especie primero --</option>
                {filteredBreeds.map((b) => (
                  <option key={b.breed_id} value={b.breed_id}>{b.breed_name}</option>
                ))}
              </select>
            </label>
            <label className="field">Fecha de nacimiento
              <input type="date" value={form.birthdate}
                onChange={(e) => setForm({ ...form, birthdate: e.target.value })} required />
            </label>
            <label className="field">Sexo
              <select value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })} required>
                <option value="">-- selecciona --</option>
                {SEXOS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label className="field">Color
              <input value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })} required
                placeholder="Ej: Negro, Atigrado..." />
            </label>
            <label className="field">Peso (kg)
              <input type="number" min="0" max="999" step="0.1"
                value={form.weight || ''}
                onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} required />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary" type="submit" data-testid="guardar">
              {editId ? 'Actualizar' : 'Registrar mascota'}
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
        <h2 className="mb-4 text-xl font-semibold">Mascotas ({items.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">Nombre</th>
                <th className="p-2">Especie / Raza</th>
                <th className="p-2">Propietario</th>
                <th className="p-2">Nacimiento</th>
                <th className="p-2">Sexo</th>
                <th className="p-2">Peso</th>
                <th className="p-2">Estado</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody data-testid="lista-mascotas">
              {items.map((p) => (
                <tr key={p.pet_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-2 font-medium">{p.name}</td>
                  <td className="p-2">
                    <span className="text-slate-700">{p.species_name}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-slate-500">{p.breed_name}</span>
                  </td>
                  <td className="p-2">{p.owner_name}</td>
                  <td className="p-2">{fechaStr(p.birthdate)}</td>
                  <td className="p-2">{p.sex === 'M' ? 'Macho' : p.sex === 'F' ? 'Hembra' : p.sex}</td>
                  <td className="p-2">{p.weight} kg</td>
                  <td className="p-2">
                    <span className={p.pet_status === 2 ? 'badge-activo' : 'badge-inactivo'}>
                      {p.pet_status === 2 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      <button className="btn-edit" onClick={() => editar(p)}>Editar</button>
                      {p.pet_status === 2 ? (
                        <button className="btn-danger"
                          onClick={() => pedirConfirm(p.pet_id, 'disable')}>
                          Deshabilitar
                        </button>
                      ) : (
                        <button
                          className="rounded px-2 py-1 text-xs font-semibold bg-green-500 text-white hover:bg-green-600"
                          onClick={() => pedirConfirm(p.pet_id, 'enable')}>
                          Habilitar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No hay mascotas registradas
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
