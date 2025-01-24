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
databaseConnection();
const app = express(); 

// middlewares
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: true, // This will allow all origins during development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization']
};
app.use(cors(corsOptions));

// Add this before your routes to debug requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        body: req.body,
        cookies: req.cookies
    });
    next();
});

// api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/wishlist", wishlistRoute);

// Add this before your other routes
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});
 

app.listen(process.env.PORT,() => {
    console.log(`Server listen at port ${process.env.PORT}`);
})


