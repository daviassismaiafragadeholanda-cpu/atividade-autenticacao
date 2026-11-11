// Campo de formulário com rótulo e mensagem de erro.
// Todas as props extras (type, value, onChange...) vão direto para o <input>.
export default function CampoFormulario({ id, rotulo, erro, ...propsDoInput }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        name={id}
        aria-invalid={erro ? "true" : "false"}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...propsDoInput}
      />
      {erro && (
        <p id={`${id}-erro`} className="campo-erro">
          {erro}
        </p>
      )}
    </div>
  );
}
