import express from "express";
import {
  getLoans,
  getMyLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
} from "../controllers/loanController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getLoans);
router.get("/my-loans", protect, getMyLoans);
router.get("/:id", protect, getLoanById);
router.post("/", protect, createLoan);
router.put("/:id", protect, updateLoan);
router.delete("/:id", protect, authorizeRoles("admin"), deleteLoan);

export default router;