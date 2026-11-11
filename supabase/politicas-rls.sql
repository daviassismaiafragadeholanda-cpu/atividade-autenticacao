-- Execute no Supabase: SQL Editor > New query > Run.
-- Protege a tabela "clientes" com RLS: somente usuários autenticados podem ler.

alter table public.clientes enable row level security;

drop policy if exists "clientes_leitura_autenticados" on public.clientes;

create policy "clientes_leitura_autenticados"
  on public.clientes
  for select
  to authenticated
  using (true);

-- Não existem políticas de insert, update ou delete, então esses comandos
-- ficam bloqueados para a chave pública. Visitantes sem login (role anon)
-- também não enxergam nenhuma linha.

-- Para desfazer (voltar ao modo da atividade anterior):
-- alter table public.clientes disable row level security;
