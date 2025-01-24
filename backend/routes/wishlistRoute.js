import express from "express";
import isAuthenticated from "../config/auth.js";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

// Wishlist routes
router.post("/add", isAuthenticated, addToWishlist);
router.delete("/remove/:stockSymbol", isAuthenticated, removeFromWishlist);
router.get("/", isAuthenticated, getWishlist);

export default router; 