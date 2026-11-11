import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

// Atalho para ler o contexto de autenticação: const { user, loading, signOut } = useAuth();
export default function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>.");
  }

  return contexto;
}
