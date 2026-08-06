import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { LibraryContext } from "./useLibrary";

function normalizeBook(book) {
  return {
    ...book,
    id: book._id || book.id,
    cover: book.coverUrl || book.cover,
  };
}

function toBookPayload(bookData) {
  return {
    title: bookData.title,
    author: bookData.author,
    genre: bookData.genre,
    year: Number(bookData.year),
    stock: Number(bookData.stock),
    description: bookData.description,
    coverUrl: bookData.cover || bookData.coverUrl,
  };
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loans] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const loadBooks = useCallback(async () => {
    setLoadingBooks(true);

    try {
      const data = await apiRequest("/books");
      setBooks(data.map(normalizeBook));
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  useEffect(() => {
    async function loadInitialBooks() {
      try {
        const data = await apiRequest("/books");
        setBooks(data.map(normalizeBook));
      } finally {
        setLoadingBooks(false);
      }
    }

    loadInitialBooks();
  }, []);

  async function addBook(bookData) {
    const createdBook = await apiRequest("/books", {
      method: "POST",
      body: toBookPayload(bookData),
      auth: true,
    });

    setBooks((currentBooks) => [normalizeBook(createdBook), ...currentBooks]);
  }

  async function updateBook(bookId, bookData) {
    const updatedBook = await apiRequest(`/books/${bookId}`, {
      method: "PUT",
      body: toBookPayload(bookData),
      auth: true,
    });

    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === bookId ? normalizeBook(updatedBook) : book,
      ),
    );
  }

  async function deleteBook(bookId) {
    await apiRequest(`/books/${bookId}`, {
      method: "DELETE",
      auth: true,
    });

    setBooks((currentBooks) =>
      currentBooks.filter((book) => book.id !== bookId),
    );
  }

  async function requestLoan() {
    return {
      success: false,
      message: "La gestión de préstamos se conectará en el siguiente paso.",
    };
  }

  async function cancelLoan() {}

  async function updateLoanStatus() {}

  return (
    <LibraryContext.Provider
      value={{
        books,
        loans,
        loadingBooks,
        loadBooks,
        addBook,
        updateBook,
        deleteBook,
        requestLoan,
        cancelLoan,
        updateLoanStatus,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
