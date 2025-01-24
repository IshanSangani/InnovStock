import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return mongoose.connections[0];
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 15000,
            maxPoolSize: 10
        });
        console.log("Connected to MongoDB");
        return conn;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

export default databaseConnection;