import { useState } from "react";

export default function LoanRequestForm({ book, onSubmit }) {
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const hasStock = book.stock > 0;

  function handleSubmit(event) {
    event.preventDefault();

    if (!returnDate) {
      setError("Seleccioná una fecha estimada de devolución.");
      return;
    }

    if (returnDate < today) {
      setError("La fecha de devolución no puede ser anterior a hoy.");
      return;
    }

    const result = onSubmit(returnDate);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">Solicitar préstamo</h2>

      <p className="mt-2 text-sm text-slate-500">
        Elegí una fecha estimada para devolver el libro. La solicitud quedará
        pendiente hasta que un administrador la apruebe.
      </p>

      <div className="mt-5">
        <label
          htmlFor="returnDate"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Fecha estimada de devolución
        </label>

        <input
          id="returnDate"
          type="date"
          min={today}
          value={returnDate}
          onChange={(event) => {
            setReturnDate(event.target.value);
            setError("");
          }}
          disabled={!hasStock}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {!hasStock && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Este libro no tiene stock disponible en este momento.
        </p>
      )}

      <button
        type="submit"
        disabled={!hasStock}
        className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Solicitar préstamo
      </button>
    </form>
  );
}
