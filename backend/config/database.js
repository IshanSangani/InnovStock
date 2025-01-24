import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Remove the path config since .env is in root

const databaseConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("Connected to mongoDB");
        return conn;
    } catch (error) {
        console.log("MongoDB connection error:", error);
        return null;
    }
}

export default databaseConnection;