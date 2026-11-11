import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, loading } = useAuth();

  const classeDoLink = ({ isActive }) =>
    isActive ? "menu-link ativo" : "menu-link";

  return (
    <header className="topo">
      <div className="topo-interno">
        <Link to="/" className="marca">
          Clientes
        </Link>
        <nav aria-label="Principal" className="menu">
          <NavLink to="/" end className={classeDoLink}>
            Início
          </NavLink>

          {/* Links privados só aparecem para quem está autenticado */}
          {!loading && user && (
            <>
              <NavLink to="/dashboard" className={classeDoLink}>
                Dashboard
              </NavLink>
              <NavLink to="/registros" className={classeDoLink}>
                Registros
              </NavLink>
              <NavLink to="/perfil" className={classeDoLink}>
                Perfil
              </NavLink>
            </>
          )}

          {!loading && !user && (
            <>
              <NavLink to="/login" className={classeDoLink}>
                Entrar
              </NavLink>
              <NavLink to="/registro" className={classeDoLink}>
                Criar conta
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
