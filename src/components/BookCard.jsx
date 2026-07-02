import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  const hasStock = book.stock > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="h-48 overflow-hidden bg-slate-200">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {book.genre}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasStock
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {hasStock ? `Stock: ${book.stock}` : "Sin stock"}
            </span>
          </div>

          <h2 className="line-clamp-1 text-xl font-bold text-slate-900">
            {book.title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {book.author} · {book.year}
          </p>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {book.description}
        </p>

        <Link
          to={`/libros/${book.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
