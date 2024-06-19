import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface storesState {
    storeData: any[]; // Update this type to match the actual structure of your storedata
}

const initialState: storesState = {
    storeData: [],
};

export const storeSlice = createSlice({
    name: "stores",
    initialState,
    reducers: {
        setStoreData: (state, action: PayloadAction<any[]>) => {
            state.storeData = action.payload;
    
        },
       
    },
});

export const { setStoreData } = storeSlice.actions;

export default storeSlice.reducer;
