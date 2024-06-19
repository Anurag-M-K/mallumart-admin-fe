import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface storeOwnerState {
    storeOwnerData: string[]; 
    storeOwnerToken:any;
    isAuthenticated:boolean;
}

const initialState: storeOwnerState = {
    storeOwnerData: [],
    storeOwnerToken:"",
    isAuthenticated:false
};

export const storeOwnerSlice = createSlice({
    name: "storeOwner",
    initialState,
    reducers: {
        setstoreOwnerData: (state, action: PayloadAction<any[]>) => {
            state.storeOwnerData = action.payload;
            state.isAuthenticated = true;
    
        },
        setstoreOwnerToken: (state, action: PayloadAction<any[]>) => {
            state.storeOwnerToken = action.payload;
        },
        setStoreOwnerLogout(state){
            state.isAuthenticated = false;
            state.storeOwnerToken = "";
        }
       
    },
});

export const { setstoreOwnerData,setstoreOwnerToken, setStoreOwnerLogout } = storeOwnerSlice.actions;

export default storeOwnerSlice.reducer;
