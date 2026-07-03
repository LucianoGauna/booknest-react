import { useRef, useState } from "react";
import { books as initialBooks } from "../data/books";
import { loans as initialLoans } from "../data/loans";
import { LibraryContext } from "./useLibrary";

const BOOKS_STORAGE_KEY = "booknest_books";
const LOANS_STORAGE_KEY = "booknest_loans";

function getStoredData(key, fallbackData) {
  const storedData = localStorage.getItem(key);

  if (!storedData) {
    return fallbackData;
  }

  return JSON.parse(storedData);
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() =>
    getStoredData(BOOKS_STORAGE_KEY, initialBooks),
  );

  const [loans, setLoans] = useState(() =>
    getStoredData(LOANS_STORAGE_KEY, initialLoans),
  );

  const booksRef = useRef(books);
  const loansRef = useRef(loans);

  function saveBooks(nextBooks) {
    booksRef.current = nextBooks;
    setBooks(nextBooks);
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(nextBooks));
  }

  function saveLoans(nextLoans) {
    loansRef.current = nextLoans;
    setLoans(nextLoans);
    localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(nextLoans));
  }

  function addBook(bookData) {
    const currentBooks = booksRef.current;

    const newBook = {
      id: Date.now(),
      ...bookData,
      year: Number(bookData.year),
      stock: Number(bookData.stock),
    };

    saveBooks([...currentBooks, newBook]);
  }

  function updateBook(bookId, bookData) {
    const currentBooks = booksRef.current;

    const nextBooks = currentBooks.map((book) =>
      book.id === Number(bookId)
        ? {
            ...book,
            ...bookData,
            year: Number(bookData.year),
            stock: Number(bookData.stock),
          }
        : book,
    );

    saveBooks(nextBooks);
  }

  function deleteBook(bookId) {
    const currentBooks = booksRef.current;
    const nextBooks = currentBooks.filter((book) => book.id !== Number(bookId));

    saveBooks(nextBooks);
  }

  function requestLoan({ userId, bookId, returnDate }) {
    const currentBooks = booksRef.current;
    const currentLoans = loansRef.current;

    const hasActiveLoan = currentLoans.some(
      (loan) =>
        loan.userId === Number(userId) &&
        loan.bookId === Number(bookId) &&
        ["Pendiente", "Aprobado"].includes(loan.status),
    );

    if (hasActiveLoan) {
      return {
        success: false,
        message: "Ya tenés una solicitud activa para este libro.",
      };
    }

    const book = currentBooks.find((item) => item.id === Number(bookId));

    if (!book || book.stock <= 0) {
      return {
        success: false,
        message: "El libro no tiene stock disponible.",
      };
    }

    const newLoan = {
      id: Date.now(),
      userId: Number(userId),
      bookId: Number(bookId),
      requestDate: new Date().toISOString().slice(0, 10),
      returnDate,
      status: "Pendiente",
    };

    saveLoans([...currentLoans, newLoan]);

    return {
      success: true,
      loan: newLoan,
    };
  }

  function cancelLoan(loanId) {
    const currentLoans = loansRef.current;

    const nextLoans = currentLoans.map((loan) =>
      loan.id === Number(loanId) ? { ...loan, status: "Cancelado" } : loan,
    );

    saveLoans(nextLoans);
  }

  function updateLoanStatus(loanId, status) {
    const currentBooks = booksRef.current;
    const currentLoans = loansRef.current;

    const loan = currentLoans.find((item) => item.id === Number(loanId));

    if (!loan) {
      return;
    }

    const nextLoans = currentLoans.map((item) =>
      item.id === Number(loanId) ? { ...item, status } : item,
    );

    let nextBooks = currentBooks;

    if (status === "Aprobado" && loan.status !== "Aprobado") {
      nextBooks = currentBooks.map((book) =>
        book.id === loan.bookId
          ? { ...book, stock: Math.max(Number(book.stock) - 1, 0) }
          : book,
      );
    }

    if (status === "Devuelto" && loan.status === "Aprobado") {
      nextBooks = currentBooks.map((book) =>
        book.id === loan.bookId
          ? { ...book, stock: Number(book.stock) + 1 }
          : book,
      );
    }

    saveLoans(nextLoans);
    saveBooks(nextBooks);
  }

  return (
    <LibraryContext.Provider
      value={{
        books,
        loans,
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
