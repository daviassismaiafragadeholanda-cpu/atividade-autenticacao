import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <section className="hero">
      <h1>Cadastro de clientes</h1>
      <p className="hero-texto">
        Entre na sua conta para consultar os clientes guardados no Supabase. As
        páginas privadas só abrem para usuários autenticados, e o banco também
        bloqueia quem não fez login.
      </p>

      {!loading && user ? (
        <Link to="/dashboard" className="botao botao-primario">
          Abrir o dashboard
        </Link>
      ) : (
        <div className="acoes">
          <Link to="/login" className="botao botao-primario">
            Entrar
          </Link>
          <Link to="/registro" className="botao botao-secundario">
            Criar conta
          </Link>
        </div>
      )}

      <h2 className="subtitulo">Páginas da aplicação</h2>
      <ul className="rotas">
        <li>
          <code>/</code>
          <span>Início, /login e /registro: públicas.</span>
        </li>
        <li>
          <code>/dashboard</code>
          <span>Resumo da conta. Exige login.</span>
        </li>
        <li>
          <code>/registros</code>
          <span>Listagem de clientes. Exige login.</span>
        </li>
        <li>
          <code>/registros/:id</code>
          <span>Detalhes de um cliente. Exige login.</span>
        </li>
        <li>
          <code>/perfil</code>
          <span>Dados da sua conta. Exige login.</span>
        </li>
      </ul>
    </section>
  );
}
