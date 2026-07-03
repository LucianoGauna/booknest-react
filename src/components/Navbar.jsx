import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useAuth } from "../context/useAuth";

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-3 text-sm font-medium transition ${
    isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const brandPath = isAdmin ? "/admin" : "/catalogo";

  const navItems = isAdmin
    ? [
        { label: "Dashboard", to: "/admin", end: true },
        { label: "Libros", to: "/admin/libros" },
        { label: "Préstamos", to: "/admin/prestamos" },
      ]
    : [
        { label: "Catálogo", to: "/catalogo" },
        { label: "Mis préstamos", to: "/mis-prestamos" },
      ];

  function handleLogout() {
    logout();
    setSidebarVisible(false);
    navigate("/login");
  }

  function closeSidebar() {
    setSidebarVisible(false);
  }

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <NavLink to={brandPath} className="text-xl font-bold text-blue-700">
          BookNest
        </NavLink>

        <div className="hidden items-center gap-2 md:flex">
          {user &&
            navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}

          {user ? (
            <div className="ml-4 flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {user.name} · {user.role === "admin" ? "Admin" : "Usuario"}
              </span>

              <Button
                label="Cerrar sesión"
                icon="pi pi-sign-out"
                severity="secondary"
                outlined
                className="px-2! py-1.5!"
                onClick={handleLogout}
              />
            </div>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </div>

        <Button
          icon="pi pi-bars"
          severity="secondary"
          outlined
          className="md:hidden! px-2! py-1!"
          aria-label="Abrir menú"
          onClick={() => setSidebarVisible(true)}
        />
      </nav>

      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={closeSidebar}
        header={
          <NavLink
            to={brandPath}
            onClick={closeSidebar}
            className="text-xl font-bold text-blue-700"
          >
            BookNest
          </NavLink>
        }
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {user && (
              <div className="mb-5 rounded-xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {user.role === "admin" ? "Administrador" : "Usuario común"}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {user &&
                navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeSidebar}
                    className={mobileNavLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}

              {!user && (
                <NavLink
                  to="/login"
                  onClick={closeSidebar}
                  className={mobileNavLinkClass}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>

          {user && (
            <Button
              label="Cerrar sesión"
              icon="pi pi-sign-out"
              severity="danger"
              outlined
              className="w-full py-1.5! px-2!"
              onClick={handleLogout}
            />
          )}
        </div>
      </Sidebar>
    </header>
  );
}
