/* global process */

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDatabase } from "./config/database.js";
import User from "./models/User.js";
import Book from "./models/Book.js";
import Loan from "./models/Loan.js";

dotenv.config();

async function seedDatabase() {
  try {
    await connectDatabase();

    await Loan.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      name: "Administrador BookNest",
      email: "admin@booknest.com",
      password: hashedPassword,
      role: "admin",
    });

    const user = await User.create({
      name: "Luciano Gauna",
      email: "luciano@booknest.com",
      password: hashedPassword,
      role: "user",
    });

    const books = await Book.insertMany([
      {
        title: "El principito",
        author: "Antoine de Saint-Exupéry",
        genre: "Ficción",
        year: 1943,
        stock: 3,
        description:
          "Una historia breve sobre la amistad, la imaginación y la forma en que miramos el mundo.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/741890-b9f18774f09390009a17709071276792-1024-1024.webp",
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "Distopía",
        year: 1949,
        stock: 2,
        description:
          "Una novela distópica sobre vigilancia, poder y manipulación social.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/740168-89911569655746cdd817674518150640-1024-1024.webp",
      },
      {
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        genre: "Ciencia ficción",
        year: 1953,
        stock: 1,
        description:
          "Una sociedad futura donde los libros están prohibidos y los bomberos queman bibliotecas.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/9788445022191-322aa6df797bb191b917788692977603-1024-1024.webp",
      },
      {
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Realismo mágico",
        year: 1967,
        stock: 4,
        description:
          "La historia de la familia Buendía y del pueblo de Macondo, atravesada por memoria, destino y fantasía.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/723610-1bb0fa4aa7ceab2a3617513906531936-1024-1024.webp",
      },
      {
        title: "Rayuela",
        author: "Julio Cortázar",
        genre: "Novela",
        year: 1963,
        stock: 2,
        description:
          "Una obra experimental que propone distintas formas de lectura y recorre vínculos, búsqueda personal y vida urbana.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/645076-80c5cdd5b9e74e718917274867106882-1024-1024.webp",
      },
      {
        title: "Orgullo y prejuicio",
        author: "Jane Austen",
        genre: "Romance",
        year: 1813,
        stock: 3,
        description:
          "Una novela sobre relaciones, clase social y prejuicios personales, centrada en Elizabeth Bennet y Fitzwilliam Darcy.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/726226-c44a99185aba56fc8317429879096676-1024-1024.webp",
      },
      {
        title: "La sombra del viento",
        author: "Carlos Ruiz Zafón",
        genre: "Misterio",
        year: 2001,
        stock: 2,
        description:
          "Una historia ambientada en Barcelona donde un joven descubre un libro que cambiará su vida.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/704793-149a9ea3e8ecdbdad817795632233960-1024-1024.webp",
      },
      {
        title: "El nombre del viento",
        author: "Patrick Rothfuss",
        genre: "Fantasía",
        year: 2007,
        stock: 0,
        description:
          "La vida de Kvothe, músico, mago y aventurero, narrada desde sus propios recuerdos.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/499675-6395b038e51abf272117285263142665-1024-1024.webp",
      },
      {
        title: "Crónica de una muerte anunciada",
        author: "Gabriel García Márquez",
        genre: "Novela",
        year: 1981,
        stock: 5,
        description:
          "La reconstrucción de un crimen anunciado, contado desde múltiples voces y recuerdos.",
        coverUrl:
          "https://acdn-us.mitiendanube.com/stores/004/088/117/products/402677-b11b142c408d81207517285883970775-1024-1024.webp",
      },
    ]);

    await Loan.create({
      user: user._id,
      book: books[0]._id,
      returnDate: new Date("2026-12-20"),
      status: "Pendiente",
    });

    console.log("Seed ejecutado correctamente");
    console.log("Usuarios creados:");
    console.log("- admin@booknest.com / 123456");
    console.log("- luciano@booknest.com / 123456");
    console.log(`Libros creados: ${books.length}`);
    console.log("Préstamo inicial creado");
    console.log(`Usuario admin creado: ${admin.email}`);
  } catch (error) {
    console.error("Error al ejecutar el seed:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seedDatabase();