// Profile.js
import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast"
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';
import Tweet from './Tweet';

const EditProfileModal = ({ isOpen, onClose, profile }) => {
    const [formData, setFormData] = useState({
        bio: profile?.bio || '',
        profilePicture: profile?.profilePicture || '',
        bannerImage: profile?.bannerImage || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            await axios.put(`${USER_API_END_POINT}/update-profile`, formData);
            toast.success('Profile updated successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[500px]">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Profile Picture URL</label>
                        <input
                            type="text"
                            value={formData.profilePicture}
                            onChange={(e) => setFormData({...formData, profilePicture: e.target.value})}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Banner Image URL</label>
                        <input
                            type="text"
                            value={formData.bannerImage}
                            onChange={(e) => setFormData({...formData, bannerImage: e.target.value})}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Profile = () => {
    const { user } = useSelector(store => store.user);
    const { tweets } = useSelector(store => store.tweet);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Reset current profile when ID changes
    useEffect(() => {
        setCurrentProfile(null);
        setIsLoading(true);
    }, [id]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
                    withCredentials: true
                });
                setCurrentProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProfileData();
        }
    }, [id]);

    const profileUser = currentProfile?.user;
    const profileData = currentProfile?.profile;
    const profileTweets = tweets?.filter(tweet => tweet?.userId?._id === id);

    if (isLoading) {
        return (
            <div className='w-[50%] border-l border-r border-gray-200 flex justify-center items-center h-screen'>
                <div>Loading...</div>
            </div>
        );
    }

    const followAndUnfollowHandler = async () => {
        try {
            const endpoint = user.following.includes(id) ? 'unfollow' : 'follow';
            const res = await axios.post(
                `${USER_API_END_POINT}/${endpoint}/${id}`,
                { id: user?._id },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.data.success) {
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || 'Action failed');
            }
        } catch (error) {
            console.error('Follow/Unfollow error:', error);
            toast.error(error.response?.data?.message || 'Failed to update follow status');
        }
    };

    return (
        <div className='w-[50%] border-l border-r border-gray-200'>
            <div>
                <div className='flex items-center py-2'>
                    <Link to="/" className='p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer'>
                        <IoMdArrowBack size="24px" />
                    </Link>
                    <div className='ml-2'>
                        <h1 className='font-bold text-lg'>{profileUser?.name}</h1>
                        <p className='text-gray-500 text-sm'>{profileTweets?.length || 0} posts</p>
                    </div>
                </div>
                <div className="relative">
                    {currentProfile && (
                        <>
                            <img 
                                src={profileData?.bannerImage || "https://pbs.twimg.com/profile_banners/1581707412922200067/1693248932/1080x360"} 
                                alt="banner" 
                                className="w-full h-48 object-cover"
                                key={`banner-${id}`}
                            />
                            <div className='absolute -bottom-16 left-4 border-4 border-white rounded-full'>
                                <Avatar 
                                    src={profileData?.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                                    size="120" 
                                    round={true} 
                                    key={`avatar-${id}`}
                                    alt={profileUser?.name}
                                    className="transition-opacity duration-200"
                                    onLoadStart={(e) => {
                                        e.target.style.opacity = '0';
                                    }}
                                    onLoad={(e) => {
                                        e.target.style.opacity = '1';
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className='text-right mt-4 mr-4'>
                    {profileUser?._id === user?._id ? (
                        <button 
                            onClick={() => setIsEditModalOpen(true)} 
                            className='px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400'
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button 
                            onClick={followAndUnfollowHandler} 
                            className='px-4 py-1 bg-black text-white rounded-full'
                        >
                            {user?.following?.includes(id) ? "Following" : "Follow"}
                        </button>
                    )}
                </div>
                <div className='mt-20 mx-4'>
                    <h1 className='font-bold text-xl'>{profileUser?.name}</h1>
                    <p className='text-gray-600'>{`@${profileUser?.username}`}</p>
                    <div className='mt-2 text-sm'>
                        <p>{profileData?.bio || "No bio available"}</p>
                    </div>
                </div>
            </div>
            <div className='border-t border-gray-200 mt-4'>
                <div className='px-4 py-2'>
                    <h2 className='font-bold text-xl'>Posts</h2>
                </div>
                <div>
                    {profileTweets?.length > 0 ? (
                        profileTweets.map(tweet => (
                            <Tweet key={tweet._id} tweet={tweet} />
                        ))
                    ) : (
                        <div className='p-4 text-center text-gray-500'>
                            No posts yet
                        </div>
                    )}
                </div>
            </div>
            {profileUser?._id === user?._id && (
                <EditProfileModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    profile={profileData}
                />
            )}
        </div>
    )
}

export default React.memo(Profile);