// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserSession {
  user_id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Veterinario' | 'Recepcionista';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: UserSession;
}

export interface MeResponse {
  data: UserSession;
}

// ─── Propietarios ─────────────────────────────────────────────────────────────

export interface Owner {
  owner_id: number;
  name: string;
  first_surname: string;
  second_surname: string;
  phone: string;
  email: string;
  address: string;
  city_id: number;
  city_name: string;
  owner_status: number;
  owner_date: string;
}

export interface CreateOwnerRequest {
  name: string;
  first_surname: string;
  second_surname?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: number;
}

// ─── Mascotas ─────────────────────────────────────────────────────────────────

export interface Pet {
  pet_id: number;
  name: string;
  birthdate: string;
  sex: string;
  color: string;
  weight: number;
  pet_status: number;
  pet_date: string;
  owner_id: number;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  species_id: number;
  species_name: string;
  breed_id: number;
  breed_name: string;
}

export interface CreatePetRequest {
  owner_id: number;
  species_id: number;
  breed_id: number;
  name: string;
  birthdate?: string;
  sex?: string;
  color?: string;
  weight?: number;
}

// ─── Citas ────────────────────────────────────────────────────────────────────

export type AppointmentStatus = 1 | 2 | 3;

export interface Appointment {
  appointment_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_reason: string;
  appointment_status: AppointmentStatus;
  appointment_date_created: string;
  pet_id: number;
  pet_name: string;
  species_name: string;
  owner_id: number;
  owner_full_name: string;
  owner_phone: string;
  vet_id: number;
  vet_name: string;
}

export interface CreateAppointmentRequest {
  pet_id: number;
  user_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_reason: string;
}

// ─── Consultas ────────────────────────────────────────────────────────────────

export interface Consultation {
  consultation_id: number;
  consultation_date: string;
  consultation_weight: number;
  consultation_temperature: number;
  consultation_diagnosis: string;
  consultation_treatment: string;
  consultation_notes?: string;
  pet_id: number;
  pet_name: string;
  species_name: string;
  breed_name: string;
  owner_id: number;
  owner_full_name: string;
  owner_phone: string;
  vet_id: number;
  vet_name: string;
  appointment_id?: number;
}

export interface CreateConsultationRequest {
  pet_id: number;
  user_id: number;
  appointment_id?: number;
  weight: number;
  temperature: number;
  diagnosis: string;
  treatment: string;
  notes?: string;
}

// ─── Catálogos ────────────────────────────────────────────────────────────────

export interface Species {
  species_id: number;
  species_name: string;
  species_status: number;
}

export interface Breed {
  breed_id: number;
  species_id: number;
  species_name: string;
  breed_name: string;
  breed_status: number;
}

// ─── Respuesta genérica de la API ─────────────────────────────────────────────

export interface ApiList<T> {
  data: T[];
}

export interface ApiItem<T> {
  data: T;
}
