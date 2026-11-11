import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase, MENSAGEM_SEM_CONFIG } from "../services/supabaseClient";
import useAuth from "../hooks/useAuth";
import BotaoSair from "../components/BotaoSair.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const nome = user?.user_metadata?.nome || user?.email;

  const [total, setTotal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function contarClientes() {
      setCarregando(true);
      setErro(null);

      if (!supabase) {
        setErro(MENSAGEM_SEM_CONFIG);
        setCarregando(false);
        return;
      }

      try {
        // head: true não traz as linhas, só a contagem.
        const { count, error } = await supabase
          .from("clientes")
          .select("*", { count: "exact", head: true });

        if (cancelado) return;

        if (error) {
          setErro(error.message);
        } else {
          setTotal(count);
        }
      } catch {
        if (!cancelado) {
          setErro("Não foi possível conectar ao Supabase. Verifique sua conexão.");
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    contarClientes();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <section>
      <h1>Olá, {nome}</h1>
      <p className="subtexto">Você está conectado ao sistema.</p>

      <div className="painel">
        <p className="painel-rotulo">Clientes cadastrados</p>
        {carregando && <p role="status">Carregando...</p>}
        {erro && (
          <p role="alert" className="campo-erro">
            Não foi possível consultar os clientes: {erro}
          </p>
        )}
        {!carregando && !erro && <p className="painel-numero">{total}</p>}
      </div>

      <div className="acoes">
        <Link to="/registros" className="botao botao-primario">
          Ver clientes
        </Link>
        <Link to="/perfil" className="botao botao-secundario">
          Meu perfil
        </Link>
        <BotaoSair />
      </div>
    </section>
  );
}
