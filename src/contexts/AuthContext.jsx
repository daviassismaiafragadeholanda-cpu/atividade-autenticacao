import { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

// O contexto NÃO faz a autenticação (isso é do Supabase Auth).
// Ele só guarda o estado da sessão e o compartilha com os componentes.
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;

    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1) Ao iniciar a aplicação, recupera a sessão que já existir.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!ativo) return;
        setUser(data.session?.user ?? null);
      })
      .catch(() => {
        if (ativo) setUser(null);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    // 2) Acompanha mudanças: login, logout, renovação do token etc.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      setUser(sessao?.user ?? null);
      setLoading(false);
    });

    // 3) Ao desmontar, cancela a inscrição do listener.
    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (!supabase) {
      return { error: new Error("Supabase não configurado.") };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
