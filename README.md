# Atividade Prática: Autenticação com React Router e Supabase

**Disciplina:** Frameworks Front-end
**Integrantes:** Davi Assis Maia Fraga de Holanda e Gustavo Carvalho Colaço

Evolução do projeto das atividades anteriores. A aplicação ganhou cadastro, login e logout com **Supabase Auth**, o estado da sessão é compartilhado com a **Context API** e as páginas privadas são protegidas com o **React Router**. A tabela `clientes` é a mesma de antes, agora protegida com **RLS**.

## Tecnologias

- React 19 e Vite
- React Router 7 (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `Navigate`, `Outlet`, `useNavigate`, `useParams`)
- Supabase Auth e Supabase Client (`@supabase/supabase-js`)
- Context API, `useState`, `useEffect` e `useContext`

## Rotas

| Rota               | Página                | Acesso       |
| ------------------ | --------------------- | ------------ |
| `/`                | Página inicial        | Público      |
| `/login`           | Login                 | Público      |
| `/registro`        | Cadastro              | Público      |
| `/dashboard`       | Dashboard             | Autenticado  |
| `/registros`       | Listagem de clientes  | Autenticado  |
| `/registros/:id`   | Detalhes do cliente   | Autenticado  |
| `/perfil`          | Perfil do usuário     | Autenticado  |
| `*`                | Página 404            | Público      |

Quem tenta abrir uma rota protegida sem estar logado é enviado para `/login`.

## Como executar

Requisito: Node.js 20 ou superior.

### 1. Configurar o Supabase

1. Em **Authentication > Sign In / Providers**, confirme que o provedor **Email** está ativado.
2. Em **SQL Editor**, rode o conteúdo de `supabase/politicas-rls.sql`. Ele liga a RLS na tabela `clientes` e libera a leitura só para usuários autenticados.
3. Em **Authentication > URL Configuration**, defina a **Site URL** como `http://localhost:5173`, para o link do e-mail de confirmação abrir a aplicação.
4. Sobre a confirmação de e-mail:
   - **Ligada** (padrão): após o cadastro, o usuário precisa clicar no link enviado por e-mail antes de entrar. A aplicação mostra essa orientação.
   - **Desligada** (Authentication > Sign In / Providers > Email > Confirm email): o usuário já entra logado ao se cadastrar. É mais prático para testar.

### 2. Rodar a aplicação

```bash
npm install
cp .env.example .env
```

No Windows (PowerShell): `copy .env.example .env`

Preencha o `.env` com os dados do projeto (Project Settings > API Keys):

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

Depois inicie:

```bash
npm run dev
```

Abra http://localhost:5173.

## Segurança

- O `.env` está no `.gitignore` e não vai para o repositório.
- Só a chave pública (*publishable*/*anon*) é usada no front-end. A `service_role`/*secret key* nunca entra neste projeto.
- Com a RLS ligada, quem não está logado recebe lista vazia ao consultar `clientes` pela API, inclusive pelo Postman com a chave pública.

## Estrutura

```
src/
├── components/
│   ├── ProtectedRoute.jsx   # barra rotas privadas (Navigate + Outlet)
│   ├── Navbar.jsx           # menu muda conforme o login
│   ├── BotaoSair.jsx        # logout
│   ├── CampoFormulario.jsx  # campo com rótulo e erro (props)
│   ├── ClienteItem.jsx
│   └── Mensagem.jsx
├── contexts/AuthContext.jsx # user, loading e signOut
├── hooks/useAuth.js         # useContext do AuthContext
├── pages/                   # Home, Login, Registro, Dashboard,
│                            # Registros, Detalhes, Perfil, Pagina404
├── services/supabaseClient.js
├── utils/                   # validação de e-mail e tradução de erros
├── App.jsx                  # rotas
└── main.jsx                 # BrowserRouter + AuthProvider
supabase/politicas-rls.sql   # políticas da tabela clientes
```

## Perguntas

**1. Qual é a responsabilidade do Supabase Auth dentro da aplicação?**
Ele cuida de toda a parte de identidade: cria a conta, guarda a senha de forma segura (criptografada), confere e-mail e senha no login, envia o e-mail de confirmação, emite o token (JWT) da sessão e o renova. A aplicação nunca guarda nem enxerga a senha do usuário depois de enviá-la.

**2. Por que utilizamos a Context API para compartilhar as informações do usuário autenticado?**
Porque vários componentes precisam saber quem está logado: a `Navbar`, o `ProtectedRoute`, o `Dashboard`, o `Perfil` e o formulário de login. Com o contexto, a informação fica em um lugar só e qualquer componente a lê com `useAuth()`, sem passar props por todos os níveis.

**3. Qual é a diferença entre utilizar `useState` diretamente em cada componente e utilizar um contexto global de autenticação?**
Com `useState` em cada componente, cada um precisaria buscar a sessão e escutar as mudanças por conta própria. Isso repete código, faz várias consultas iguais e permite que um componente ache que o usuário está logado enquanto outro acha que não. O contexto tem uma única fonte da verdade: a sessão é verificada uma vez, e todos os componentes recebem a mesma informação ao mesmo tempo.

**4. O que acontece quando um usuário tenta acessar uma rota protegida sem estar autenticado?**
O `ProtectedRoute` lê o contexto. Enquanto `loading` está verdadeiro, mostra "Verificando sua sessão...". Quando termina e não há `user`, ele devolve um `<Navigate to="/login" replace />`, e a página privada nem chega a ser desenhada.

**5. Qual é a função do método `onAuthStateChange()`?**
Ele registra uma função que o Supabase chama sempre que o estado de autenticação muda: login, logout, renovação do token ou sessão recuperada. Assim o contexto se atualiza sozinho, sem precisar recarregar a página. Ele devolve uma inscrição (`subscription`) que é cancelada com `unsubscribe()` quando o componente é desmontado, para não deixar o listener ativo à toa.

**6. Por que a proteção de rotas com React Router não é suficiente para garantir a segurança dos dados?**
O código do front-end roda no navegador do usuário, que pode alterá-lo ou simplesmente ignorá-lo. A API do Supabase fica aberta na internet e pode ser chamada direto, sem passar pela interface, com a chave pública (como no Postman). Por isso quem realmente impede o acesso indevido é a RLS no banco: ela confere o usuário em cada consulta. A proteção das rotas melhora a experiência, mas a segurança está no banco.

**7. Qual é a diferença entre autenticação e autorização?**
Autenticação é provar quem você é, por exemplo com e-mail e senha. Autorização é definir o que essa pessoa pode fazer ou ver depois de identificada. Neste projeto, o Supabase Auth faz a autenticação, e as rotas protegidas e as políticas RLS fazem a autorização. Estar logado não basta: sem uma política que permita a leitura, a tabela não devolve nada.
