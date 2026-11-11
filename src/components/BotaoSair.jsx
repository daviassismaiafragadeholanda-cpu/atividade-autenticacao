import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

// Encerra a sessão (Supabase Auth), atualiza o contexto e leva o usuário ao /login.
export default function BotaoSair() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleSair() {
    setSaindo(true);
    setErro(null);

    const { error } = await signOut();

    if (error) {
      setErro("Não foi possível encerrar a sessão. Tente novamente.");
      setSaindo(false);
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <div>
      <button
        type="button"
        className="botao botao-secundario"
        onClick={handleSair}
        disabled={saindo}
      >
        {saindo ? "Saindo..." : "Sair da conta"}
      </button>
      {erro && (
        <p role="alert" className="campo-erro">
          {erro}
        </p>
      )}
    </div>
  );
}
