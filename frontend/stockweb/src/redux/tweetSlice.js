import {createSlice} from "@reduxjs/toolkit";
const tweetSlice = createSlice({
    name:"tweet",
    initialState:{
        tweets:[],
        refresh:false,
        isActive:true,
        profileTweets:[]
    },
    reducers:{
        getAllTweets:(state,action)=>{
            state.tweets = action.payload;
        },
        getRefresh:(state)=>{
            state.refresh = !state.refresh;
        },
        getIsActive:(state,action)=>{
            state.isActive = action.payload;
        },
        setProfileTweets:(state,action)=>{
            state.profileTweets = action.payload;
        }
    }
});
export const {getAllTweets,getRefresh,getIsActive,setProfileTweets} = tweetSlice.actions;
export default tweetSlice.reducer;