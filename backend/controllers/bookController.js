import Book from "../models/Book.js";
import Loan from "../models/Loan.js";

export async function getBooks(req, res) {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los libros",
      error: error.message,
    });
  }
}

export async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }

    return res.json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el libro",
      error: error.message,
    });
  }
}

export async function createBook(req, res) {
  try {
    const book = await Book.create(req.body);

    return res.status(201).json(book);
  } catch (error) {
    return res.status(400).json({
      message: "Error al crear el libro",
      error: error.message,
    });
  }
}

export async function updateBook(req, res) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }

    return res.json(book);
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar el libro",
      error: error.message,
    });
  }
}

export async function deleteBook(req, res) {
  try {
    const activeLoans = await Loan.countDocuments({
      book: req.params.id,
      status: { $in: ["Pendiente", "Aprobado"] },
    });

    if (activeLoans > 0) {
      return res.status(400).json({
        message:
          "No se puede eliminar el libro porque tiene préstamos pendientes o aprobados",
      });
    }

    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }

    return res.json({
      message: "Libro eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el libro",
      error: error.message,
    });
  }
}
