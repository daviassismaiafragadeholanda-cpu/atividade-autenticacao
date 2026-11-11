import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Se as variáveis de ambiente não estiverem configuradas, o cliente fica nulo
// e as telas mostram uma mensagem em vez de quebrar a aplicação.
// Por padrão o supabase-js guarda a sessão no navegador e renova o token,
// o que mantém o usuário logado depois de atualizar a página.
export const supabase = url && chave ? createClient(url, chave) : null;

export const MENSAGEM_SEM_CONFIG =
  "As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY não estão configuradas. " +
  "Crie o arquivo .env a partir do .env.example e reinicie o servidor.";
