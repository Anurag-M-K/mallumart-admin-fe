import instance from '../config/axiosInstance';
import { ICategoryFormatted } from '../types/question';

export const staffLogin = async (payload:any) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/login`,
            method: "POST",
            data: payload,
        });
        return res.data

    } catch (error) {
        return error
    }
}


export const addStore = async (payload:any,staffToken:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/add-store`,
            method: "POST",
            headers:{
                Authorization:staffToken,
            },
            data: payload
        })
        return res;
    } catch (error) {
        return error
    }
}

export const searchUniqueNameExitst = async (query :string) =>{
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/store/${query}`,
            method: "GET",
        })
        return res;
    } catch (error) {
        return error;
    }
}


export const fetchAllStore = async (staffToken:string) => {
    try {
       const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/store`,
            method:"GET",
            headers:{
                Authorization:staffToken
            }
        })
        return res
    } catch (error) {
        console.log(error);
    }
}

export const updateStoreStatus = async (staffToken:string,storeId:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/store/status-update/${storeId}`,
            method:"PUT",
            headers:{
                Authorization:staffToken
            },
        })
        return res;
    } catch (error) {
        return error;
    }
}

export const updateStore = async (staffToken:string,payload:any) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/store/${payload.storeId}`,
            method:"PUT",
            data:payload,
            headers:{
                Authorization:staffToken
            },
        })
        return res;
    } catch (error) {
        return error;
    }
}




export const getCategory = async (token:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/category`,
            method: 'GET',
            headers: {
                Authorization: token,
            },
        });
        return res.data as ICategoryFormatted[];
    } catch (error) {
        console.log(error);
    }
};

type ICategorySchema = {
    name: string;
    isActive: boolean;
    parentId?: string | undefined;
};

export const addCategory = async (payload: ICategorySchema,token:string) => {
    const res = await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/category`,
        method: 'POST',
        data: payload,
        headers: {
            Authorization: token,
        },
    });

    return res.data;
};

export const editCategory = async (id: string, payload: ICategorySchema,token:string) => {
    const res = await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff/category/${id}`,
        method: 'PUT',
        data: payload,
        headers: {
            Authorization: token,
        },
    });

    return res.data;
};


export const fetchStaffById = async(token:string) => {
    try {
    const res = await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/staff`,
        headers: {
            Authorization: token,
        },
        method:"GET"
    })        
    return res.data           
    } catch (error) {
        return error
    }
}


