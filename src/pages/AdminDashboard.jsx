import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import PageHeader from "../components/PageHeader";
import LoanStatusTag from "../components/LoanStatusTag";
import { users } from "../data/users";
import { useLibrary } from "../context/useLibrary";

export default function AdminDashboard() {
  const { books, loans } = useLibrary();

  const totalBooks = books.length;
  const totalStock = books.reduce((acc, book) => acc + Number(book.stock), 0);
  const pendingLoans = loans.filter((loan) => loan.status === "Pendiente").length;
  const approvedLoans = loans.filter((loan) => loan.status === "Aprobado").length;
  const outOfStockBooks = books.filter((book) => book.stock === 0).length;

  const latestLoans = loans.slice(-5).reverse();

  function getBookTitle(bookId) {
    const book = books.find((item) => item.id === bookId);
    return book?.title || "Libro eliminado";
  }

  function getUserName(userId) {
    const user = users.find((item) => item.id === userId);
    return user?.name || "Usuario eliminado";
  }

  return (
    <section>
      <PageHeader
        title="Panel de administrador"
        description="Resumen general del catálogo y las solicitudes de préstamo de BookNest."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="shadow-sm">
          <p className="text-sm font-medium text-slate-500">Libros cargados</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalBooks}</p>
        </Card>

        <Card className="shadow-sm">
          <p className="text-sm font-medium text-slate-500">Stock total</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalStock}</p>
        </Card>

        <Card className="shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {pendingLoans}
          </p>
        </Card>

        <Card className="shadow-sm">
          <p className="text-sm font-medium text-slate-500">Aprobados</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {approvedLoans}
          </p>
        </Card>

        <Card className="shadow-sm">
          <p className="text-sm font-medium text-slate-500">Sin stock</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {outOfStockBooks}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Últimos préstamos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Solicitudes más recientes registradas en el sistema.
              </p>
            </div>

            <Link to="/admin/prestamos">
              <Button className="px-2! py-1!" label="Ver todos" icon="pi pi-arrow-right" outlined />
            </Link>
          </div>

          {latestLoans.length > 0 ? (
            <div className="space-y-3">
              {latestLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {getBookTitle(loan.bookId)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {getUserName(loan.userId)} · Solicitud:{" "}
                      {loan.requestDate}
                    </p>
                  </div>

                  <LoanStatusTag status={loan.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="font-medium text-slate-700">
                No hay préstamos registrados.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Cuando un usuario solicite un libro, aparecerá en esta sección.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Accesos rápidos</h2>

          <div className="mt-5 space-y-3">
            <Link to="/admin/libros" className="block">
              <Button
                label="Gestionar libros"
                icon="pi pi-book"
                className="w-full"
              />
            </Link>

            <Link to="/admin/prestamos" className="block">
              <Button
                label="Gestionar préstamos"
                icon="pi pi-list"
                severity="info"
                className="w-full"
              />
            </Link>

            <Link to="/catalogo" className="block">
              <Button
                label="Ver catálogo"
                icon="pi pi-search"
                severity="secondary"
                outlined
                className="w-full"
              />
            </Link>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Estado general
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Tag value={`${totalBooks} libros`} severity="info" />
              <Tag value={`${pendingLoans} pendientes`} severity="warning" />
              <Tag value={`${outOfStockBooks} sin stock`} severity="danger" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}