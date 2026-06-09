import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Protege rutas: exige sesión y, opcionalmente, un rol concreto. */
export default function RutaProtegida({ children, rol }: { children: ReactNode; rol?: string }) {
  const { sesion } = useAuth();
  if (!sesion) return <Navigate to="/login" replace />;
  if (rol && sesion.rol !== rol) return <Navigate to="/" replace />;
  return <>{children}</>;
}
