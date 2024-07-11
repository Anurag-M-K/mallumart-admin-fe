import axios from 'axios';

export const uploadImage = async (formData: any) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/utils/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};
