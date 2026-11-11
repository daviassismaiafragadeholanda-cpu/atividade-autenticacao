import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { supabase, MENSAGEM_SEM_CONFIG } from "../services/supabaseClient";
import useAuth from "../hooks/useAuth";
import { emailValido } from "../utils/validacao";
import { traduzirErroAuth } from "../utils/erros";
import CampoFormulario from "../components/CampoFormulario.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Quem já está logado não precisa ver o formulário.
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    // Impede envios repetidos enquanto a autenticação está em andamento.
    if (enviando) return;

    setErro(null);

    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    if (!emailValido(email)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    if (!supabase) {
      setErro(MENSAGEM_SEM_CONFIG);
      return;
    }

    setEnviando(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        setErro(traduzirErroAuth(error));
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch {
      setErro("Não foi possível conectar ao Supabase. Verifique sua conexão.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-card">
      <h1>Entrar</h1>
      <p className="subtexto">Use o e-mail e a senha da sua conta.</p>

      <form className="formulario" onSubmit={handleSubmit} noValidate>
        <CampoFormulario
          id="email"
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CampoFormulario
          id="senha"
          rotulo="Senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && (
          <div role="alert" className="alerta alerta-erro">
            {erro}
          </div>
        )}

        <button
          type="submit"
          className="botao botao-primario"
          disabled={enviando}
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="link-auxiliar">
        Ainda não tem conta? <Link to="/registro">Criar conta</Link>
      </p>
    </section>
  );
}
