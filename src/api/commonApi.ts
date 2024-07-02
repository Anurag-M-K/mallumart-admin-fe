import instance from "../config/axiosInstance";

export const changePassword = async (token:string,payload:TChangePassword,role:string) => {
    console.log("in api function ",payload)
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/${role}/change-password`,
            method:"PUT",
            headers:{
                Authorization:token
            },
            data:payload
        })
        return res;
    } catch (error) {
        return error;
    }
}

export const deleteStoreById = async (token: string, storeId:string,role:string) => {
    try {
       const res =  await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/${role}/store/${storeId}`,
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