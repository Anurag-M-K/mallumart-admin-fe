import instance from '../config/axiosInstance';

export const storeLogin = async (payload: any) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/store/login`,
            method: 'POST',
            data: payload,
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const fetchStore = async (storeToken: string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/store`,
            method: 'GET',
            headers: {
                Authorization: storeToken,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updateStoreLiveStatus = async (token:string,value:TStoreLiveStatus) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/store/update-live-status`,
            method:"PUT",
            headers:{
                Authorization:token
            },
            data:value
        })
        return res;
    } catch (error) {
        return error;
    }
}

export const addAdvertisement = async ( token: string,payload: TAdvertisement) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/store/advertisement`,
            method: 'POST',
            data: payload,
            headers: {
                Authorization: token,
            }
        });
        return res;
    } catch (error) {
        return error
    }
};

export const fetchAllAdvertisement = async (token:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/store/advertisement`,
            method:"GET",
            headers:{
                Authorization:token
            }            
        })      
        return res.data  
    } catch (error) {
        return error
    }
}

export const deleteAdvertisement = async (token: string, advertisementId:string) => {
    try {
       const res =  await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/store/advertisement/${advertisementId}`,
            method: 'DELETE',
            headers: {
                Authorization: token,
            },
        });
        return res
    } catch (error) {
        console.log(error);
    }
};

export const updateStore = async (token:string, payload:any ) => {

    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/store/`,
            method: 'PUT',
            data: payload,
            headers: {
                Authorization: token,
            },
        });
        return res;
    } catch (error) {
        return error;
    }
};

export const addTimeSlot = async ( token: string,payload: TSlot) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/store/add-time-slot`,
            method: 'POST',
            data: payload,
            headers: {
                Authorization: token,
            }
        });
        return res;
    } catch (error) {
        return error
    }
};