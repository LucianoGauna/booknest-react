import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <NavLink to="/catalogo" className="text-xl font-bold text-blue-700">
          BookNest
        </NavLink>

        <div className="flex items-center gap-2">
          {user && !isAdmin && (
            <>
              <NavLink to="/catalogo" className={navLinkClass}>
                Catálogo
              </NavLink>

              <NavLink to="/mis-prestamos" className={navLinkClass}>
                Mis préstamos
              </NavLink>
            </>
          )}

          {user && isAdmin && (
            <>
              <NavLink to="/admin" className={navLinkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/admin/libros" className={navLinkClass}>
                Libros
              </NavLink>

              <NavLink to="/admin/prestamos" className={navLinkClass}>
                Préstamos
              </NavLink>
            </>
          )}

          {user ? (
            <div className="ml-4 flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {user.name} · {user.role === "admin" ? "Admin" : "Usuario"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}