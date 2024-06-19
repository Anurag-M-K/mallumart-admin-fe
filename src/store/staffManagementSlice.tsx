import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface StaffState {
    staffDetails: any[]; // Update this type to match the actual structure of your adminDetails
}

const initialState: StaffState = {
    staffDetails: [],
};

export const staffManagementSlice = createSlice({
    name: "staffs",
    initialState,
    reducers: {
        setStaffDetails: (state, action: PayloadAction<any[]>) => {
            state.staffDetails = action.payload;
        },
    },
});

export const { setStaffDetails } = staffManagementSlice.actions;

export default staffManagementSlice.reducer;
