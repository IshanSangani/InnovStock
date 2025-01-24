import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";

const useGetMyTweets = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.tweet);
    

    const fetchMyTweets = async () => {
        try {
            const res = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
                withCredentials: true
            });
            console.log("Tweets response:", res.data);
            if (res.data.tweets) {
                dispatch(getAllTweets(res.data.tweets));
            }
        } catch (error) {
            console.log(error);
        }
    }
    const followingTweetHandler = async () => { 
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${TWEET_API_END_POINT}/followingtweets/${id}`);
            console.log("Following tweets:", res.data);
            if (res.data.tweets) {
                dispatch(getAllTweets(res.data.tweets));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (id) {
            if (isActive) {
                fetchMyTweets();
            } else {
                followingTweetHandler();
            }
        }
    }, [isActive, refresh, id, fetchMyTweets, followingTweetHandler]);
};
export default useGetMyTweets;