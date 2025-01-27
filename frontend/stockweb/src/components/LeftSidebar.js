import React from 'react';
import { TiHome } from "react-icons/ti";
import { FaChartLine, FaBell, FaUser,  FaSignOutAlt, FaStar } from "react-icons/fa"; // Removed unused imports
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { logout } from '../redux/userSlice';


const LeftSidebar = () => {
    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true
            });
            
            dispatch(logout());
            
            navigate('/login');
            toast.success(res.data.message);
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Error logging out');
        }
    }

    return (
        <div className='w-[20%]'>
            <div>
                <div>
                    <img className='ml-5' width={"130px"} src="https://i.pinimg.com/736x/ef/fe/5a/effe5a34f0f273f826d78063459bd6f7.jpg" alt="twitter-logo" />
                </div>
                <div className='my-4'>
                    <Link to="/" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                        <div>
                            <TiHome size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Home</h1>
                    </Link>
                    {/* Wrap "Charts" in a Link */}
                    <Link to="/charts" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                        <div>
                            <FaChartLine size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Charts</h1>
                    </Link>
                    <div className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                        <div>
                            <FaBell size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Notifications</h1>
                    </div>
                    <Link to={`/profile/${user?._id}`} className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                        <div>
                            <FaUser size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Profile</h1>
                    </Link>

                    <Link to="/wishlist" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                        <div>
                            <FaStar size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Wishlist</h1>
                    </Link>
                    <div onClick={logoutHandler} className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                        <div>
                            <FaSignOutAlt size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Logout</h1>
                    </div>
                    <button className='px-4 py-2 border-none text-md bg-[#1da3f0] w-full rounded-full text-white font-bold'>Post</button>
                </div>
            </div>
        </div>
    )
}

export default LeftSidebar;
