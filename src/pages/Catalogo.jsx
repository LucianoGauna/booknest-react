import { useState } from "react";
import BookCard from "../components/BookCard";
import PageHeader from "../components/PageHeader";
import { useLibrary } from "../context/useLibrary";
import { Dropdown } from "primereact/dropdown";

export default function Catalogo() {
  const { books } = useLibrary();

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");

  const genres = ["Todos", ...new Set(books.map((book) => book.genre))];

  const filteredBooks = books.filter((book) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      book.title.toLowerCase().includes(searchValue) ||
      book.author.toLowerCase().includes(searchValue);

    const matchesGenre =
      selectedGenre === "Todos" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <section>
      <PageHeader
        title="Catálogo de libros"
        description="Explorá los libros disponibles en BookNest y solicitá préstamos desde el detalle de cada obra."
      />

      <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <div>
          <label
            htmlFor="search"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Buscar por título o autor
          </label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ej: Orwell, El principito..."
            className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="genre"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Género
          </label>

          <Dropdown
            id="genre"
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.value)}
            options={genres}
            placeholder="Seleccioná un género"
            className="w-full"
          />
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            No se encontraron libros
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Probá con otro título, autor o género.
          </p>
        </div>
      )}
    </section>
  );
}
