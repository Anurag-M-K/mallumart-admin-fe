import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import WrappedInput from '../../../components/wrappedComponents/WrappedInputField';
import WrappedSelect, { WrappedCheckbox, WrappedFileUpload, WrappedInputForUniqueName, WrappedLocation, wrapidQuill } from '../../../components/wrappedComponents/wrappedComponent';
import { useDispatch, useSelector } from 'react-redux';
import { addStore, fetchAllStore } from '../../../api/staffApi';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../../../api/categoryApi';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { shop_validate_file_upload, validation_required } from '../../../utils/validation';
import { districts } from '../../../constants/store';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { setStoreData } from '../../../store/storeSlice';

type IOptions = {
    value: string;
    label: string;
};
interface ICategorySchema {
    label: string;
    value: string;
}

function StoreAdding() {
    const [storeAddingModal, setStoreAddingModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const staffData = useSelector((state: any) => state.staff);
    const [previewSource, setPreviewSource] = useState();
    const navigate = useNavigate();
    const options: IOptions[] = [
        { value: 'wholesale', label: 'Whole Sale' },
        { value: 'retail', label: 'Retail' },
    ];

    // Fetching category data
    const { isPending, error, data } = useQuery({
        queryKey: ['category'],
        queryFn: () => getCategory(),
    });

    const onSubmit = async (values: TStoreValues) => {
        try {
            setLoading(true);
            const data = new FormData();
            data.append('file', values.shopImgUrl);
            data.append('upload_preset', import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET);
            data.append('cloud_name', import.meta.env.VITE_CLOUDINARY_UPLOAD_NAME);
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_UPLOAD_NAME}/image/upload`, data);
            const url = res.data.secure_url;

            values.shopImgUrl = url;
            const response: any = await addStore(values, staffData?.staffToken);
            const showAlert = async (icon: SweetAlertIcon, title: string) => {
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon,
                    title,
                    padding: '10px 20px',
                });
            };
            if (response?.status == 201) {
                const res = await fetchAllStore(staffData?.staffToken);
                dispatch(setStoreData(res?.data));
                showAlert('success', 'Store added successfully');
                navigate('/staff/stores');
                setLoading(false);
                setStoreAddingModal(false);
            }else{
                showAlert('error',response?.response?.data?.message)
                setLoading(false);
            }
        } catch (error) {
            toast.error('Something went wrong, please try again');
            setLoading(false);
            console.log('error ===> ', error);
        }
    };

    const categoryOptions: ICategorySchema[] = (data ?? []).map((category) => ({
        label: category?.name,
        value: category?._id,
    }));
    return (
        <div>
            <div className="p-2 md:p-10">
                <Form
                    reloadOnSubmit={false}
                    onSubmit={(values: TStoreValues) => onSubmit(values)}
                    render={({ handleSubmit, values }) => (
                        <form onSubmit={handleSubmit} className="md:grid md:grid-cols-12 gap-4">
                            <div className="col-span-2">
                                <Field
                                    id="shopImgUrl"
                                    hint="Upload a shop image"
                                    component={WrappedFileUpload}
                                    validate={shop_validate_file_upload}
                                    label="Shop image"
                                    name="shopImgUrl"
                                    accept="image/*"
                                />
                            </div>
                            <div className="col-span-5">
                                <div className="flex flex-col gap-4">
                                    <Field
                                        id="storeName"
                                        validate={validation_required}
                                        type="text"
                                        label="Shop Name"
                                        placeholder="Enter store name"
                                        component={WrappedInput}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="storeName"
                                    />
                                    <Field
                                        id="uniqueName"
                                        validate={validation_required}
                                        type="text"
                                        label="Unique name"
                                        placeholder="Enter a name for your shop"
                                        component={WrappedInputForUniqueName}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="uniqueName"
                                    />
                                    <Field
                                        id="district"
                                        // validate={validation_required}
                                        type="text"
                                        label="District"
                                        placeholder="Enter store district"
                                        component={WrappedSelect}
                                        options={districts}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="district"
                                    />
                                    <Field
                                        id="location"
                                        type="text"
                                        label="Location"
                                        placeholder="Enter store location"
                                        component={WrappedLocation}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="location"
                                    />
                                    <Field
                                        id="email"
                                        type="text"
                                        label="Email"
                                        placeholder="Enter store email"
                                        component={WrappedInput}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="email"
                                    />
                                    <div className="flex border-none text-white-dark">
                                        <Field id="wholeSale" type="checkbox" className="placeholder:text-white-dark" name="wholeSale" label="Whole sale" component={WrappedCheckbox} />
                                        <Field id="retail" type="checkbox" label="Retail" component={WrappedCheckbox} className="placeholder:text-white-dark" name="retail" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-5">
                                <div className="flex flex-col gap-4">
                                    <Field
                                        id="category"
                                        validate={validation_required}
                                        type="text"
                                        label="Category"
                                        placeholder="Category"
                                        options={categoryOptions}
                                        component={WrappedSelect}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="category"
                                    />
                                    <Field
                                        id="address"
                                        validate={validation_required}
                                        type="text"
                                        label="Address"
                                        placeholder="Enter store address"
                                        component={WrappedInput}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="address"
                                    />
                                    <Field
                                        id="phone"
                                        validate={validation_required}
                                        type="text"
                                        label="Phone"
                                        placeholder="Enter store phone number"
                                        component={WrappedInput}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="phone"
                                    />
                                    <Field
                                        id="storeOwnerName"
                                        validate={validation_required}
                                        type="text"
                                        label="Shop Owner Name"
                                        placeholder="Enter store owner name"
                                        component={WrappedInput}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        name="storeOwnerName"
                                    />
                                    <Field id="bio" type="text" label="Bio" placeholder="Enter store bio" component={wrapidQuill} className="placeholder:text-white-dark" name="bio" />
                                </div>
                            </div>
                            <div className="col-span-12 flex justify-end">
                                <button type="submit" className="btn bg-green-600 text-white md:w-full   hover:bg-green-500">
                                    {loading ? <Spinner color={'info'} /> : 'Save'}
                                </button>
                            </div>
                        </form>
                    )}
                />
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
}

export default StoreAdding;
