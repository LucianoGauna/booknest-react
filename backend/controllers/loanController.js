import Book from "../models/Book.js";
import Loan from "../models/Loan.js";

function populateLoan(query) {
  return query
    .populate("user", "name email role")
    .populate("book", "title author genre coverUrl");
}

export async function getLoans(req, res) {
  try {
    const loans = await populateLoan(Loan.find().sort({ createdAt: -1 }));

    return res.json(loans);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los préstamos",
      error: error.message,
    });
  }
}

export async function getMyLoans(req, res) {
  try {
    const loans = await populateLoan(
      Loan.find({ user: req.user._id }).sort({ createdAt: -1 }),
    );

    return res.json(loans);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener tus préstamos",
      error: error.message,
    });
  }
}

export async function getLoanById(req, res) {
  try {
    const loan = await populateLoan(Loan.findById(req.params.id));

    if (!loan) {
      return res.status(404).json({
        message: "Préstamo no encontrado",
      });
    }

    if (
      req.user.role !== "admin" &&
      loan.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "No tenés permisos para ver este préstamo",
      });
    }

    return res.json(loan);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el préstamo",
      error: error.message,
    });
  }
}

export async function createLoan(req, res) {
  try {
    const { bookId, returnDate } = req.body;

    if (!bookId || !returnDate) {
      return res.status(400).json({
        message: "El libro y la fecha de devolución son obligatorios",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }

    if (book.stock <= 0) {
      return res.status(400).json({
        message: "No hay stock disponible para este libro",
      });
    }

    const activeLoan = await Loan.findOne({
      user: req.user._id,
      book: bookId,
      status: { $in: ["Pendiente", "Aprobado"] },
    });

    if (activeLoan) {
      return res.status(400).json({
        message: "Ya tenés un préstamo activo para este libro",
      });
    }

    const loan = await Loan.create({
      user: req.user._id,
      book: bookId,
      returnDate,
      status: "Pendiente",
    });

    const populatedLoan = await populateLoan(Loan.findById(loan._id));

    return res.status(201).json(populatedLoan);
  } catch (error) {
    return res.status(400).json({
      message: "Error al crear el préstamo",
      error: error.message,
    });
  }
}

export async function updateLoan(req, res) {
  try {
    const { status, returnDate } = req.body;

    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        message: "Préstamo no encontrado",
      });
    }

    if (req.user.role !== "admin") {
      const isOwner = loan.user.toString() === req.user._id.toString();
      const onlyCancelsOwnPendingLoan =
        isOwner && status === "Cancelado" && loan.status === "Pendiente";

      if (!onlyCancelsOwnPendingLoan) {
        return res.status(403).json({
          message: "No tenés permisos para modificar este préstamo",
        });
      }
    }

    if (status) {
      const previousStatus = loan.status;

      if (status === "Aprobado" && previousStatus !== "Aprobado") {
        const book = await Book.findById(loan.book);

        if (!book) {
          return res.status(404).json({
            message: "Libro no encontrado",
          });
        }

        if (book.stock <= 0) {
          return res.status(400).json({
            message: "No hay stock disponible para aprobar este préstamo",
          });
        }

        book.stock -= 1;
        await book.save();
      }

      if (
        previousStatus === "Aprobado" &&
        ["Devuelto", "Cancelado", "Rechazado"].includes(status)
      ) {
        await Book.findByIdAndUpdate(loan.book, {
          $inc: { stock: 1 },
        });
      }

      loan.status = status;
    }

    if (returnDate) {
      loan.returnDate = returnDate;
    }

    await loan.save();

    const populatedLoan = await populateLoan(Loan.findById(loan._id));

    return res.json(populatedLoan);
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar el préstamo",
      error: error.message,
    });
  }
}

export async function deleteLoan(req, res) {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);

    if (!loan) {
      return res.status(404).json({
        message: "Préstamo no encontrado",
      });
    }

    if (loan.status === "Aprobado") {
      await Book.findByIdAndUpdate(loan.book, {
        $inc: { stock: 1 },
      });
    }

    return res.json({
      message: "Préstamo eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el préstamo",
      error: error.message,
    });
  }
}