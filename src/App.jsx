import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Registros from "./pages/Registros.jsx";
import Detalhes from "./pages/Detalhes.jsx";
import Perfil from "./pages/Perfil.jsx";
import Pagina404 from "./pages/Pagina404.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="conteudo">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rotas protegidas: só entram usuários autenticados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/registros" element={<Registros />} />
            <Route path="/registros/:id" element={<Detalhes />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </>
  );
}
