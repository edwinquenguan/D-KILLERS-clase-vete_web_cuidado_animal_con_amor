import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/client';
import type { UserSession } from '../api/types';

interface AuthCtx {
  sesion: UserSession | null;
  cargando: boolean;
  entrar: (sesion: UserSession) => void;
  salir: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<UserSession | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, intentar recuperar sesión desde la cookie vía /me
  useEffect(() => {
    authApi.me()
      .then((res) => setSesion(res.data))
      .catch(() => setSesion(null))
      .finally(() => setCargando(false));
  }, []);

  const entrar = (data: UserSession) => {
    setSesion(data);
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
