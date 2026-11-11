import { useState } from "react";
import { Link } from "react-router";
import { supabase, MENSAGEM_SEM_CONFIG } from "../services/supabaseClient";
import { emailValido } from "../utils/validacao";
import { traduzirErroAuth } from "../utils/erros";
import CampoFormulario from "../components/CampoFormulario.jsx";
import Mensagem from "../components/Mensagem.jsx";

const CAMPOS_VAZIOS = { nome: "", email: "", senha: "", confirmacao: "" };

// Devolve um objeto com uma mensagem para cada campo inválido.
function validar({ nome, email, senha, confirmacao }) {
  const erros = {};

  if (!nome.trim()) {
    erros.nome = "Informe seu nome completo.";
  } else if (nome.trim().split(/\s+/).length < 2) {
    erros.nome = "Informe nome e sobrenome.";
  }

  if (!email.trim()) {
    erros.email = "Informe seu e-mail.";
  } else if (!emailValido(email)) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!senha) {
    erros.senha = "Crie uma senha.";
  } else if (senha.length < 8) {
    erros.senha = "A senha deve ter pelo menos 8 caracteres.";
  }

  if (!confirmacao) {
    erros.confirmacao = "Confirme sua senha.";
  } else if (confirmacao !== senha) {
    erros.confirmacao = "As senhas não são iguais.";
  }

  return erros;
}

export default function Registro() {
  const [campos, setCampos] = useState(CAMPOS_VAZIOS);
  const [errosDosCampos, setErrosDosCampos] = useState({});
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((atuais) => ({ ...atuais, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (enviando) return;

    setErro(null);

    const erros = validar(campos);
    setErrosDosCampos(erros);
    if (Object.keys(erros).length > 0) return;

    if (!supabase) {
      setErro(MENSAGEM_SEM_CONFIG);
      return;
    }

    setEnviando(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: campos.email.trim(),
        password: campos.senha,
        options: {
          data: { nome: campos.nome.trim() }, // fica nos metadados do usuário
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setErro(traduzirErroAuth(error));
        return;
      }

      // Com a confirmação de e-mail ligada, o Supabase não devolve erro para
      // e-mail repetido: devolve um usuário sem identidades.
      if (data.user?.identities?.length === 0) {
        setErro("Este e-mail já está cadastrado. Tente entrar.");
        return;
      }

      setResultado({
        // Sem sessão = o usuário precisa confirmar o e-mail antes de entrar.
        precisaConfirmar: !data.session,
        email: campos.email.trim(),
      });
      setCampos(CAMPOS_VAZIOS);
    } catch {
      setErro("Não foi possível conectar ao Supabase. Verifique sua conexão.");
    } finally {
      setEnviando(false);
    }
  }

  if (resultado) {
    return (
      <Mensagem
        tipo="sucesso"
        titulo="Conta criada com sucesso"
        texto={
          resultado.precisaConfirmar
            ? `Enviamos um e-mail de confirmação para ${resultado.email}. Confirme o endereço antes de fazer login.`
            : "Sua conta está pronta e você já está conectado."
        }
      >
        <div className="acoes">
          {resultado.precisaConfirmar ? (
            <Link to="/login" className="botao botao-primario">
              Ir para o login
            </Link>
          ) : (
            <Link to="/dashboard" className="botao botao-primario">
              Abrir o dashboard
            </Link>
          )}
        </div>
      </Mensagem>
    );
  }

  return (
    <section className="formulario-card">
      <h1>Criar conta</h1>
      <p className="subtexto">Preencha os dados abaixo para se cadastrar.</p>

      <form className="formulario" onSubmit={handleSubmit} noValidate>
        <CampoFormulario
          id="nome"
          rotulo="Nome completo"
          type="text"
          autoComplete="name"
          value={campos.nome}
          onChange={atualizarCampo}
          erro={errosDosCampos.nome}
        />
        <CampoFormulario
          id="email"
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          value={campos.email}
          onChange={atualizarCampo}
          erro={errosDosCampos.email}
        />
        <CampoFormulario
          id="senha"
          rotulo="Senha (mínimo de 8 caracteres)"
          type="password"
          autoComplete="new-password"
          value={campos.senha}
          onChange={atualizarCampo}
          erro={errosDosCampos.senha}
        />
        <CampoFormulario
          id="confirmacao"
          rotulo="Confirmar senha"
          type="password"
          autoComplete="new-password"
          value={campos.confirmacao}
          onChange={atualizarCampo}
          erro={errosDosCampos.confirmacao}
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
          {enviando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="link-auxiliar">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}
