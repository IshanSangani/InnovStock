import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import cors from "cors";

dotenv.config();
const app = express();

// Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:3000", "https://your-frontend-url.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization']
};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Initialize routes before DB connection
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/wishlist", wishlistRoute);

// Connect to database in background
databaseConnection().catch(console.error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});


