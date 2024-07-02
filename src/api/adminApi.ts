import axios from 'axios';
import instance from '../config/axiosInstance';

export const adminLogin = async (payload: any) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/login`, payload);
        return res;
    } catch (error) {
        return error
    }
};

export const addStaff = async (payload: any, adminToken: string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/staff`,
            method: 'POST',
            data: payload,
            headers: {
                Authorization: adminToken,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const getStaffs = async (adminToken: string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/staff`,
            method: 'GET',
            headers: {
                Authorization: adminToken,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const updateStaff = async (adminToken: string, payload: any) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/staff`,
            method: 'PATCH',
            headers: {
                Authorization: adminToken,
            },
            data: payload,
        });
        return res;
    } catch (error) {
      return error
    }
};

export const deleteStaff = async (adminToken: string, staffId: any) => {
    try {
        await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/staff/${staffId}`,
            method: 'DELETE',
            headers: {
                Authorization: adminToken,
            },
        });
    } catch (error) {
        console.log(error);
    }
};


export const fetchAllStore = async (adminToken:string) => {
    try {
       const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/store`,
            method:"GET",
            headers:{
                Authorization:adminToken
            }
        })
        return res
    } catch (error) {
        console.log(error);
    }
}

export const updateSubscription = async (adminTOken:string,values:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/store/subscription`,
            method:"PUT",
            headers:{
                Authorization:adminTOken
            },
            data:values
        })
        return res;
    } catch (error) {
        console.log(error)
    }
}
export const updateStoreStatus = async (adminTOken:string,storeId:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/store/status-update/${storeId}`,
            method:"PUT",
            headers:{
                Authorization:adminTOken
            },
        })
        return res;
    } catch (error) {
        return error;
    }
}
export const updateStore = async (adminTOken:string,payload:any) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/store/${payload.storeId}`,
            method:"PUT",
            data:payload,
            headers:{
                Authorization:adminTOken
            },
        })
        return res;
    } catch (error) {
        return error;
    }
}

export const addAdvertisement = async ( adminToken: string,payload: TAdvertisement) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/advertisement`,
            method: 'POST',
            data: payload,
            headers: {
                Authorization: adminToken,
            },
        });
        return res;
    } catch (error) {
        return error
    }
};

export const fetchAllAdvertisement = async (adminToken:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/advertisement`,
            method:"GET",
            headers:{
                Authorization:adminToken
            }            
        })      
        return res.data  
    } catch (error) {
        return error
    }
}

export const deleteAdvertisement = async (adminToken: string, advertisementId:string) => {
    try {
       const res =  await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/advertisement/${advertisementId}`,
            method: 'DELETE',
            headers: {
                Authorization: adminToken,
            },
        });
        return res
    } catch (error) {
        console.log(error);
    }
};


export const updateAdvertisementDisplay = async(adminToken:string,payload:TAdvertisementUpdate) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/advertisement`,
            method:"PUT",
            headers:{
                Authorization:adminToken
            },
            data:payload
        })
        return res;
    } catch (error) {
        return error
    }
}


export const fetchStoreCountByCategory = async (adminToken:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/total-store`,
            method:"GET",
            headers:{
                Authorization:adminToken
            }            
        })      
        return res.data  
    } catch (error) {
        return error
    }
}

export const addTarget = async (adminToken: string,payload:any) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/staff/target`,
            method: 'POST',
            data: payload,
            headers: {
                Authorization: adminToken,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchMostSearchedProducts = async (adminToken:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/most-searched-products`,
            method:"GET",
            headers:{
                Authorization:adminToken
            }            
        })      
        return res.data  
    } catch (error) {
        return error
    }
}

export const deleteStoreById = async (adminToken: string, storeId:string) => {
    try {
       const res =  await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/store/${storeId}`,
            method: 'DELETE',
            headers: {
                Authorization: adminToken,
            },
        });
        return res
    } catch (error) {
        console.log(error);
    }
};
