import instance from '../config/axiosInstance';
import { ICategory, ICategoryFormatted, ICategorySelectOptions, ISubCategoryPending } from '../types/question';

export const getCategory = async (params?: { isActive: boolean }) => {
    try {
        const res = await instance({
            url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/category`,
            method: 'GET',
            params,
        });
        return res.data as ICategoryFormatted[];
    } catch (error) {
        console.log(error);
    }
};

export const getPendingCategories = async (): Promise<ISubCategoryPending[]> => {
    const res = await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/category/pending`,
        method: 'GET',
    });
    return res.data;
};

export const getSubCategoriesForProduct = async (id: string): Promise<ICategorySelectOptions[]> => {
    const { data } = await instance.get(`/api/product/category/${id}`);
    return data;
};

type ICategorySchema = {
    name: string;
    isActive: boolean;
    parentId?: string | undefined;
    isPending?: boolean;
};

export const addCategory = async (payload: ICategorySchema) => {
    const res = await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/category`,
        method: 'POST',
        data: payload,
    });

    return res.data;
};

export const editCategory = async (id: string, payload: Partial<ICategorySchema>) => {
    const res = await instance({
        url: `${import.meta.env.VITE_APP_BACKEND_URL}/api/category/${id}`,
        method: 'PUT',
        data: payload,
    });

    return res.data;
};
