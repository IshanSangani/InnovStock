import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";

const useGetMyTweets = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.tweet);
    
    useEffect(() => {
        const fetchMyTweets = async () => {
            try {
                const res = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
                    withCredentials: true
                });
                if (res.data.tweets) {
                    dispatch(getAllTweets(res.data.tweets));
                }
            } catch (error) {
                console.log(error);
            }
        };

        const followingTweetHandler = async () => { 
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${TWEET_API_END_POINT}/followingtweets/${id}`);
                if (res.data.tweets) {
                    dispatch(getAllTweets(res.data.tweets));
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (id) {
            if (isActive) {
                fetchMyTweets();
            } else {
                followingTweetHandler();
            }
        }
    }, [isActive, refresh, id, dispatch]);
};

export default useGetMyTweets;