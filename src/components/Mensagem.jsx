// Componente reutilizável para estados de carregamento, erro, sucesso e lista vazia.
// Recebe os dados por props: tipo ("carregando" | "erro" | "sucesso" | "vazio"), titulo e texto.
export default function Mensagem({ tipo = "vazio", titulo, texto, children }) {
  const papel = tipo === "erro" ? "alert" : "status";

  return (
    <div className={`mensagem mensagem-${tipo}`} role={papel}>
      {titulo && <h2 className="mensagem-titulo">{titulo}</h2>}
      {texto && <p className="mensagem-texto">{texto}</p>}
      {children}
    </div>
  );
}
