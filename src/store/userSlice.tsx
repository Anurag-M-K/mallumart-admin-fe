import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface UserState {
    userDetails: any[]; // Update this type to match the actual structure of your userDetails
    userToken:string;
    isAuthenticated:boolean;

}

const initialState: UserState = {
    userDetails: [],
    userToken:"",
    isAuthenticated:false,

};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setuserDetails: (state, action: PayloadAction<any[]>) => {
            console.log("action  payload in user store ",action.payload)
            state.userDetails = action.payload;
        },
        setUserLogout(state){
            state.isAuthenticated = false;
            state.userToken = "";
        }
    },
});

export const { setuserDetails,setUserLogout } = userSlice.actions;

export default userSlice.reducer;
