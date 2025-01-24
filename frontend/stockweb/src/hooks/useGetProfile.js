import { useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { setProfile } from '../redux/userSlice';

const useGetProfile = (id) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
                    withCredentials: true
                });
                dispatch(setProfile(response.data));
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id, dispatch]);
};

export default useGetProfile;