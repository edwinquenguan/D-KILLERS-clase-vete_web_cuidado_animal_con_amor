import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petsApi, speciesApi, breedsApi, appointmentsApi } from '../../api/client';
import type {
  Pet, Species, Breed,
  RegisterMyPetRequest, RequestAppointmentRequest,
} from '../../api/types';

// ─── Constantes ───────────────────────────────────────────────────────────────

const SEXOS = [{ value: 'M', label: 'Macho' }, { value: 'F', label: 'Hembra' }];

const HORAS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00',
];

const hoy = () => new Date().toISOString().split('T')[0];
const maxFecha = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().split('T')[0];
};

const PET_VACIO: RegisterMyPetRequest = {
  species_id: 0, breed_id: 0, name: '',
  birthdate: '', sex: '', color: '', weight: 0,
};

const CITA_VACIO: RequestAppointmentRequest = {
  pet_id: 0, appointment_date: '', appointment_time: '', reason: '',
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function SolicitarCitaPage() {
  // — datos del servidor —
  const [mascotas, setMascotas]   = useState<Pet[]>([]);
  const [species, setSpecies]     = useState<Species[]>([]);
  const [breeds, setBreeds]       = useState<Breed[]>([]);
  const [razasFiltradas, setRazasFiltradas] = useState<Breed[]>([]);

  // — formulario mascota —
  const [mostrarFormMascota, setMostrarFormMascota] = useState(false);
  const [petForm, setPetForm]   = useState<RegisterMyPetRequest>(PET_VACIO);
  const [petErr, setPetErr]     = useState('');
  const [petOk, setPetOk]       = useState('');
  const [petCargando, setPetCargando] = useState(false);

  // — formulario cita —
  const [citaForm, setCitaForm] = useState<RequestAppointmentRequest>(CITA_VACIO);
  const [citaErr, setCitaErr]   = useState('');
  const [citaOk, setCitaOk]     = useState('');
  const [citaCargando, setCitaCargando] = useState(false);

  // — carga inicial —
  const [cargandoPets, setCargandoPets] = useState(true);

  const recargarMascotas = () =>
    petsApi.myPets()
      .then(setMascotas)
      .catch(() => {})
      .finally(() => setCargandoPets(false));

  useEffect(() => {
    recargarMascotas();
    speciesApi.list().then(setSpecies).catch(() => {});
    breedsApi.list().then(setBreeds).catch(() => {});
  }, []);

  // Filtrar razas al cambiar especie
  useEffect(() => {
    if (petForm.species_id) {
      setRazasFiltradas(
        breeds.filter((b) => b.species_id === petForm.species_id && b.breed_status === 2)
      );
      setPetForm((f) => ({ ...f, breed_id: 0 }));
    } else {
      setRazasFiltradas([]);
    }
  }, [petForm.species_id, breeds]);

  // ─── Registrar mascota ────────────────────────────────────────────────────
  const submitMascota = async (e: FormEvent) => {
    e.preventDefault();
    if (!petForm.species_id) { setPetErr('Selecciona la especie'); return; }
    if (!petForm.breed_id)   { setPetErr('Selecciona la raza'); return; }
    if (!petForm.sex)        { setPetErr('Selecciona el sexo'); return; }
    setPetErr('');
    setPetCargando(true);
    try {
      await petsApi.registerMyPet(petForm);
      setPetOk(`¡${petForm.name} fue registrado/a exitosamente!`);
      setPetForm(PET_VACIO);
      setMostrarFormMascota(false);
      await recargarMascotas();
      // Pre-seleccionar la nueva mascota en el formulario de cita
      setTimeout(() => {
        setMascotas((prev) => {
          const nueva = prev[prev.length - 1];
          if (nueva) setCitaForm((f) => ({ ...f, pet_id: nueva.pet_id }));
          return prev;
        });
      }, 300);
    } catch (err) {
      setPetErr((err as Error).message);
    } finally {
      setPetCargando(false);
    }
  };

  // ─── Solicitar cita ────────────────────────────────────────────────────────
  const submitCita = async (e: FormEvent) => {
    e.preventDefault();
    if (!citaForm.pet_id)            { setCitaErr('Selecciona una mascota'); return; }
    if (!citaForm.appointment_date)  { setCitaErr('Selecciona una fecha'); return; }
    if (!citaForm.appointment_time)  { setCitaErr('Selecciona un horario'); return; }
    if (!citaForm.reason.trim())     { setCitaErr('Describe el motivo de la cita'); return; }
    setCitaErr('');
    setCitaCargando(true);
    try {
      await appointmentsApi.requestAppointment(citaForm);
      setCitaOk('¡Solicitud enviada! El personal revisará y confirmará tu cita pronto.');
      setCitaForm(CITA_VACIO);
    } catch (err) {
      setCitaErr((err as Error).message);
    } finally {
      setCitaCargando(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/portal/mis-citas" className="text-sm text-brand hover:text-brand-dark font-medium">
            ← Mis citas
          </Link>
          <h2 className="mt-1 text-xl font-bold text-slate-800">Solicitar cita</h2>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECCIÓN 1 — Mis mascotas
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-700 text-base">
            Mis mascotas
            {mascotas.length > 0 && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                ({mascotas.length} registrada{mascotas.length > 1 ? 's' : ''})
              </span>
            )}
          </h3>
          <button
            onClick={() => { setMostrarFormMascota((v) => !v); setPetErr(''); setPetOk(''); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors"
          >
            {mostrarFormMascota ? '✕ Cancelar' : '+ Agregar mascota'}
          </button>
        </div>

        {/* Lista de mascotas */}
        {cargandoPets ? (
          <p className="text-sm text-slate-400 py-2">Cargando…</p>
        ) : mascotas.length === 0 && !mostrarFormMascota ? (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            Aún no tienes mascotas registradas. Haz clic en <strong>+ Agregar mascota</strong> para registrar la primera.
          </div>
        ) : mascotas.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-2">
            {mascotas.map((m) => (
              <span key={m.pet_id}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-light border border-brand/20 px-3 py-1 text-sm text-slate-700 font-medium">
                🐾 {m.name}
                <span className="text-slate-400 text-xs">({m.species_name})</span>
              </span>
            ))}
          </div>
        ) : null}

        {petOk && (
          <div className="mb-3 rounded-xl bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
            ✅ {petOk}
          </div>
        )}

        {/* Formulario registrar mascota */}
        {mostrarFormMascota && (
          <form onSubmit={submitMascota} className="mt-4 border-t border-slate-100 pt-4 space-y-4">
            <p className="text-sm font-semibold text-slate-600 mb-3">Registrar nueva mascota</p>

            {petErr && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                ⚠️ {petErr}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="field">Nombre de la mascota
                <input
                  value={petForm.name}
                  onChange={(e) => setPetForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Firulais"
                  required
                />
              </label>

              <label className="field">Especie
                <select
                  value={petForm.species_id || ''}
                  onChange={(e) => setPetForm((f) => ({ ...f, species_id: Number(e.target.value) }))}
                  required
                >
                  <option value="">-- selecciona --</option>
                  {species.filter((s) => s.species_status === 2).map((s) => (
                    <option key={s.species_id} value={s.species_id}>{s.species_name}</option>
                  ))}
                </select>
              </label>

              <label className="field">Raza
                <select
                  value={petForm.breed_id || ''}
                  onChange={(e) => setPetForm((f) => ({ ...f, breed_id: Number(e.target.value) }))}
                  required
                  disabled={!petForm.species_id}
                >
                  <option value="">
                    {petForm.species_id ? '-- selecciona --' : '-- elige especie primero --'}
                  </option>
                  {razasFiltradas.map((b) => (
                    <option key={b.breed_id} value={b.breed_id}>{b.breed_name}</option>
                  ))}
                </select>
              </label>

              <label className="field">Sexo
                <select
                  value={petForm.sex}
                  onChange={(e) => setPetForm((f) => ({ ...f, sex: e.target.value }))}
                  required
                >
                  <option value="">-- selecciona --</option>
                  {SEXOS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>

              <label className="field">Fecha de nacimiento
                <input
                  type="date"
                  max={hoy()}
                  value={petForm.birthdate}
                  onChange={(e) => setPetForm((f) => ({ ...f, birthdate: e.target.value }))}
                  required
                />
              </label>

              <label className="field">Color / pelaje
                <input
                  value={petForm.color}
                  onChange={(e) => setPetForm((f) => ({ ...f, color: e.target.value }))}
                  placeholder="Ej: Negro, Atigrado…"
                  required
                />
              </label>

              <label className="field">Peso (kg)
                <input
                  type="number"
                  min="0.1"
                  max="999"
                  step="0.1"
                  value={petForm.weight || ''}
                  onChange={(e) => setPetForm((f) => ({ ...f, weight: Number(e.target.value) }))}
                  required
                />
              </label>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={petCargando} className="btn-primary">
                {petCargando ? 'Registrando…' : '💾 Guardar mascota'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setMostrarFormMascota(false); setPetErr(''); }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECCIÓN 2 — Solicitar cita
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="card">
        <h3 className="font-bold text-slate-700 text-base mb-4">Datos de la cita</h3>

        {citaOk ? (
          <div className="py-6 text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="font-semibold text-green-700 text-lg">{citaOk}</p>
            <button
              onClick={() => setCitaOk('')}
              className="mt-4 text-sm text-brand hover:text-brand-dark font-medium"
            >
              Solicitar otra cita
            </button>
          </div>
        ) : (
          <form onSubmit={submitCita} className="space-y-4">
            {mascotas.length === 0 && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-500">
                Registra al menos una mascota (sección de arriba) para poder solicitar la cita.
              </div>
            )}

            {citaErr && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                ⚠️ {citaErr}
              </div>
            )}

            <label className="field">Mascota
              <select
                value={citaForm.pet_id || ''}
                onChange={(e) => setCitaForm((f) => ({ ...f, pet_id: Number(e.target.value) }))}
                required
                disabled={mascotas.length === 0}
              >
                <option value="">
                  {mascotas.length === 0 ? '-- registra una mascota primero --' : '-- selecciona --'}
                </option>
                {mascotas.map((m) => (
                  <option key={m.pet_id} value={m.pet_id}>
                    {m.name} — {m.species_name} ({m.sex === 'M' ? 'Macho' : 'Hembra'})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="field">Fecha de la cita
                <input
                  type="date"
                  min={hoy()}
                  max={maxFecha()}
                  value={citaForm.appointment_date}
                  onChange={(e) => setCitaForm((f) => ({ ...f, appointment_date: e.target.value }))}
                  required
                  disabled={mascotas.length === 0}
                />
              </label>

              <label className="field">Horario
                <select
                  value={citaForm.appointment_time}
                  onChange={(e) => setCitaForm((f) => ({ ...f, appointment_time: e.target.value }))}
                  required
                  disabled={mascotas.length === 0}
                >
                  <option value="">-- selecciona --</option>
                  {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </label>
            </div>

            <label className="field">Motivo de la consulta
              <textarea
                rows={3}
                placeholder="Ej: Revisión general, vacunación, consulta por fiebre…"
                value={citaForm.reason}
                onChange={(e) => setCitaForm((f) => ({ ...f, reason: e.target.value }))}
                required
                disabled={mascotas.length === 0}
                className="resize-none"
              />
            </label>

            <button
              type="submit"
              disabled={citaCargando || mascotas.length === 0}
              className="btn-primary w-full"
            >
              {citaCargando ? 'Enviando…' : '📅 Enviar solicitud de cita'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
