// src/pages/LetterPage.jsx
import React, { useEffect, useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"; // 1. Importamos motion
import { FiLogOut, FiPause, FiPlay } from "react-icons/fi"; // Importamos los íconos necesarios

export default function LetterPage() {
  const [hearts, setHearts] = useState([]);
  // La carta se muestra directamente, así que iniciamos en true.
  const [showLetter, setShowLetter] = useState(true);
  const [letterText, setLetterText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false) // Estado para controlar la música
  
  // --- LISTA DE CANCIONES ---
  // ¡Aquí debes poner los nombres de tus archivos de música!
  // La ruta correcta no incluye "/public".
  // Asegúrate de que el nombre del archivo sea exactamente "All-of-Me.mp3"
  const songList = ["/All-of-Me.mp3"];

  const audioRef = useRef(null)
  const { logout, user } = useAuth() // 1. Obtenemos el objeto 'user' del contexto

  // 2. Definimos las variantes para la animación de las letras
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3, // Un pequeño retraso antes de empezar
        staggerChildren: 0.06, // Tiempo entre la animación de cada letra
      },
    },
  };

  const letterVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const fullLetter = `🤍MI NIÑA DE OJITOS HERMOSOS🪐

Desde el momento en que te conocí, hace ya un año, mi vida cambió de un instante a otro,
dando así un giro de 180°.
Eres ahora esa niña que ilumina mis días con cada palabra que me dices,
la sonrisa que me hace feliz cada vez que te veo y me hace sentir el hombre más afortunado del mundo.

Cada momento a tu lado es un tesoro que guardo en lo más profundo de mi corazón,
y pues nada, te amo muchísimo, junto con todo el amor que llena mi corazón.

Te amo más de lo que las palabras pueden expresar.

Con todo mi corazón, amor, y con el gran anhelo de pasar mi vida a tu lado.
Tu Camilito, tu futuro novio 🤍`;

  useEffect(() => {
    const createHeart = () => {
      const heart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 2,
        size: Math.random() * 20 + 10,
      }

      setHearts(prev => [...prev, heart])

      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== heart.id))
      }, (heart.animationDuration + 1) * 1000)
    }

    const interval = setInterval(createHeart, 300)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!showLetter) return

    // INTENTO DE REPRODUCCIÓN AUTOMÁTICA:
    // Cuando la carta se muestra, intentamos reproducir la música.
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true); // Si funciona, actualizamos el estado.
      }).catch(error => {
        // Si el navegador lo bloquea, el usuario deberá hacer clic en el botón de play.
        console.error("La reproducción automática fue bloqueada por el navegador:", error);
      });
    }

    let index = 0
    const timer = setInterval(() => {
      setLetterText(fullLetter.slice(0, index))
      index++
      if (index > fullLetter.length) clearInterval(timer)
    }, 50)

    return () => {
      clearInterval(timer);
    }
  }, [showLetter])

  // Este efecto se encarga de detener la música cuando el componente se desmonta (ej. al cerrar sesión).
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Función para pausar o reanudar la música
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="app-container letter-background">
      <audio 
        ref={audioRef} 
        src={songList[0]} 
        loop // La canción se repetirá automáticamente
      />
      {hearts.map(heart => (
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

      {/* Contenedor para los botones de la esquina superior derecha */}
      <div className="top-right-controls">
        {showLetter && (
          <button onClick={togglePlayPause} className="music-control-btn">
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
        )}
        <button onClick={logout} className="logout-btn page-logout-btn">
          <FiLogOut />
          Cerrar Sesión
        </button>
      </div>

      {/* Contenedor del sobre y la carta */}
      <div className="content-wrapper">
        <div className="content"> {/* La carta ahora es el contenido principal */}
          {/* 3. Aplicamos la animación al mensaje de bienvenida */}
          {user && (
            <motion.p
              className="welcome-message"
              variants={sentence}
              initial="hidden"
              animate="visible"
            >
              {`Bienvenido, ${user.name}`.split("").map((char, index) => (
                <motion.span key={char + "-" + index} variants={letterVariant}>
                  {char}
                </motion.span>
              ))}
            </motion.p>
          )}

          <h1 className="title">Para Mi Amor</h1>

          {showLetter && (
            <div className="letter">
              <pre>
                {letterText}
                {letterText.length < fullLetter.length && <span className="typing-cursor">|</span>}
              </pre>
              {letterText.length === fullLetter.length && <p className="signature">Te amo 🤍</p>}
            </div>
          )}
        </div>
      </div>

      {/* Nota de "Continuará..." en la esquina inferior */}
      <div className="continua-note">Continuará...</div>

    </div>
  )
}
