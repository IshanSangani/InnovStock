import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    otherUsers: [],
    loading: false,
    error: null
};

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout:(state)=>{
            state.user = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('user');
        },
        // multiple actions
        getUser:(state,action)=>{
            state.user = {
                ...action.payload,
                following: action.payload.following || []
            };
        },
        getOtherUsers:(state,action)=>{
            state.otherUsers = action.payload;
        },
        getMyProfile:(state,action)=>{
            state.profile = action.payload;
        },
        followingUpdate:(state,action)=>{
            if (!state.user.following) {
                state.user.following = [];
            }
            const userId = action.payload;
            const isFollowing = state.user.following.includes(userId);
            
            if (isFollowing) {
                state.user.following = state.user.following.filter(id => id !== userId);
            } else {
                state.user.following.push(userId);
            }
        },
        setProfile:(state,action)=>{
            state.profile = action.payload;
        }
    }
});
export const {getUser, getOtherUsers,getMyProfile,followingUpdate,setProfile} = userSlice.actions;
export default userSlice.reducer;


