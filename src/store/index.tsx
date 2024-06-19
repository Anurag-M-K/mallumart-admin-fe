import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import { adminSlice } from './adminSlice';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import staffManagementSlice from './staffManagementSlice';
import staffSlice from './staffSlice';
import storeSlice from './storeSlice';
import storeOwnerSlice from './storeOwnerSlice';
import userSlice from './userSlice';
import advertisementSlice from './advertisementSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    admin: adminSlice.reducer,
    staffs: staffManagementSlice,
    staff: staffSlice,
    stores: storeSlice,
    storeOwner: storeOwnerSlice,
    user: userSlice,
    advertisement:advertisementSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default configureStore({
    reducer: persistedReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
