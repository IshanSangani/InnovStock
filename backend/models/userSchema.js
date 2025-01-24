import mongoose from "mongoose";
import { Profile } from "./profileSchema.js";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }, 
    bookmarks:{
        type:Array,
        default:[]
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
},{timestamps:true});

// Add a pre-save hook to create profile if it doesn't exist
userSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            const profile = await Profile.create({ userId: this._id });
            this.profile = profile._id;
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const User = mongoose.model("User", userSchema);