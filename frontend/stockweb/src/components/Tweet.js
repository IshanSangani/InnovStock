import React from 'react';
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import axios from "axios";
import { TWEET_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';
import { timeSince } from "../utils/constant";

const DEFAULT_PROFILE_PIC = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const Tweet = ({ tweet }) => {
    const { user } = useSelector(store => store.user); 
    const dispatch = useDispatch();
    
    console.log("Tweet data:", {
        id: tweet?._id,
        userId: tweet?.userId?._id,
        userProfile: tweet?.userId?.profile
    });
    
    const tweetUser = tweet?.userId;
    const hasLiked = tweet?.like?.includes(user?._id);
    const profilePicUrl = tweetUser?.profile?.profilePicture || 
                         "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    const likeOrDislikeHandler = async (id) => {
        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${id}`, { id: user?._id }, {
                withCredentials: true
            });
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }

    const deleteTweetHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`);
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }

    return (
        <div className='border-b border-gray-200'>
            <div>
                <div className='flex p-4'>
                    <Avatar 
                        src={profilePicUrl}
                        size="40" 
                        round={true} 
                        alt={tweetUser?.name || "User"}
                    />
                    <div className='ml-2 w-full'>
                        <div className='flex items-center'>
                            <h1 className='font-bold'>
                                {tweetUser?.name || tweet?.userDetails?.[0]?.name || 'Unknown User'}
                            </h1>
                            <p className='text-gray-500 text-sm ml-1'>
                                {tweetUser?.username ? 
                                    `@${tweetUser.username} . ${timeSince(tweet?.createdAt)}` 
                                    : ''
                                }
                            </p>
                        </div>
                        <div>
                            <p>{tweet?.description}</p>
                        </div>
                        <div className='flex justify-between my-3'>
                            <div className='flex items-center'>
                                <div className='p-2 hover:bg-green-200 rounded-full cursor-pointer'>
                                    <FaRegComment size="20px" />
                                </div>
                                <p>0</p>
                            </div>
                            <div className='flex items-center'>
                                <div 
                                    onClick={() => likeOrDislikeHandler(tweet?._id)} 
                                    className='p-2 rounded-full cursor-pointer'
                                >
                                    <CiHeart 
                                        size="24px" 
                                        className={`${hasLiked ? 'text-red-600' : 'text-gray-600'} transition-colors duration-200`} 
                                    />
                                </div>
                                <p>{tweet?.like?.length}</p>
                            </div>
                            <div className='flex items-center'>
                                <div className='p-2 hover:bg-yellow-200 rounded-full cursor-pointer'>
                                    <CiBookmark size="24px" />
                                </div>
                                <p>0</p>
                            </div>
                            {
                                user?._id === tweet?.userId && (
                                    <div onClick={() => deleteTweetHandler(tweet?._id)} className='flex items-center'>
                                        <div className='p-2 hover:bg-red-300 rounded-full cursor-pointer'>
                                            <MdOutlineDeleteOutline size="24px" />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tweet;
