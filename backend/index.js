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
    origin: [
        "https://innov-stock.vercel.app",
        "http://localhost:3000"  // Add this for local development
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['Set-Cookie', '*', 'Authorization']
};

app.use(cors(corsOptions));

// Update the middleware to handle both production and development origins
app.use((req, res, next) => {
    const allowedOrigins = ['https://innov-stock.vercel.app', 'http://localhost:3000'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Connect to database before setting up routes
await databaseConnection();

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/wishlist", wishlistRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        success: false
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});


