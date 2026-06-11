import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/client';
import type { AuthUser } from '../api/types';

interface AuthCtx {
  sesion: AuthUser | null;
  cargando: boolean;
  entrar: (user: AuthUser) => void;
  salir: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<AuthUser | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Restaurar sesión desde la cookie httponly via /api/auth/me
    authApi.me()
      .then((user) => setSesion(user))
      .catch(() => setSesion(null))
      .finally(() => setCargando(false));
  }, []);

  const entrar = (user: AuthUser) => {
    setSesion(user);
  };

  const salir = async () => {
    try { await authApi.logout(); } catch { /* ignorar */ }
    setSesion(null);
  };

  return (
    <AuthContext.Provider value={{ sesion, cargando, entrar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
