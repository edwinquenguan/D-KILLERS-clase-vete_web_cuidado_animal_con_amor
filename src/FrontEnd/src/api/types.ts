// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  first_surname: string;
  second_surname?: string;
  email: string;
  phone: string;
  password: string;
  city: number;
  address?: string;
}

export interface AuthUser {
  user_id: number;
  name: string;
  first_surname: string;
  email: string;
  role: string;
}

// ─── Ciudad ───────────────────────────────────────────────────────────────────

export interface City {
  city_id: number;
  city_name: string;
}

// ─── Especie ──────────────────────────────────────────────────────────────────

export interface Species {
  species_id: number;
  species_name: string;
  species_status: number;
}

// ─── Raza ─────────────────────────────────────────────────────────────────────

export interface Breed {
  breed_id: number;
  species_id: number;
  species_name: string;
  breed_name: string;
  breed_status: number;
}

// ─── Propietario (Owner) ──────────────────────────────────────────────────────

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
  second_surname: string;
  phone: string;
  email: string;
  address: string;
  city: number;
}

export interface UpdateOwnerRequest {
  name?: string;
  first_surname?: string;
  second_surname?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: number;
}

// ─── Mascota (Pet) ────────────────────────────────────────────────────────────

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
  birthdate: string;
  sex: string;
  color: string;
  weight: number;
}

export interface UpdatePetRequest {
  name?: string;
  birthdate?: string;
  sex?: string;
  color?: string;
  weight?: number;
  breed_id?: number;
}

// ─── Cita (Appointment) ───────────────────────────────────────────────────────

export interface Appointment {
  appointment_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_reason: string;
  appointment_status: number;
  appointment_date_created: string;
  pet_id: number;
  pet_name: string;
  species_name: string;
  owner_id: number;
  owner_full_name: string;
  owner_phone: string;
  vet_id: number | null;
  vet_name: string | null;
}

export interface CreateAppointmentRequest {
  pet_id: number;
  user_id: number;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}

export interface RegisterMyPetRequest {
  species_id: number;
  breed_id: number;
  name: string;
  birthdate: string;
  sex: string;
  color: string;
  weight: number;
}

export interface RequestAppointmentRequest {
  pet_id: number;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}

export interface UpdateAppointmentRequest {
  user_id?: number;
  appointment_date?: string;
  appointment_time?: string;
  reason?: string;
  status?: number;
}

// ─── Usuario de staff ─────────────────────────────────────────────────────────

export interface StaffUser {
  id: number;
  name: string;
  first_surname: string;
  email: string;
  rol_name: string;
  rol_id: number;
}

// ─── API wrapper ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
}

export interface ApiSuccess {
  success: boolean;
  message: string;
}
