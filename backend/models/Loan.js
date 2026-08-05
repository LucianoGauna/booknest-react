import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "El libro es obligatorio"],
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      required: [true, "La fecha de devolución es obligatoria"],
    },
    status: {
      type: String,
      enum: ["Pendiente", "Aprobado", "Rechazado", "Devuelto", "Cancelado"],
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
  },
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;