import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { LibraryContext } from "./useLibrary";
import { useAuth } from "./useAuth";

function normalizeBook(book) {
  return {
    ...book,
    id: book._id || book.id,
    cover: book.coverUrl || book.cover,
  };
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return String(dateValue).slice(0, 10);
}

function normalizeLoan(loan) {
  const loanUser =
    typeof loan.user === "object" && loan.user !== null ? loan.user : null;

  const loanBook =
    typeof loan.book === "object" && loan.book !== null ? loan.book : null;

  return {
    ...loan,
    id: loan._id || loan.id,
    userId: loanUser?._id || loanUser?.id || loan.userId || loan.user,
    bookId: loanBook?._id || loanBook?.id || loan.bookId || loan.book,
    userName: loanUser?.name || loan.userName || "Usuario eliminado",
    userEmail: loanUser?.email || loan.userEmail || "-",
    bookTitle: loanBook?.title || loan.bookTitle || "Libro eliminado",
    bookAuthor: loanBook?.author || loan.bookAuthor || "-",
    requestDate: formatDate(loan.requestDate),
    returnDate: formatDate(loan.returnDate),
    book: loanBook ? normalizeBook(loanBook) : loan.book,
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
  const { user, isAdmin } = useAuth();

  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
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

  useEffect(() => {
    async function loadInitialLoans() {
      if (!user) {
        return;
      }

      const endpoint = isAdmin ? "/loans" : "/loans/my-loans";
      const data = await apiRequest(endpoint, {
        auth: true,
      });

      setLoans(data.map(normalizeLoan));
    }

    loadInitialLoans();
  }, [user, isAdmin]);

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

  async function requestLoan({ bookId, returnDate }) {
    try {
      const createdLoan = await apiRequest("/loans", {
        method: "POST",
        body: {
          bookId,
          returnDate,
        },
        auth: true,
      });

      const normalizedLoan = normalizeLoan(createdLoan);

      setLoans((currentLoans) => [normalizedLoan, ...currentLoans]);

      return {
        success: true,
        loan: normalizedLoan,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async function cancelLoan(loanId) {
    const updatedLoan = await apiRequest(`/loans/${loanId}`, {
      method: "PUT",
      body: {
        status: "Cancelado",
      },
      auth: true,
    });

    setLoans((currentLoans) =>
      currentLoans.map((loan) =>
        loan.id === loanId ? normalizeLoan(updatedLoan) : loan,
      ),
    );
  }

  async function updateLoanStatus(loanId, status) {
    const updatedLoan = await apiRequest(`/loans/${loanId}`, {
      method: "PUT",
      body: {
        status,
      },
      auth: true,
    });

    setLoans((currentLoans) =>
      currentLoans.map((loan) =>
        loan.id === loanId ? normalizeLoan(updatedLoan) : loan,
      ),
    );

    await loadBooks();
  }

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
