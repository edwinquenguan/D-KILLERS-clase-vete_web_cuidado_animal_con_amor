import { createContext, ReactNode, useContext, useState } from 'react';
import { setToken } from '../api/client';
import type { AuthResponse } from '../api/types';

interface Sesion {
  email: string;
  nombre: string;
  rol: string;
  duenoId?: number;
}

interface AuthCtx {
  sesion: Sesion | null;
  entrar: (auth: AuthResponse) => void;
  salir: () => void;
}

const SESION_KEY = 'vet_sesion';
const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicialización síncrona desde localStorage para no redirigir antes de hidratar.
  const [sesion, setSesion] = useState<Sesion | null>(() => {
    const raw = localStorage.getItem(SESION_KEY);
    return raw ? (JSON.parse(raw) as Sesion) : null;
  });

  const entrar = (auth: AuthResponse) => {
    setToken(auth.token);
    const s: Sesion = { email: auth.email, nombre: auth.nombre, rol: auth.rol, duenoId: auth.duenoId };
    localStorage.setItem(SESION_KEY, JSON.stringify(s));
    setSesion(s);
  };

  const salir = () => {
    setToken(null);
    localStorage.removeItem(SESION_KEY);
    setSesion(null);
  };

  return <AuthContext.Provider value={{ sesion, entrar, salir }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
