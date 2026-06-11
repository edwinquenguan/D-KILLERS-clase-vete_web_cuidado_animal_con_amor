import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
  roles?: string[];
}

export default function RutaProtegida({ children, roles }: Props) {
  const { sesion, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Verificando sesión…</p>
      </div>
    );
  }

  if (!sesion) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(sesion.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
