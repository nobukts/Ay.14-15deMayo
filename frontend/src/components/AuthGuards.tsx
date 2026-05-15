import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --- EP 2.5 (b): Rutas Protegidas ---
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // O un spinner de carga

  return user ? children : <Redirect to="/login" />;
};

// --- EP 2.5 (d): Diferenciación por Roles ---
export const RoleGuard = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return null; // Oculta el contenido si el usuario no tiene el rol
  }

  return <>{children}</>;
};
