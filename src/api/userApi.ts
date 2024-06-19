import instance from "../config/axiosInstance";

export const userRegister = async (payload:any) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/signup`,
            method: 'POST',
            data:payload
        })     
        return res   
    } catch (error) {
        console.log(error);
    }
}
export const userLogin = async (payload:any) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/login`,
            method: 'POST',
            data:payload
        })     
        return res   
    } catch (error) {
        console.log(error);
    }
}