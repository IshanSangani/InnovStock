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
            state.user = action.payload;
        },
        getOtherUsers:(state,action)=>{
            state.otherUsers = action.payload;
        },
        getMyProfile:(state,action)=>{
            state.profile = action.payload;
        },
        followingUpdate:(state,action)=>{
            // unfollow
            if(state.user.following.includes(action.payload)){
                state.user.following = state.user.following.filter((itemId)=>{
                    return itemId !== action.payload;
                })
            }else{
                // follow
                state.user.following.push(action.payload);
            }
        },
        setProfile:(state,action)=>{
            state.profile = action.payload;
        }
    }
});
export const {getUser, getOtherUsers,getMyProfile,followingUpdate,setProfile} = userSlice.actions;
export default userSlice.reducer;


