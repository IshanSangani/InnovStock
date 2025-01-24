import { Wishlist } from "../models/wishlistSchema.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        console.log("1. Request received:", {
            body: req.body,
            user: req.user,
            cookies: req.cookies
        });

        const { stockName, stockSymbol, sector } = req.body;
        
        if (!req.user || !req.user._id) {
            console.log("2. No user found in request");
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        if (!stockName || !stockSymbol || !sector) {
            console.log("3. Missing required fields");
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let wishlist = await Wishlist.findOne({ userId: req.user._id });
        console.log("4. Existing wishlist:", wishlist);

        if (!wishlist) {
            console.log("5. Creating new wishlist");
            wishlist = await Wishlist.create({
                userId: req.user._id,
                stocks: []
            });
        }

        const stockExists = wishlist.stocks.find(stock => stock.stockSymbol === stockSymbol);
        
        if (stockExists) {
            console.log("6. Stock already exists");
            return res.status(400).json({
                success: false,
                message: "Stock already in wishlist"
            });
        }

        wishlist.stocks.push({
            stockName,
            stockSymbol,
            sector
        });

        const savedWishlist = await wishlist.save();
        console.log("7. Wishlist saved successfully");

        res.status(200).json({
            success: true,
            message: "Stock added to wishlist",
            wishlist: savedWishlist
        });

    } catch (error) {
        console.error("8. Error in addToWishlist:", {
            error: error.message,
            stack: error.stack,
            user: req?.user,
            body: req?.body
        });
        
        res.status(500).json({
            success: false,
            message: "Error adding to wishlist",
            error: error.message
        });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { stockSymbol } = req.params;
        
        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        // Remove stock
        wishlist.stocks = wishlist.stocks.filter(stock => stock.stockSymbol !== stockSymbol);
        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Stock removed from wishlist",
            wishlist
        });

    } catch (error) {
        console.error("Wishlist remove error:", error);
        res.status(500).json({
            success: false,
            message: "Error removing from wishlist",
            error: error.message
        });
    }
};

// Get wishlist
export const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        
        if (!wishlist) {
            return res.status(200).json({
                success: true,
                wishlist: []
            });
        }

        res.status(200).json({
            success: true,
            wishlist: wishlist.stocks
        });

    } catch (error) {
        console.error("Wishlist get error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching wishlist",
            error: error.message
        });
    }
}; 