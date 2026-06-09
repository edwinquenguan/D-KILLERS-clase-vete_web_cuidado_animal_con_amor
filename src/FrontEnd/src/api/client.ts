import type {
  AuthResponse, Cita, CitaRequest, Dueno, FilaItem, LoginRequest, Mascota,
  MascotaRequest, Notificacion, RegisterRequest, Servicio, Turno,
} from './types';

const BASE = '/api';
const TOKEN_KEY = 'vet_token';

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch {
      /* sin cuerpo */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function createCrud<T, R = T>(resource: string) {
  return {
    list: () => request<T[]>(`/${resource}`),
    get: (id: number) => request<T>(`/${resource}/${id}`),
    create: (data: R) =>
      request<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: R) =>
      request<T>(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) =>
      request<void>(`/${resource}/${id}`, { method: 'DELETE' }),
  };
}

export const duenosApi = createCrud<Dueno>('duenos');
export const turnosApi = createCrud<Turno>('turnos');
export const mascotasApi = createCrud<Mascota, MascotaRequest>('mascotas');

export const serviciosApi = {
  list: () => request<Servicio[]>('/servicios'),
};

export const filaApi = {
  list: () => request<FilaItem[]>('/fila'),
};

export const authApi = {
  register: (data: RegisterRequest) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: LoginRequest) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

export const portalApi = {
  misMascotas: () => request<Mascota[]>('/portal/mascotas'),
  crearMascota: (data: MascotaRequest) =>
    request<Mascota>('/portal/mascotas', { method: 'POST', body: JSON.stringify(data) }),
  misCitas: () => request<Cita[]>('/portal/citas'),
  agendar: (data: CitaRequest) =>
    request<Cita>('/portal/citas', { method: 'POST', body: JSON.stringify(data) }),
  cancelar: (id: number) =>
    request<Cita>(`/portal/citas/${id}/cancelar`, { method: 'PUT' }),
  notificaciones: () => request<Notificacion[]>('/portal/notificaciones'),
  marcarLeidas: () =>
    request<void>('/portal/notificaciones/marcar-leidas', { method: 'POST' }),
};

export const citasAdminApi = {
  list: () => request<Cita[]>('/citas'),
  cambiarEstado: (id: number, estado: string) =>
    request<Cita>(`/citas/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),
};
