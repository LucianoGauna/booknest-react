import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <NavLink to="/catalogo" className="text-xl font-bold text-blue-700">
          BookNest
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink to="/catalogo" className={navLinkClass}>
            Catálogo
          </NavLink>

          <NavLink to="/mis-prestamos" className={navLinkClass}>
            Mis préstamos
          </NavLink>

          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>

          <NavLink to="/admin/libros" className={navLinkClass}>
            Libros
          </NavLink>

          <NavLink to="/admin/prestamos" className={navLinkClass}>
            Préstamos
          </NavLink>

          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>
        </div>
      </nav>
    </header>
  );
}