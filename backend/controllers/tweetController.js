import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";
import { Profile } from "../models/profileSchema.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message: "Fields are required.",
                success: false
            });
        };
        const user = await User.findById(id).select("-password");
        await Tweet.create({
            description,
            userId:id,
            userDetails:user
        });
        return res.status(201).json({
            message:"Tweet created successfully.",
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}
export const deleteTweet = async (req,res) => {
    try {
        const {id}  = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet deleted successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const likeOrDislike = async (req,res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            // dislike
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User disliked your tweet."
            })
        }else{
            // like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User liked your tweet."
            })
        }
    } catch (error) {
        console.log(error);
    }
};
export const getAllTweets = async (req, res) => {
    try {
        const { id } = req.params;
        
        // First, get all tweets with populated data
        const tweets = await Tweet.find()
            .populate({
                path: 'userId',
                select: 'name username profile',
                populate: {
                    path: 'profile',
                    select: 'profilePicture'
                }
            })
            .sort({ createdAt: -1 });

        // Get user profiles separately
        const userIds = tweets
            .filter(tweet => tweet.userId) // Filter out any null userId
            .map(tweet => tweet.userId._id);

        const profiles = await Profile.find({
            userId: { $in: userIds }
        });

        // Map profiles to tweets
        const tweetsWithProfiles = tweets.map(tweet => {
            if (!tweet.userId) return tweet; // Skip if no userId

            const userProfile = profiles.find(
                profile => profile.userId.toString() === tweet.userId._id.toString()
            );

            return {
                ...tweet.toObject(),
                userId: {
                    ...tweet.userId.toObject(),
                    profile: userProfile || null
                }
            };
        });

        

        return res.status(200).json({
            tweets: tweetsWithProfiles,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching tweets",
            success: false
        });
    }
};
export const getFollowingTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        
        if (!loggedInUser?.following || loggedInUser.following.length === 0) {
            return res.status(200).json({
                tweets: []
            });
        }

        // Get tweets from followed users
        const tweets = await Tweet.find({ 
            userId: { $in: loggedInUser.following } 
        })
        .populate({
            path: 'userId',
            select: 'name username profile',
            populate: {
                path: 'profile',
                select: 'profilePicture'
            }
        })
        .sort({ createdAt: -1 });

        // Get user profiles separately
        const userIds = tweets
            .filter(tweet => tweet.userId)
            .map(tweet => tweet.userId._id);

        const profiles = await Profile.find({
            userId: { $in: userIds }
        });

        // Map profiles to tweets
        const tweetsWithProfiles = tweets.map(tweet => {
            if (!tweet.userId) return tweet;

            const userProfile = profiles.find(
                profile => profile.userId.toString() === tweet.userId._id.toString()
            );

            return {
                ...tweet.toObject(),
                userId: {
                    ...tweet.userId.toObject(),
                    profile: userProfile || null
                }
            };
        });

        return res.status(200).json({
            tweets: tweetsWithProfiles,
            success: true
        });
    } catch (error) {
        console.error('Error fetching following tweets:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching tweets"
        });
    }
};
export const getUserTweets = async (req, res) => {
    try {
        const { id } = req.params;
        const tweets = await Tweet.find({ userId: id })
            .populate({
                path: 'userId',
                select: 'name username profile',
                populate: {
                    path: 'profile',
                    select: 'profilePicture'
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            tweets: tweets
        });
    } catch (error) {
        console.error("Error fetching user tweets:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching tweets"
        });
    }
};
 