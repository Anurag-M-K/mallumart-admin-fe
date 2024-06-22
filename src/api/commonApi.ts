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