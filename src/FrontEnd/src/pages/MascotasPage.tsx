import { FormEvent, useEffect, useState } from 'react';
import { petsApi, ownersApi, speciesApi, breedsApi } from '../api/client';
import type { Pet, CreatePetRequest, Owner, Species, Breed } from '../api/types';

const vacio: CreatePetRequest = {
  owner_id: 0, species_id: 0, breed_id: 0, name: '',
  birthdate: '', sex: '', color: '', weight: undefined,
};

export default function MascotasPage() {
  const [items, setItems] = useState<Pet[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [form, setForm] = useState<CreatePetRequest>(vacio);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const cargar = () =>
    petsApi.list().then((res) => setItems(res.data)).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
    ownersApi.list().then((res) => setOwners(res.data)).catch(() => {});
    speciesApi.list().then((res) => setSpecies(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.species_id) {
      breedsApi.list(form.species_id).then((res) => setBreeds(res.data)).catch(() => {});
    } else {
      setBreeds([]);
    }
  }, [form.species_id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.owner_id) { setError('Debes seleccionar un propietario'); return; }
    if (!form.species_id) { setError('Debes seleccionar una especie'); return; }
    if (!form.breed_id) { setError('Debes seleccionar una raza'); return; }
    try {
      if (editId) await petsApi.update(editId, form);
      else await petsApi.create(form);
      setForm(vacio);
      setEditId(null);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const editar = (p: Pet) => {
    setForm({
      owner_id: p.owner_id,
      species_id: p.species_id,
      breed_id: p.breed_id,
      name: p.name,
      birthdate: p.birthdate ?? '',
      sex: p.sex ?? '',
      color: p.color ?? '',
      weight: p.weight,
    });
    setEditId(p.pet_id);
  };

  const deshabilitar = async (id: number) => {
    try { await petsApi.disable(id); cargar(); }
    catch (err) { setError((err as Error).message); }
  };

  return (
    <>
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">{editId ? 'Editar mascota' : 'Nueva mascota'}</h2>
        {error && <p className="mb-3 text-sm text-red-600" data-testid="error">{error}</p>}
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="field">Nombre
              <input data-testid="nombre" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="field">Propietario
              <select data-testid="owner" value={form.owner_id || ''}
                onChange={(e) => setForm({ ...form, owner_id: Number(e.target.value) })} required>
                <option value="">-- selecciona --</option>
                {owners.map((o) => (
                  <option key={o.owner_id} value={o.owner_id}>{o.name} {o.first_surname}</option>
                ))}
              </select>
            </label>
            <label className="field">Especie
              <select value={form.species_id || ''}
                onChange={(e) => setForm({ ...form, species_id: Number(e.target.value), breed_id: 0 })} required>
                <option value="">-- selecciona --</option>
                {species.map((s) => (
                  <option key={s.species_id} value={s.species_id}>{s.species_name}</option>
                ))}
              </select>
            </label>
            <label className="field">Raza
              <select value={form.breed_id || ''}
                onChange={(e) => setForm({ ...form, breed_id: Number(e.target.value) })} required>
                <option value="">-- selecciona --</option>
                {breeds.map((b) => (
                  <option key={b.breed_id} value={b.breed_id}>{b.breed_name}</option>
                ))}
              </select>
            </label>
            <label className="field">Fecha de nacimiento
              <input type="date" value={form.birthdate ?? ''}
                onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
            </label>
            <label className="field">Sexo
              <select value={form.sex ?? ''}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}>
                <option value="">-- selecciona --</option>
                <option value="M">Macho</option>
                <option value="F">Hembra</option>
              </select>
            </label>
            <label className="field">Color
              <input value={form.color ?? ''}
                onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </label>
            <label className="field">Peso (kg)
              <input type="number" step="0.1" value={form.weight ?? ''}
                onChange={(e) => setForm({ ...form, weight: e.target.value ? Number(e.target.value) : undefined })} />
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
        <h2 className="mb-4 text-xl font-semibold">Mascotas</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">Nombre</th>
                <th className="p-2">Especie</th>
                <th className="p-2">Raza</th>
                <th className="p-2">Propietario</th>
                <th className="p-2">Nacimiento</th>
                <th className="p-2">Peso</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody data-testid="lista-mascotas">
              {items.map((p) => (
                <tr key={p.pet_id} className="border-b border-slate-100">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.species_name ?? '-'}</td>
                  <td className="p-2">{p.breed_name ?? '-'}</td>
                  <td className="p-2">{p.owner_name ?? '-'}</td>
                  <td className="p-2">{p.birthdate ?? '-'}</td>
                  <td className="p-2">{p.weight != null ? `${p.weight} kg` : '-'}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="btn-edit" onClick={() => editar(p)}>Editar</button>
                      <button className="btn-danger" onClick={() => deshabilitar(p.pet_id)}>Deshabilitar</button>
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
