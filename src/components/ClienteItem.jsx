import { Link } from "react-router";

// Linha da listagem. Recebe o cliente por props e leva à rota dinâmica /registros/:id.
export default function ClienteItem({ cliente }) {
  return (
    <li className="cliente-item">
      <span className="cliente-id">{cliente.id}</span>
      <div className="cliente-dados">
        <span className="cliente-nome">{cliente.nome_cliente}</span>
        <span className="cliente-email">{cliente.email}</span>
      </div>
      <Link className="botao botao-secundario" to={`/registros/${cliente.id}`}>
        Ver detalhes
      </Link>
    </li>
  );
}
