import { useEffect, useState } from "react";
import { supabase, MENSAGEM_SEM_CONFIG } from "../services/supabaseClient";
import ClienteItem from "../components/ClienteItem.jsx";
import Mensagem from "../components/Mensagem.jsx";

export default function Registros() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function carregarClientes() {
      setCarregando(true);
      setErro(null);

      if (!supabase) {
        setErro(MENSAGEM_SEM_CONFIG);
        setCarregando(false);
        return;
      }

      try {
        // Com a RLS ligada, o Supabase só devolve as linhas para quem está logado.
        const { data, error } = await supabase
          .from("clientes")
          .select("*")
          .order("id", { ascending: true });

        if (cancelado) return;

        if (error) {
          setErro(error.message);
        } else {
          setClientes(data);
        }
      } catch {
        if (!cancelado) {
          setErro("Não foi possível conectar ao Supabase. Verifique sua conexão.");
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarClientes();

    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  if (carregando) {
    return <Mensagem tipo="carregando" texto="Carregando clientes..." />;
  }

  if (erro) {
    return (
      <Mensagem
        tipo="erro"
        titulo="Não foi possível carregar os clientes"
        texto={erro}
      >
        <button
          type="button"
          className="botao botao-secundario"
          onClick={() => setTentativa((n) => n + 1)}
        >
          Tentar novamente
        </button>
      </Mensagem>
    );
  }

  if (clientes.length === 0) {
    return (
      <Mensagem
        tipo="vazio"
        titulo="Nenhum cliente para mostrar"
        texto="A tabela clientes está vazia ou a política de acesso (RLS) não permite ler os registros. Confira se o arquivo supabase/politicas-rls.sql foi executado."
      />
    );
  }

  return (
    <section>
      <div className="cabecalho-pagina">
        <h1>Clientes</h1>
        <p className="contagem">
          {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"}
        </p>
      </div>
      <ul className="lista">
        {clientes.map((cliente) => (
          <ClienteItem key={cliente.id} cliente={cliente} />
        ))}
      </ul>
    </section>
  );
}
