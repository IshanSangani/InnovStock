import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }

        // Synchronous verification
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
        // Set user object properly
        req.user = {
            _id: decoded.userId
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            message: "Authentication failed. Please login again.",
            success: false
        });
    }
};

export default isAuthenticated;