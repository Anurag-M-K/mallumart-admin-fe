import instance from "../config/axiosInstance";

export const changePassword = async (token:string,payload:TChangePassword,role:string) => {
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


export const otpSendingForForgotPassword = async (role:string,phone:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/${role}/otp-send-forgot-password`,
            method:"POST",
            data:{
                phone
            }
        })
        return res;
    } catch (error) {
        return error
    }
}

export const veriFyOtp = async (role:string,otp:string,token:string) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/${role}/otp-verify-forgot-password`,
            method:"POST",
            data:{
                otp,token
            }
        })
        return res;
    } catch (error) {
        return error
    }
}

export const UpdatePassword = async (role:string,newPassword:string,token:string|null)=>{
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/${role}/update-password-request`,
            method:"PUT",
            data:{
                newPassword,token
            }
        })
        return res;
    } catch (error) {
        console.log(error)
    }
}