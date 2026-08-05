import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", protect, authorizeRoles("admin"), createBook);
router.put("/:id", protect, authorizeRoles("admin"), updateBook);
router.delete("/:id", protect, authorizeRoles("admin"), deleteBook);

export default router;