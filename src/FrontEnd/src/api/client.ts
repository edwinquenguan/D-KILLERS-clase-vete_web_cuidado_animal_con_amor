import type {
  LoginRequest, RegisterRequest, AuthUser,
  City, Species, Breed,
  Owner, CreateOwnerRequest, UpdateOwnerRequest,
  Pet, CreatePetRequest, UpdatePetRequest, RegisterMyPetRequest,
  Appointment, CreateAppointmentRequest, RequestAppointmentRequest, UpdateAppointmentRequest,
  StaffUser,
} from './types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> ?? {}),
    },
  });

  if (res.status === 401) {
    // Cookie expirada — redirigir a login
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) msg = body.detail;
      else if (body?.message) msg = body.message;
    } catch { /* sin cuerpo */ }
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json();
  // La API Python envuelve listas y objetos en { data: T }
  return (json?.data !== undefined ? json.data : json) as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (data: LoginRequest) =>
    request<AuthUser>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: RegisterRequest) =>
    request<AuthUser>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request<AuthUser>('/auth/me'),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  recoverPassword: (email: string) =>
    request<{ success: boolean; message: string }>('/auth/recover-password', {
      method: 'POST', body: JSON.stringify({ email }),
    }),
};

// ─── Ciudades ─────────────────────────────────────────────────────────────────

export const citiesApi = {
  list: () => request<City[]>('/users/cities'),
};

// ─── Especies ─────────────────────────────────────────────────────────────────

export const speciesApi = {
  list: () => request<Species[]>('/species/'),
};

// ─── Razas ────────────────────────────────────────────────────────────────────

export const breedsApi = {
  list: () => request<Breed[]>('/breeds/'),
  bySpecies: (species_id: number) => request<Breed[]>(`/breeds/?species_id=${species_id}`),
};

// ─── Propietarios (Owners) ────────────────────────────────────────────────────

export const ownersApi = {
  list: () => request<Owner[]>('/owners/'),
  get: (id: number) => request<Owner>(`/owners/${id}`),
  create: (data: CreateOwnerRequest) =>
    request<{ success: boolean; message: string }>('/owners/create', {
      method: 'POST', body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateOwnerRequest) =>
    request<{ success: boolean; message: string }>(`/owners/update/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    }),
  disable: (id: number) =>
    request<{ success: boolean; message: string }>(`/owners/disable/${id}`, { method: 'PUT' }),
  enable: (id: number) =>
    request<{ success: boolean; message: string }>(`/owners/enable/${id}`, { method: 'PUT' }),
};

// ─── Mascotas (Pets) ──────────────────────────────────────────────────────────

export const petsApi = {
  myPets: () => request<Pet[]>('/pets/my'),
  registerMyPet: (data: RegisterMyPetRequest) =>
    request<{ success: boolean; message: string }>('/pets/my/register', {
      method: 'POST', body: JSON.stringify(data),
    }),
  list: () => request<Pet[]>('/pets/'),
  get: (id: number) => request<Pet>(`/pets/${id}`),
  create: (data: CreatePetRequest) =>
    request<{ success: boolean; message: string }>('/pets/create', {
      method: 'POST', body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdatePetRequest) =>
    request<{ success: boolean; message: string }>(`/pets/update/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    }),
  disable: (id: number) =>
    request<{ success: boolean; message: string }>(`/pets/disable/${id}`, { method: 'PUT' }),
  enable: (id: number) =>
    request<{ success: boolean; message: string }>(`/pets/enable/${id}`, { method: 'PUT' }),
};

// ─── Citas (Appointments) ─────────────────────────────────────────────────────

export const appointmentsApi = {
  myAppointments: () => request<Appointment[]>('/appointments/my'),
  requestAppointment: (data: RequestAppointmentRequest) =>
    request<{ success: boolean; message: string }>('/appointments/request', {
      method: 'POST', body: JSON.stringify(data),
    }),
  list: () => request<Appointment[]>('/appointments/'),
  get: (id: number) => request<Appointment>(`/appointments/${id}`),
  create: (data: CreateAppointmentRequest) =>
    request<{ success: boolean; message: string }>('/appointments/create', {
      method: 'POST', body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateAppointmentRequest) =>
    request<{ success: boolean; message: string }>(`/appointments/update/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    }),
  cancel: (id: number) =>
    request<{ success: boolean; message: string }>(`/appointments/cancel/${id}`, { method: 'PUT' }),
};

// ─── Usuarios de staff ────────────────────────────────────────────────────────

export const usersApi = {
  list: () => request<StaffUser[]>('/users/'),
  vets: () => request<StaffUser[]>('/users/?role_order=2'), // Veterinarios
};
