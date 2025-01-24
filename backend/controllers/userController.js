import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Profile } from "../models/profileSchema.js";

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exists.",
                success: false
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 16);
        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        // Create profile for new user
        await Profile.create({
            userId: newUser._id,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


export const Login = async (req, res) => {
    try {
        console.log("Login request body:", req.body);
        console.log("Login request headers:", req.headers);
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log("Missing credentials:", { email: !!email, password: !!password });
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        console.log("User found:", !!user);

        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        delete user.password;
        
        console.log("Login successful, sending response");
        return res
            .cookie("token", token, cookieOptions)
            .status(200)
            .json({
                message: "Login successful",
                user,
                success: true,
                token
            });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Server error during login",
            success: false
        });
    }
};

export const logout = (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "user logged out successfully.",
        success: true
    })
}
export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            // remove
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks."
            });
        } else {
            // bookmark
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Saved to bookmarks."
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        const profile = await Profile.findOne({ userId: id });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            user,
            profile
        });
    } catch (error) {
        console.log(error);
    }
};

export const getOtherUsers = async (req, res) => { 
    try {
        const { id } = req.params;
        const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");
        const profiles = await Profile.find({ userId: { $in: otherUsers.map(user => user._id) } });
        
        if (otherUsers.length === 0) {
            return res.status(401).json({
                message: "Currently do not have any users."
            });
        };
        
        const usersWithProfiles = otherUsers.map(user => {
            const profile = profiles.find(profile => profile.userId.toString() === user._id.toString());
            return { user, profile };
        });

        return res.status(200).json({
            usersWithProfiles
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { bio, profilePicture, bannerImage } = req.body;
        const userId = req.user._id;

        

        // Find and update profile instead of user
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId }, // find profile by userId
            { 
                $set: { 
                    bio, 
                    profilePicture, 
                    bannerImage 
                }
            },
            { 
                new: true,
                upsert: true, // create if doesn't exist
                runValidators: true
            }
        );

        

        if (!updatedProfile) {
            return res.status(400).json({
                message: "Failed to update profile",
                success: false
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedProfile,
            success: true
        });

    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({
            message: "Error updating profile",
            error: error.message,
            success: false
        });
    }
};

export const follow = async (req, res) => {
    try {
        const { id } = req.params; // ID of user to follow
        const userId = req.user._id; // Current user's ID

        // Don't allow self-following
        if (id === userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        const userToFollow = await User.findById(id);
        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User to follow not found"
            });
        }

        const currentUser = await User.findById(userId);
        if (!currentUser.following) {
            currentUser.following = [];
        }

        // Check if already following
        if (currentUser.following.includes(id)) {
            return res.status(400).json({
                success: false,
                message: "Already following this user"
            });
        }
        //more
        // Update following/followers
        currentUser.following.push(id);
        await currentUser.save();

        res.json({
            success: true,
            message: "Successfully followed user"
        });
    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const unfollow = async (req, res) => {
    try {
        const userToUnfollowId = req.params.id;
        const currentUserId = req.user._id;

        if (userToUnfollowId === currentUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid operation"
            });
        }

        const [userToUnfollow, currentUser] = await Promise.all([
            User.findById(userToUnfollowId),
            User.findById(currentUserId)
        ]);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!currentUser.following.includes(userToUnfollowId)) {
            return res.status(400).json({
                success: false,
                message: "You are not following this user"
            });
        }

        // Update both users atomically
        await Promise.all([
            User.findByIdAndUpdate(currentUserId, 
                { $pull: { following: userToUnfollowId } }
            ),
            User.findByIdAndUpdate(userToUnfollowId, 
                { $pull: { followers: currentUserId } }
            )
        ]);

        return res.status(200).json({
            success: true,
            message: "Successfully unfollowed user"
        });
    } catch (error) {
        console.error('Unfollow error:', error);
        return res.status(500).json({
            success: false,
            message: "Error unfollowing user"
        });
    }
};