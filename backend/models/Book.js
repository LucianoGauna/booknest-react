import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "El autor es obligatorio"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "El género es obligatorio"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "El año es obligatorio"],
      min: [1, "El año debe ser válido"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    coverUrl: {
      type: String,
      required: [true, "La URL de portada es obligatoria"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;