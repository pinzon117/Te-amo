import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "./login.css"; // Importamos los estilos del login

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hearts, setHearts] = useState([]);
  const { login } = useAuth();

  // Lógica para la lluvia de corazones
  useEffect(() => {
    const createHeart = () => {
      const heart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 2,
        size: Math.random() * 20 + 10,
      };

      setHearts((prev) => [...prev, heart]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== heart.id));
      }, (heart.animationDuration + 1) * 1000);
    };

    const interval = setInterval(createHeart, 300);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje("");
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Usa el contexto para login y comprueba el resultado.
    const success = login(username, password);
    if (!success) {
      setMensaje("Usuario o contraseña incorrectos.");
    }
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      {/* Mapeo de corazones */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.animationDuration}s`,
            fontSize: `${heart.size}px`,
          }}
        >
          🤍
        </div>
      ))}
      <AnimatePresence>
        <motion.div
          className="login-card"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -40 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="login-header">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Iniciar Sesión
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Accede a tu cuenta
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? "Iniciando sesión..." : "Entrar"}
            </button>
          </form>

          {mensaje && (
            <div
              className={`mensaje ${
                mensaje.includes("exitoso") ? "success" : "error"
              }`}
            >
              {mensaje}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Login;