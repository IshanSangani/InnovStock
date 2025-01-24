import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import cors from "cors";





dotenv.config({
    path:".env"
})

const app = express(); 

// middlewares
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:3000", "https://your-frontend-url.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['*', 'Authorization']
}
app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Connect to database
(async () => {
    try {
        await databaseConnection();
        // Only set up routes after DB connection attempt
        app.use("/api/v1/user", userRoute);
        app.use("/api/v1/tweet", tweetRoute);
        app.use("/api/v1/wishlist", wishlistRoute);
    } catch (error) {
        console.error('Failed to connect to database:', error);
        // Continue anyway to allow health check endpoint
    }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});


