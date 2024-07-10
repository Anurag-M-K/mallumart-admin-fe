import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface UsersState {
    usersData: any[]; // Update this type to match the actual structure of your adminDetails
}

const initialState: UsersState = {
    usersData: [],
};

export const usersManagementSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsersData: (state, action: PayloadAction<any[]>) => {
            state.usersData = action.payload;
        },
    },
});

export const { setUsersData } = usersManagementSlice.actions;

export default usersManagementSlice.reducer