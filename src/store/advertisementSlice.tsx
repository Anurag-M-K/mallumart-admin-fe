import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdvertisementState {
    advertisementDetails: any[];
}

const initialState: AdvertisementState = {
    advertisementDetails: [],
};

export const advertisementSlice = createSlice({
    name: 'advertisement',
    initialState,
    reducers: {
        setAdvertisementDetails: (state, action: PayloadAction<any[]>) => {
            state.advertisementDetails = action.payload;
        },
    },
});

export const { setAdvertisementDetails } = advertisementSlice.actions;
export default advertisementSlice.reducer;
