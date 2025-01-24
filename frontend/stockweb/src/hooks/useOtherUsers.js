import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getOtherUsers } from "../redux/userSlice";

const useOtherUsers = (id) => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                console.log("Fetching other users for ID:", id);
                const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`, {
                    withCredentials: true
                });
                console.log("API Response:", res.data);
                dispatch(getOtherUsers(res.data.usersWithProfiles));
                setUsers(res.data.usersWithProfiles);
            } catch (error) {
                console.error("Error fetching other users:", error);
            }
        }
        if (id) {  // Only fetch if we have an ID
            fetchOtherUsers();
        }
    }, [id, dispatch]);

    return users;
};

export default useOtherUsers;