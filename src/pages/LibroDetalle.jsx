import { Link, useNavigate, useParams } from "react-router-dom";
import LoanRequestForm from "../components/LoanRequestForm";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/useAuth";
import { useLibrary } from "../context/useLibrary";

export default function LibroDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { books, requestLoan } = useLibrary();

  const book = books.find((item) => item.id === Number(id));

  if (!book) {
    return (
      <section>
        <PageHeader
          title="Libro no encontrado"
          description="El libro que estás buscando no existe o fue eliminado."
        />

        <Link
          to="/catalogo"
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const hasStock = book.stock > 0;
  const canRequestLoan = user?.role === "user";

  function handleRequestLoan(returnDate) {
    const result = requestLoan({
      userId: user.id,
      bookId: book.id,
      returnDate,
    });

    if (result.success) {
      navigate("/mis-prestamos");
    }

    return result;
  }

  return (
    <section>
      <PageHeader
        title={book.title}
        description="Detalle del libro seleccionado y solicitud de préstamo."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-80 overflow-hidden bg-slate-200">
            <img
              src={book.cover}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {book.genre}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  hasStock
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {hasStock ? `Stock disponible: ${book.stock}` : "Sin stock"}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                Año {book.year}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {book.title}
              </h2>

              <p className="mt-1 text-slate-500">{book.author}</p>
            </div>

            <p className="leading-7 text-slate-600">{book.description}</p>

            <Link
              to="/catalogo"
              className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Volver al catálogo
            </Link>
          </div>
        </article>

        <aside>
          {canRequestLoan ? (
            <LoanRequestForm book={book} onSubmit={handleRequestLoan} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Vista de administrador
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Los administradores pueden consultar el detalle del libro, pero
                las solicitudes de préstamo están disponibles para usuarios
                comunes.
              </p>

              <Link
                to="/admin/libros"
                className="mt-5 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Gestionar libros
              </Link>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}