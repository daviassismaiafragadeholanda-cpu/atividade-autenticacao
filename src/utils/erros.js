// Traduz os erros do Supabase Auth para mensagens claras em português.
export function traduzirErroAuth(error) {
  if (error?.name === "AuthRetryableFetchError") {
    return "Não foi possível conectar ao Supabase. Verifique sua conexão.";
  }

  switch (error?.code) {
    case "invalid_credentials":
      return "E-mail ou senha incorretos.";
    case "email_not_confirmed":
      return "Seu e-mail ainda não foi confirmado. Abra o e-mail que enviamos e clique no link de confirmação.";
    case "user_already_exists":
    case "email_exists":
      return "Este e-mail já está cadastrado. Tente entrar.";
    case "weak_password":
      return "A senha é fraca demais. Escolha uma senha mais forte.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.";
    case "signup_disabled":
      return "O cadastro de novos usuários está desativado neste projeto.";
    default:
      return error?.message || "Ocorreu um erro inesperado. Tente novamente.";
  }
}
