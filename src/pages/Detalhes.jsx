import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { supabase, MENSAGEM_SEM_CONFIG } from "../services/supabaseClient";
import Mensagem from "../components/Mensagem.jsx";

function Voltar() {
  return (
    <Link to="/registros" className="voltar">
      Voltar para a listagem
    </Link>
  );
}

export default function Detalhes() {
  // Recupera o identificador presente na URL (/registros/:id)
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function carregarCliente() {
      setCarregando(true);
      setErro(null);
      setCliente(null);

      // Um id que não é número nunca existe na tabela: trata como não encontrado.
      if (!/^\d+$/.test(id)) {
        setCarregando(false);
        return;
      }

      if (!supabase) {
        setErro(MENSAGEM_SEM_CONFIG);
        setCarregando(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("clientes")
          .select("*")
          .eq("id", id)
          .maybeSingle(); // devolve null (sem erro) quando não há registro

        if (cancelado) return;

        if (error) {
          setErro(error.message);
        } else {
          setCliente(data);
        }
      } catch {
        if (!cancelado) {
          setErro("Não foi possível conectar ao Supabase. Verifique sua conexão.");
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarCliente();

    return () => {
      cancelado = true;
    };
  }, [id]);

  if (carregando) {
    return <Mensagem tipo="carregando" texto="Carregando cliente..." />;
  }

  if (erro) {
    return (
      <>
        <Voltar />
        <Mensagem
          tipo="erro"
          titulo="Não foi possível carregar o cliente"
          texto={erro}
        />
      </>
    );
  }

  if (!cliente) {
    return (
      <>
        <Voltar />
        <Mensagem
          tipo="vazio"
          titulo="Cliente não encontrado"
          texto={`Não existe cliente com o id ${id}. Volte para a listagem e escolha outro registro.`}
        />
      </>
    );
  }

  return (
    <>
      <Voltar />
      <article className="ficha">
        <p className="ficha-id">Cliente {cliente.id}</p>
        <h1>{cliente.nome_cliente}</h1>
        <dl className="ficha-dados">
          <dt>Telefone</dt>
          <dd>{cliente.telefone}</dd>
          <dt>Endereço</dt>
          <dd>{cliente.endereco}</dd>
          <dt>E-mail</dt>
          <dd>{cliente.email}</dd>
          <dt>Casado</dt>
          <dd>{cliente.casado ? "Sim" : "Não"}</dd>
        </dl>
      </article>
    </>
  );
}
