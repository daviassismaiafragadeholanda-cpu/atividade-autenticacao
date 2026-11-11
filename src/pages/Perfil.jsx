import useAuth from "../hooks/useAuth";
import BotaoSair from "../components/BotaoSair.jsx";

export default function Perfil() {
  // Todos os dados vêm do contexto de autenticação.
  const { user } = useAuth();

  return (
    <article className="ficha">
      <h1>Meu perfil</h1>
      <dl className="ficha-dados">
        <dt>Nome completo</dt>
        <dd>{user.user_metadata?.nome || "Não informado"}</dd>
        <dt>E-mail</dt>
        <dd>{user.email}</dd>
        <dt>Identificador</dt>
        <dd className="texto-tecnico">{user.id}</dd>
      </dl>
      <div className="acoes">
        <BotaoSair />
      </div>
    </article>
  );
}
