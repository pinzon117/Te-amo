import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Si el usuario no está autenticado...
  if (!isAuthenticated) {
    // ...lo redirigimos a la página de login.
    // `replace` evita que el usuario pueda volver a la página anterior con el botón de retroceso del navegador.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderizamos el componente hijo que se le pasó.
  return children;
};

export default PrivateRoute;