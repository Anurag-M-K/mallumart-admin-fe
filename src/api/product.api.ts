import instance from '../config/axiosInstance';
import { IProduct } from '../types/product';

export const addProduct = async ({ payload, id }: { payload: IProduct; id: string }) => {
    const res = await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/product/${id}`,
        method: 'POST',
        data: payload,
    });

    return res.data;
};

export const updateProduct = async ({ payload, productId }: { payload: IProduct; id: string; productId: string }) => {
    const res = await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/product/store/${productId}`,
        method: 'PUT',
        data: payload,
    });

    return res.data;
};

export const fetchAllProductsOfAStore = async (id: string) => {
    const res = await instance.get(`/api/product/${id}`);

    return res.data;
};

export const deleteProduct = async (id: string) => {
    return await instance.delete(`/api/product/${id}`);
};

export const fetchOneProductDetails = async (id: string) => {
    return await instance.get(`/api/product/store/${id}`);
};

export const addProductImages = async (formData: FormData) => {
    const storetoken = localStorage.getItem('storeToken');

    return await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/product/images/upload`,
        method: 'POST',
        data: formData,
        headers: {
            Authorization: storetoken,
        },
    });
};
