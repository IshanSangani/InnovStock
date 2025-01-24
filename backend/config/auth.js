import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                message: "Please login first",
                success: false
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = {
                _id: decoded.userId
            };
            next();
        } catch (jwtError) {
            return res.status(401).json({
                message: "Invalid or expired token. Please login again.",
                success: false
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
};

export default isAuthenticated;