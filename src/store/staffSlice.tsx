import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface StaffState {
    staffDetails: any[]; // Update this type to match the actual structure of your adminDetails
    isAuthenticated:boolean;
    staffToken:string;
}

const initialState: StaffState = {
    staffDetails: [],
    isAuthenticated:false,
    staffToken:""
};

export const staffSlice = createSlice({
    name: "staff",
    initialState,
    reducers: {
        setStaffData: (state, action: any) => {
            state.staffDetails = action.payload;
            state.isAuthenticated = true
            state.staffToken = action?.payload?.token
        },
        setStaffLogout(state){
            state.isAuthenticated = false;
            state.staffToken = "";
        }
    },
});

export const { setStaffData,setStaffLogout } = staffSlice.actions;

export default staffSlice.reducer;
