import React, { createContext, useContext, useState } from "react";
import { usuarios } from "../../db.js"; // Importamos los usuarios

// 1. Creamos el contexto que compartirán los componentes.
const AuthContext = createContext();

// 2. Creamos un hook personalizado `useAuth` para acceder fácilmente al contexto.
//    Esto evita tener que importar `useContext` y `AuthContext` en cada componente.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// 3. Creamos el componente `AuthProvider`.
//    Este componente envolverá a toda la aplicación (o a las partes que necesiten autenticación).
export const AuthProvider = ({ children }) => {
  // Al iniciar, intentamos leer el usuario desde localStorage.
  // Usamos una función en useState para que esta lógica se ejecute solo una vez.
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error al leer el usuario de localStorage", error);
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"));

  // Función de login
  const login = (username, password) => {
    // Buscamos si el usuario y contraseña coinciden con alguno en nuestra DB.
    const foundUser = usuarios.find(
      (user) => user.username === username && user.password === password
    );
    if (foundUser) {
      const userData = { name: foundUser.username };
      // Guardamos el usuario en localStorage para persistir la sesión.
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true; // Devolvemos `true` para indicar que el login fue exitoso.
    } else {
      console.error("Credenciales incorrectas");
      // Devolvemos `false` para que el componente de login pueda mostrar un error.
      return false;
    }
  };

  // Función de logout
  const logout = () => {
    // Limpiamos el usuario de localStorage al cerrar sesión.
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // El valor que proveerá el contexto a todos sus hijos.
  const value = { user, isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
