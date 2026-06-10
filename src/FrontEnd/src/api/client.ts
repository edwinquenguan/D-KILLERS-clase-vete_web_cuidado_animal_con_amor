import type {
  LoginRequest, LoginResponse, MeResponse,
  Owner, CreateOwnerRequest,
  Pet, CreatePetRequest,
  Appointment, CreateAppointmentRequest,
  Consultation, CreateConsultationRequest, Species, Breed,
  ApiList, ApiItem,
} from './types';

const BASE = '/api';

// fetch con cookies incluidas automáticamente (same-origin via proxy Vite / nginx)
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

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
  return res.json() as Promise<T>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (data: LoginRequest) =>
    request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  me: () => request<MeResponse>('/auth/me'),

  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  refresh: () => request<{ success: boolean }>('/auth/refresh', { method: 'POST' }),
};

// ─── Propietarios ─────────────────────────────────────────────────────────────

export const ownersApi = {
  list: () => request<ApiList<Owner>>('/owners'),
  get: (id: number) => request<ApiItem<Owner>>(`/owners/${id}`),
  create: (data: CreateOwnerRequest) =>
    request<ApiItem<Owner>>('/owners/create', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CreateOwnerRequest>) =>
    request<ApiItem<Owner>>(`/owners/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  disable: (id: number) =>
    request<{ success: boolean }>(`/owners/disable/${id}`, { method: 'PUT' }),
  enable: (id: number) =>
    request<{ success: boolean }>(`/owners/enable/${id}`, { method: 'PUT' }),
};

// ─── Mascotas ─────────────────────────────────────────────────────────────────

export const petsApi = {
  list: (params?: { owner_id?: number; species_id?: number; status?: number }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<ApiList<Pet>>(`/pets${q}`);
  },
  get: (id: number) => request<ApiItem<Pet>>(`/pets/${id}`),
  create: (data: CreatePetRequest) =>
    request<ApiItem<Pet>>('/pets/create', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CreatePetRequest>) =>
    request<ApiItem<Pet>>(`/pets/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  disable: (id: number) =>
    request<{ success: boolean }>(`/pets/disable/${id}`, { method: 'PUT' }),
  enable: (id: number) =>
    request<{ success: boolean }>(`/pets/enable/${id}`, { method: 'PUT' }),
};

// ─── Citas ────────────────────────────────────────────────────────────────────

export const appointmentsApi = {
  list: (params?: { pet_id?: number; user_id?: number; status?: number }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<ApiList<Appointment>>(`/appointments${q}`);
  },
  get: (id: number) => request<ApiItem<Appointment>>(`/appointments/${id}`),
  create: (data: CreateAppointmentRequest) =>
    request<ApiItem<Appointment>>('/appointments/create', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CreateAppointmentRequest>) =>
    request<ApiItem<Appointment>>(`/appointments/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancel: (id: number) =>
    request<{ success: boolean }>(`/appointments/cancel/${id}`, { method: 'PUT' }),
};

// ─── Consultas ────────────────────────────────────────────────────────────────

export const consultationsApi = {
  list: (params?: { pet_id?: number; user_id?: number }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<ApiList<Consultation>>(`/consultations${q}`);
  },
  get: (id: number) => request<ApiItem<Consultation>>(`/consultations/${id}`),
  create: (data: CreateConsultationRequest) =>
    request<ApiItem<Consultation>>('/consultations/create', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CreateConsultationRequest>) =>
    request<ApiItem<Consultation>>(`/consultations/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Catálogos ────────────────────────────────────────────────────────────────

export const speciesApi = {
  list: () => request<ApiList<Species>>('/species'),
};

export const breedsApi = {
  list: (species_id?: number) => {
    const q = species_id ? `?species_id=${species_id}` : '';
    return request<ApiList<Breed>>(`/breeds${q}`);
  },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  petsCount: () => request<{ data: { total: number } }>('/dashboard/pets-count'),
  ownersCount: () => request<{ data: { total: number } }>('/dashboard/owners-count'),
  appointmentsByStatus: () => request<ApiList<{ status: number; total: number }>>('/dashboard/appointments-by-status'),
  consultationsByMonth: () => request<ApiList<{ month: string; total: number }>>('/dashboard/consultations-by-month'),
  petsBySpecies: () => request<ApiList<{ species: string; total: number }>>('/dashboard/pets-by-species'),
  vaccinationsByMonth: () => request<ApiList<{ month: string; total: number }>>('/dashboard/vaccinations-by-month'),
  topVets: () => request<ApiList<{ vet: string; total: number }>>('/dashboard/top-vets'),
};
