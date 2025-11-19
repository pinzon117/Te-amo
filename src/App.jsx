import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/login";
import LetterPage from "./pages/LetterPage";
import PrivateRoute from "./context/PrivateRoute";

export default function App() {
  return (
    // 1. BrowserRouter envuelve todo para que useNavigate funcione en todas partes.
    <BrowserRouter>
      {/* 2. AuthProvider envuelve las rutas para que todas tengan acceso al contexto de usuario. */}
      <AuthProvider>
        {/* 3. Routes define dónde se renderizarán las páginas. */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas Privadas (protegidas por PrivateRoute) */}
          <Route path="/" element={<PrivateRoute><LetterPage /></PrivateRoute>} />
          <Route path="/carta" element={<PrivateRoute><LetterPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
