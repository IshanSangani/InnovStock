import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path:"../config/.env"
})

let isConnected = false; // track the connection

const databaseConnection = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });

        isConnected = true;
        console.log('New database connection established');
        return db;
    } catch (error) {
        console.log('MongoDB connection error:', error);
        isConnected = false;
        // Don't throw the error, just return null
        return null;
    }
};

export default databaseConnection;