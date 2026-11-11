import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Mensagem from "./Mensagem.jsx";

// Barra o acesso às páginas privadas. Usada como "rota de layout":
// as rotas filhas aparecem no <Outlet /> só quando existe usuário autenticado.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Enquanto a sessão é verificada, não dá para decidir ainda.
  if (loading) {
    return <Mensagem tipo="carregando" texto="Verificando sua sessão..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}
