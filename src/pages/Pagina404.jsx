import { Link } from "react-router";
import Mensagem from "../components/Mensagem.jsx";

export default function Pagina404() {
  return (
    <Mensagem
      tipo="vazio"
      titulo="Página não encontrada"
      texto="O endereço que você abriu não existe nesta aplicação."
    >
      <Link to="/" className="botao botao-primario">
        Ir para o início
      </Link>
    </Mensagem>
  );
}
