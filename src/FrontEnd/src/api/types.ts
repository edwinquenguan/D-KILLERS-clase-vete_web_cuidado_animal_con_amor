export interface Dueno {
  id?: number;
  nombre: string;
  contacto?: string;
  direccion?: string;
  tipoDocumento?: string;
  documento: string;
}

export interface Turno {
  id?: number;
  disponibilidad: boolean;
  turno?: string;
  consecutivo?: number;
  tiempoDeEspera?: number;
  servicio?: string;
  codigo?: string;
  prioritario?: boolean;
}

export interface Servicio {
  nombre: string;
  label: string;
  prefijo: string;
  prioritario: boolean;
}

export interface Mascota {
  id?: number;
  nombre: string;
  raza?: string;
  anios?: number;
  servicio?: string;
  fechahoraIngreso?: string;
  fechahoraSalida?: string;
  dueno?: Dueno;
  turno?: Turno;
}

export interface MascotaRequest {
  nombre: string;
  raza?: string;
  anios?: number;
  servicio?: string;
  fechahoraIngreso?: string;
  fechahoraSalida?: string;
  duenoId?: number;
  turnoId?: number;
}

export interface FilaItem {
  posicion: number;
  codigoTurno?: string;
  servicio?: string;
  prioritario: boolean;
  mascota: string;
  dueno?: string;
  tiempoEstimado: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  contacto?: string;
  direccion?: string;
  tipoDocumento?: string;
  documento: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nombre: string;
  rol: string;
  duenoId?: number;
}

export type EstadoCita = 'SOLICITADA' | 'EN_PROCESO' | 'TERMINADA' | 'CANCELADA';

export interface Cita {
  id?: number;
  mascota?: Mascota;
  servicio?: string;
  fechaHoraProgramada?: string;
  estado: EstadoCita;
  fechaSolicitud?: string;
  fechaTerminado?: string;
}

export interface CitaRequest {
  mascotaId: number;
  servicio: string;
  fechaHoraProgramada?: string;
}

export interface Notificacion {
  citaId: number;
  mensaje: string;
  fecha?: string;
}
