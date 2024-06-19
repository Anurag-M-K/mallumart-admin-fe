import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface AdminState {
    adminDetails: any[]; // Update this type to match the actual structure of your adminDetails
    isAuthenticated:boolean;
    adminToken:string;
    isAdmin:boolean;
}

const initialState: AdminState = {
    adminDetails: [],
    isAuthenticated:false,
    adminToken:"",
    isAdmin:true
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdminDetails: (state, action: PayloadAction<any[]>) => {
            state.adminDetails = action.payload;
            state.isAuthenticated = true
        },
        setAdminLogout(state){
            state.isAuthenticated = false;
            state.adminToken = "";
        }
    },
});

export const { setAdminDetails,setAdminLogout } = adminSlice.actions;

export default adminSlice.reducer;
