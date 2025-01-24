import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: "../config/.env"
})

const databaseConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        });
        console.log("Connected to mongoDB");
        return conn;
    } catch (error) {
        console.log("MongoDB connection error:", error);
        // Don't throw the error, just log it
        return null;
    }
}

export default databaseConnection;