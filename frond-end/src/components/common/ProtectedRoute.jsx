import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Componente de Ruta Protegida (Route Guard)
 * 
 * @param {Object} props
 * @param {Array<string>} [props.allowedRoles] - Roles permitidos para acceder a la ruta (opcional).
 */
export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 1. Verificar si el usuario está autenticado
  if (!isAuthenticated || !user) {
    // Redirigir al login si no hay sesión activa
    return <Navigate to="/login" replace />;
  }

  // 2. Verificar si se requieren roles específicos y si el usuario los posee
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirigir a la página principal si el rol no tiene permisos suficientes
      return <Navigate to="/" replace />;
    }
  }

  // 3. Si cumple con la autenticación y el rol, renderiza el componente o ruta anidada
  return <Outlet />;
};