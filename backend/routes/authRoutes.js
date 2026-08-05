import express from "express";
import { login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  res.json({
    user: req.user,
  });
});

export default router;